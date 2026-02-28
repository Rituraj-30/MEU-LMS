import { Request, Response } from "express";
import { Assignment } from "../../models/Assignment.Model";
import {User} from"../../models/User.Model"
import { Submission } from "../../models/Submission.Model";

import { uploadToCloudinary } from "../../utils/imgUploder"; 

import { GoogleGenAI } from "@google/genai";
import { extractTextFromPdf } from "../../utils/pdfRead";


import { Test } from "../../models/Test.Model";




export const getStudentAssignments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id; 
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized." });

    const userData = await User.findById(userId).select('studentDetails.semesterGroupId');
    if (!userData?.studentDetails?.semesterGroupId) {
      return res.status(400).json({ success: false, message: "No group assigned." });
    }

    const actualGroupId = userData.studentDetails.semesterGroupId;

   
    const assignments = await Assignment.find({ semesterGroupId: actualGroupId })
      .populate('teacherId', 'name email profileimg')
      .sort({ createdAt: -1 })
      .lean(); 

    //  Check submission status for each assignment
    const assignmentsWithStatus = await Promise.all(assignments.map(async (assignment: any) => {
      const submission = await Submission.findOne({ 
        assignmentId: assignment._id, 
        studentId: userId 
      }).select('submittedAt marksObtained');

      return {
        ...assignment,
        isSubmitted: !!submission,
        submissionDetails: submission || null
      };
    }));

    // console.log(assignmentsWithStatus)
    return res.status(200).json({
      success: true,
      count: assignmentsWithStatus.length,
      data: assignmentsWithStatus
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const submitAssignment = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id;
    const { assignmentId } = req.body;
    const file = (req as any).files?.submissionFile;

    if (!assignmentId || !file) {
      return res.status(400).json({ success: false, message: "Missing fields." });
    }

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: "Assignment not found." });

    const pdfText = await extractTextFromPdf(file);
    if (!pdfText) {
      return res.status(400).json({ success: false, message: "Could not read PDF text." });
    }

    
    const gradingPrompt = `
      You are an academic evaluator. 
      Assignment Questions: ${assignment.questions.join(" | ")}
      Total Marks: ${assignment.totalMarks || 20}
      Student's Submission Text: ${pdfText}

      Task: Grade the submission based on the questions. 
      Return strictly in this JSON format:
      {
        "marksObtained": number,
        "feedback": "short feedback string",
        "aiAnalysis": "brief breakdown"
      },
      dont give full mark 
      `;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: [{ role: "user", parts: [{ text: gradingPrompt }] }], 
    });

    const responseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (!responseText) {
      return res.status(500).json({ success: false, message: "AI response is empty." });
    }

    let gradingData;
    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      gradingData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Parse Error:", responseText);
      return res.status(500).json({ success: false, message: "AI response format is invalid." });
    }

    const uploadResult = await uploadToCloudinary(file, { 
      folder: "student_submissions",
      resource_type: "auto" 
    });

    const newSubmission = await Submission.create({
      assignmentId,
      studentId: userId,
      submissionFile: uploadResult.secure_url,
      marksObtained: gradingData.marksObtained || 0, 
      feedback: gradingData.feedback || "No feedback provided",
      submittedAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: "Assignment submitted and graded by AI!",
      obtainedMarks: gradingData.marksObtained,
      feedback: gradingData.feedback,
      data: newSubmission
    });

  } catch (error: any) {
    console.error("Submission Error:", error);
    return res.status(500).json({ success: false, message: "Failed to submit assignment" });
  }
};






export const getStudentTests = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id || (req as any).user?._id; 
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    const userData = await User.findById(userId).select('studentDetails.semesterGroupId');
    
    if (!userData?.studentDetails?.semesterGroupId) {
      return res.status(400).json({ 
        success: false, 
        message: "No semester group assigned to this student." 
      });
    }

    const actualGroupId = userData.studentDetails.semesterGroupId;

    
    const tests = await Test.find({ groupId: actualGroupId })
      .sort({ testDate: 1 })
      .lean();

    const testsWithStatus = tests.map((test: any) => {
      const myResult = test.results?.find(
        (r: any) => r.studentId.toString() === userId.toString()
      );

      return {
        ...test,
        isAttempted: !!myResult, // Agar result mila toh true, warna false
        scoreDetails: myResult || null,
        isExpired: new Date() > new Date(test.testDate)
      };
    });

    // console.log("testsWithStatus -> ",testsWithStatus)
    return res.status(200).json({
      success: true,
      count: testsWithStatus.length,
      data: testsWithStatus
    });

  } catch (error: any) {
    console.error("Error in getStudentTests:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error", 
      error: error.message 
    });
  }
};









export const joinTest = async (req: Request, res: Response) => {
  try {
    const { testId } = req.params;
    const userId = (req as any).user?.id || (req as any).user?._id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });


    const currentTime = new Date();
    const startTime = new Date(test.testDate);
    const joinWindowEnd = new Date(startTime.getTime() + 5 * 60000); 
    const testEndTime = new Date(startTime.getTime() + test.duration * 60000);

 
    const alreadyAttempted = test.results.find(r => r.studentId.toString() === userId.toString());
    if (alreadyAttempted) {
      return res.status(400).json({ success: false, message: "You have already attempted this test." });
    }

    // console.log(currentTime, startTime, joinWindowEnd, testEndTime)
 
    if (currentTime < startTime) {
      return res.status(400).json({ success: false, message: "Test has not started yet." });
    }

    // . Check if 5-minute joining window is missed
    if (currentTime > joinWindowEnd && currentTime < testEndTime) {
       return res.status(403).json({ success: false, message: "Entry closed! You are more than 5 minutes late." });
    }

    if (currentTime > testEndTime) {
      return res.status(400).json({ success: false, message: "Test duration has ended." });
    }

    const secureQuestions = test.questions.map(q => ({
        questionText: q.questionText,
        options: q.options,
        _id: (q as any)._id
    }));

    return res.status(200).json({
      success: true,
      message: "Test joined successfully.",
      data: {
        testName: test.testName,
        duration: test.duration,
        questions: secureQuestions,
        endTime: testEndTime 
      }
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};






export const submitTest = async (req: Request, res: Response) => {
  try {
    const { testId, answers } = req.body; 
    const userId = (req as any).user?.id || (req as any).user?._id;

    const test = await Test.findById(testId);
    if (!test) return res.status(404).json({ success: false, message: "Test not found." });

    // Check if already submitted
    const alreadySubmitted = test.results.find(r => r.studentId.toString() === userId.toString());
    if (alreadySubmitted) {
      return res.status(400).json({ success: false, message: "Test already submitted." });
    }

    let marksScored = 0;

    
    test.questions.forEach((q: any) => {
     
      const questionId = q._id.toString(); 
      const studentAnswer = answers[questionId];

      if (studentAnswer === q.correctAnswer) {
        marksScored++;
      }
    });

    // Save result
    test.results.push({
      studentId: userId,
      marksScored: marksScored,
      remarks: marksScored >= (test.questions.length / 2) ? "Passed" : " Fails...Needs Improvement"
    });

    await test.save();

    return res.status(200).json({
      success: true,
      message: "Test submitted successfully.",
      score: marksScored,
      total: test.questions.length
    });

  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};