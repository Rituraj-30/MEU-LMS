

interface WelcomeMailProps {
    firstName: string;
    email: string;
    password: string;
    departmentName: string;
}

const hodWelcomeTemplate = ({
    firstName,
    email,
    password,
    departmentName
}: WelcomeMailProps): string => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HOD Appointment</title>
        <style>
            body { font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #0f172a; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { width: 100%; max-width: 600px; margin: 20px auto; border: 1px solid #e2e8f0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); background-color: #ffffff; }
            
            /* Header Matched with Slate-900 */
            .header { background-color: #0f172a; padding: 40px 20px; text-align: center; }
            
            /* Logo Styling Fix */
            .logo-wrapper { background-color: rgba(255,255,255,0.05); display: inline-block; padding: 15px; border-radius: 20px; margin-bottom: 15px; border: 1px solid rgba(255,255,255,0.1); }
            .header img { display: block; width: auto; max-height: 80px; margin: 0 auto; }
            
            .header h1 { margin: 0; font-size: 20px; font-weight: 900; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; }
            .header h1 span { color: #ea580c; } /* Orange-600 accent */

            .content { padding: 40px 30px; }
            .welcome-text { font-size: 20px; font-weight: 900; color: #0f172a; margin-bottom: 12px; letter-spacing: -0.5px; }
            
            /* Orange accent highlight */
            .highlight { color: #ea580c; font-weight: 800; }

            /* Details Box Matched with Slate-50 and Border */
            .details-box { background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 25px; margin: 30px 0; border-radius: 20px; }
            .details-row { margin-bottom: 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
            .details-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .label { font-weight: 800; color: #64748b; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; width: 140px; display: inline-block; }
            .value { color: #0f172a; font-weight: 700; font-size: 15px; }

            /* CTA Button Matched with Slate-900 style */
            .cta-button { display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff !important; text-decoration: none; border-radius: 14px; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; margin: 20px 0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .cta-button:hover { background-color: #ea580c; }

            .footer { background-color: #f1f5f9; padding: 25px; text-align: center; font-size: 11px; color: #94a3b8; font-weight: 600; }
            .footer-links { margin-top: 10px; color: #64748b; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo-wrapper">
                    <img src="./logo.png" alt="University Logo">
                </div>
                <h1>Course <span>Management</span></h1>
            </div>
            <div class="content">
                <p class="welcome-text">Appointment Notification</p>
                <p>Dear Prof. <strong>${firstName}</strong>,</p>
                <p>We are excited to welcome you as the <span class="highlight">Head of Department (HOD)</span> for <strong>${departmentName}</strong>. Your account has been provisioned with full administrative access.</p>
                
                <div class="details-box">
                    <div class="details-row">
                        <span class="label">Academic Dept</span>
                        <span class="value">${departmentName}</span>
                    </div>
                    <div class="details-row">
                        <span class="label">Admin Email</span>
                        <span class="value">${email}</span>
                    </div>
                    <div class="details-row">
                        <span class="label">Temporary Pwd</span>
                        <span class="value" style="color: #ea580c;">${password}</span>
                    </div>
                </div>

                <p style="color: #64748b; font-size: 12px; font-style: italic; font-weight: 500;">
                    Note: For security, please change this temporary password during your first session.
                </p>
                
                <div style="text-align: center;">
                    <a href="https://your-portal-link.com" class="cta-button">Access Admin Dashboard</a>
                </div>

                <p style="margin-top: 30px; font-size: 14px;">Regards,<br><strong>Academic Administration</strong></p>
            </div>
            <div class="footer">
                <p>This is an official system-generated notification.<br>Academic Year 2025-26 • Program Management</p>
                <p class="footer-links">&copy; 2026 Your University Portal • All Rights Reserved</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default hodWelcomeTemplate;