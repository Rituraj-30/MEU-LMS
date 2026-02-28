
interface StudentWelcomeProps {
    name: string;
    email: string;
    password: string;
    rollNo: string;
    courseName: string;
    currentYear: number;
    currentSem: number;
    parentName: string;
    parentContact: string;
}



const studentWelcomeTemplate = ({
    name,
    email,
    password,
    rollNo,
    courseName,
    currentYear,
    currentSem,
    parentName,
    parentContact
}: StudentWelcomeProps): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Student Admission Confirmed</title>
    </head>
    <body style="font-family: 'Segoe UI', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #0f172a;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
                <td align="center" style="padding: 20px 0;">
                    <table class="container" role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);">
                        
                        <tr>
                            <td align="center" style="background-color: #0f172a; padding: 40px 20px;">
                                <div style="background-color: rgba(255,255,255,0.05); display: inline-block; padding: 15px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); margin-bottom: 15px;">
                                    <img src="https://res.cloudinary.com/dnkhmmcgf/image/upload/v1772192357/logo_h7haac.png" alt="Logo" width="120" style="display: block; outline: none; border: none; text-decoration: none;">
                                </div>
                                <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px;">STUDENT <span style="color: #ea580c;">PORTAL</span></h1>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="font-size: 24px; font-weight: 900; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.5px;">Welcome to the Campus!</h2>
                                <p style="font-size: 15px; margin: 0 0 20px 0;">Dear <strong>${name}</strong>,</p>
                                <p style="font-size: 14px; color: #475569; margin: 0 0 25px 0;">Congratulations! Your admission to <strong>${courseName}</strong> has been successfully processed. You can now access your learning materials through the portal.</p>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="20" border="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 20px; margin-bottom: 25px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 11px; font-weight: 900; color: #ea580c; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #ea580c; display: inline-block; margin-bottom: 15px;">Academic Profile</div>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tr style="border-bottom: 1px solid #f1f5f9;">
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Roll Number</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${rollNo}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Course</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">${courseName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase;">Semester</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #0f172a;">Year ${currentYear}, SEM ${currentSem}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="20" border="0" style="background-color: #0f172a; border-radius: 20px; margin-bottom: 25px;">
                                    <tr>
                                        <td>
                                            <div style="font-size: 11px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 2px solid #ffffff; display: inline-block; margin-bottom: 15px;">Login Credentials</div>
                                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Email</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #ffffff;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding: 8px 0; font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase;">Password</td>
                                                    <td align="right" style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #ea580c;">${password}</td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>

                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <a href="https://your-portal-link.com/login" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px;">Login to Student Portal</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="background-color: #f1f5f9; padding: 25px; font-size: 11px; color: #94a3b8; font-weight: 600;">
                                <p style="margin: 0 0 5px 0;">University Student Administration • Session 2025-26</p>
                                <p style="margin: 0;">&copy; 2026 Your Campus Portal • All Rights Reserved</p>
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



export default studentWelcomeTemplate;