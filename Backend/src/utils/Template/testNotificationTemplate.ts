/**
 * Test Schedule Notification Template - Slate & Orange Theme
 */

interface TestMailProps {
    studentName: string;
    testName: string;
    subjectCode: string;
    testDate: string;
    duration: string;
    totalQuestions: number;
}

const testNotificationTemplate = ({
    studentName,
    testName,
    subjectCode,
    testDate,
    duration,
    totalQuestions
}: TestMailProps): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Test Scheduled</title>
    </head>
    <body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
                        
                        <tr>
                            <td align="center" style="background-color: #0f172a; padding: 40px 20px;">
                                <div style="background-color: rgba(255,255,255,0.05); display: inline-block; padding: 15px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                                    <img src="https://res.cloudinary.com/dnkhmmcgf/image/upload/v1772192357/logo_h7haac.png" alt="University Logo" width="100" style="display: block; outline: none; border: none;">
                                </div>
                                <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">ONLINE <span style="color: #ea580c;">ASSESSMENT</span></h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.5px;">New Test Scheduled!</h2>
                                <p style="font-size: 15px; margin: 0 0 20px 0;">Hi <strong>${studentName}</strong>,</p>
                                <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 25px 0;">An online test has been scheduled for your course. Please make sure you have a stable internet connection at the scheduled time.</p>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="20" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; margin-bottom: 25px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 11px; font-weight: 900; color: #ea580c; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #ea580c; display: inline-block; margin-bottom: 15px;">Examination Details</div>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Assessment</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${testName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Subject Code</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${subjectCode}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Date & Time</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${testDate}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Duration</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #ea580c;">${duration} Minutes</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">No. of MCQs</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${totalQuestions} Questions</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <div style="background-color: #f1f5f9; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                                    <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #0f172a;">Instructions:</h4>
                                    <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #475569;">
                                        <li>Join at least 5 minutes before the start time.</li>
                                        <li>The test will automatically close once the timer ends.</li>
                                        <li>Multiple window switching may lead to auto-submission.</li>
                                    </ul>
                                </div>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <a href="https://your-portal-link.com/tests" style="display: inline-block; padding: 16px 32px; background-color: #ea580c; color: #ffffff; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">Go to Test Portal</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background-color: #f1f5f9; padding: 25px; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                <p style="margin: 0 0 5px 0;">Automated Examination System • Session 2026</p>
                                <p style="margin: 0;">&copy; 2026 Your University • Academic Excellence</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

export default testNotificationTemplate;