import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { Assignment } from "../../models/Assignment.Model";
import { Subject } from "../../models/Subject.Model";
import { Test } from "../../models/Test.Model";
import mailSender from "../../utils/mailSender"
import {SemesterData} from "../../models/Semester.Model";

import  assignmentNotificationTemplate  from "../../utils/Template/assignmentNotificationTemplate"
import testNotificationTemplate from "../../utils/Template/testNotificationTemplate"



const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, topics, deadline, totalMarks, subjectCode } = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }
    
    if (!title || !topics || !subjectCode) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const sanitizedCode = subjectCode.trim();
    const subjectData = await Subject.findOne({
      subjectCode: { $regex: new RegExp(`^${sanitizedCode}$`, "i") },
    });

    if (!subjectData) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    // AI Prompt
    const prompt = `Generate 5 academic simple questions based on: ${topics.join(", ")}. 
                    Return strictly in this JSON format:
                    { 
                      "questions": ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"], 
                      "reference": "Model answers here..." 
                    }`;

    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt, 
    });

    const responseText = result.text;
    
    if (!responseText) {
      return res.status(500).json({ success: false, message: "AI response is empty." });
    }

    let aiData;
    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      aiData = JSON.parse(cleanJson);
    } catch (parseError) {
      return res.status(500).json({ success: false, message: "AI response format is invalid." });
    }

    let finalQuestions: string[] = [];
    if (Array.isArray(aiData.questions)) {
        finalQuestions = aiData.questions;
    } else if (typeof aiData.questions === 'string') {
        finalQuestions = aiData.questions.split('\n').filter((q: string) => q.trim() !== "");
    }

    const newAssignment = new Assignment({
      title: title,
      topic: topics.join(", "),
      questions: finalQuestions,
      deadline: new Date(deadline),
      totalMarks: totalMarks || 10,
      teacherId: userId,
      subjectCode: subjectCode,
      semesterGroupId: subjectData.semesterGroupId,
      fileUrl: "AI_GENERATED"
    });

    await newAssignment.save();

   
    try {
      const semesterInfo = await SemesterData.findById(subjectData.semesterGroupId).populate("students");

      if (semesterInfo && semesterInfo.students.length > 0) {
       
        const emailPromises = semesterInfo.students.map((student: any) => {
          const mailContent = assignmentNotificationTemplate({
            studentName: student.name,
            title: title,
            topic: topics.join(", "),
            subjectCode: subjectCode,
            deadline: new Date(deadline).toLocaleString(),
          });

          // console.log(`Sending email to ${student.email} about new assignment: ${title}`);

          return mailSender(
            student.email,
            `New Assignment Alert: ${title}`,
            mailContent
          );
        });

        
        await Promise.all(emailPromises);
      }
    } catch (mailErr) {
      console.error("Mail Sending Error:", mailErr);

    }

    return res.status(201).json({
      success: true,
      message: "Assignment created successfully and students notified!",
      data: newAssignment,
    });

  } catch (error: any) {
    console.error("Gemini 3 Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const createTest = async (req: Request, res: Response) => {
  try {
    const { testName, topics, testDate, duration, subjectCode } = req.body;
    const userId = (req as any).user?.id || (req as any).user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized access." });
    }

    // console.log("working....")
    if (!testName || !topics || !subjectCode || !testDate || !duration) {
      return res.status(400).json({ success: false, message: "Required fields are missing." });
    }

    const sanitizedCode = subjectCode.trim();
    const subjectData = await Subject.findOne({
      subjectCode: { $regex: new RegExp(`^${sanitizedCode}$`, "i") },
    });

    if (!subjectData) {
      return res.status(404).json({ success: false, message: "Subject not found." });
    }

    // . AI Prompt 
    const prompt = `Generate 30 tricky multiple-choice questions (MCQs) in English based on these topics: ${topics.join(", ")}. 
                    Each question must have exactly 4 options and one correct answer string.
                    Return ONLY a valid JSON object.
                    Format:
                    {
                      "questions": [
                        {
                          "questionText": "Write the question here?",
                          "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                          "correctAnswer": "The exact string of the correct option"
                        }
                      ]
                    }`;

    // . AI Call
     const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt, 
    });

    const responseText = result.text;
    

    if (!responseText) {
      return res.status(500).json({ success: false, message: "AI response is empty." });
    }


    let aiData;
    try {
      const cleanJson = responseText.replace(/```json|```/g, "").trim();
      aiData = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("JSON Parse Error:", responseText);
      return res.status(500).json({ success: false, message: "AI generated invalid JSON. Please try again." });
    }

    const rawQuestions = aiData.questions || [];
    if (rawQuestions.length === 0) {
        return res.status(500).json({ success: false, message: "No questions generated by AI." });
    }

    
    const newTest = new Test({
      testName: testName,
      subjectCode: subjectCode,
      groupId: subjectData.semesterGroupId, 
      testDate: new Date(testDate),
      duration: Number(duration),
      maxMarks: rawQuestions.length, 
      questions: rawQuestions,
      results: []
    });

    await newTest.save();
    try {
        // SemesterGroupId se students fetch karo
        const semesterData = await SemesterData.findById(subjectData.semesterGroupId).populate("students");

        if (semesterData && semesterData.students.length > 0) {
            const emailPromises = semesterData.students.map((student: any) => {
                const mailContent = testNotificationTemplate({
                    studentName: student.name,
                    testName: testName,
                    subjectCode: subjectCode,
                    testDate: new Date(testDate).toLocaleString(),
                    duration: duration.toString(),
                    totalQuestions: rawQuestions.length
                });

                return mailSender(
                    student.email,
                    `Assessment Alert: ${testName} Scheduled`,
                    mailContent
                );
            });

            await Promise.all(emailPromises);
        }
    } catch (mailError) {
        console.error("Test Notification Mail Error:", mailError);
    }

    return res.status(201).json({
      success: true,
      message: `Test "${testName}" scheduled successfully with ${rawQuestions.length} MCQs.`,
      data: {
          testId: newTest._id,
          totalQuestions: rawQuestions.length
      },
    });

  } catch (error: any) {
    console.error("Test Creation Error:", error);
    return res.status(500).json({ success: false,message: "AI Server busy ", error: error.message });
  }
};