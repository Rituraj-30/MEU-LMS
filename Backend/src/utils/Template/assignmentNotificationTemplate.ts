
interface AssignmentMailProps {
    studentName: string;
    title: string;
    topic: string;
    subjectCode: string;
    deadline: string;
}

const assignmentNotificationTemplate = ({
    studentName,
    title,
    topic,
    subjectCode,
    deadline
}: AssignmentMailProps): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Assignment Posted</title>
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
                                <h1 style="margin: 0; font-size: 20px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">NEW <span style="color: #ea580c;">ASSIGNMENT</span></h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.5px;">Assignment Alert!</h2>
                                <p style="font-size: 15px; margin: 0 0 20px 0;">Hello <strong>${studentName}</strong>,</p>
                                <p style="font-size: 14px; color: #475569; line-height: 1.6; margin: 0 0 25px 0;">A new academic assignment has been posted for your subject. Please review the details below and ensure timely submission.</p>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="20" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; margin-bottom: 25px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 11px; font-weight: 900; color: #ea580c; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #ea580c; display: inline-block; margin-bottom: 15px;">Submission Details</div>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Subject Code</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${subjectCode}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Title</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${title}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Topics</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${topic}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 12px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Deadline</td>
                                                    <td align="right" style="padding: 12px 0; font-size: 16px; font-weight: 900; color: #dc2626;">${deadline}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="15" border="0" style="background-color: #fff1f2; border-left: 4px solid #be123c; border-radius: 8px; margin-bottom: 25px;">
                                    <tr>
                                        <td>
                                            <p style="margin: 0; font-size: 13px; color: #9f1239; font-weight: 600;">
                                                ⚠️ <strong>Important:</strong> Assignment submission is mandatory. Late submissions will not be accepted under any circumstances.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <a href="https://your-portal-link.com/assignments" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">View Assignment</a>
                                        </td>
                                    </tr>
                                </table>

                                <p style="margin-top: 30px; font-size: 14px; color: #64748b; text-align: center;">Best Regards,<br><strong>Academic Department</strong></p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background-color: #f1f5f9; padding: 25px; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                <p style="margin: 0 0 5px 0;">Course Management System • Assignment Notification</p>
                                <p style="margin: 0;">&copy; 2026 Your University • All Rights Reserved</p>
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

export default assignmentNotificationTemplate;