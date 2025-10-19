import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  });
};

// Email templates
export const emailTemplates = {
  approval: (candidateName) => ({
    subject: 'Congratulations! Your Doctor Registration Has Been Approved',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Congratulations!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your doctor registration has been approved</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear Dr. ${candidateName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            We are pleased to inform you that your application to join our medical platform has been <strong style="color: #28a745;">approved</strong>!
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">What's Next?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Your profile is now active on our platform</li>
              <li>You can start accepting patients and managing appointments</li>
              <li>Access your dashboard using your registered credentials</li>
              <li>Complete your profile setup if any information is missing</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Important Information</h3>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              Please ensure you maintain the highest standards of medical practice and adhere to our platform's 
              terms of service. Your patients' safety and well-being are our top priority.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            If you have any questions, please contact our support team.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  rejection: (candidateName, reason = '') => ({
    subject: 'Doctor Registration Application Update',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Application Update</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your doctor registration application</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${candidateName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Thank you for your interest in joining our medical platform. After careful review of your application, 
            we regret to inform you that we are unable to approve your registration at this time.
          </p>
          
          ${reason ? `
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Reason for Rejection</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          ` : ''}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">Next Steps</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Review the feedback provided above</li>
              <li>Address any issues or missing requirements</li>
              <li>You may reapply after making necessary improvements</li>
              <li>Ensure all credentials and documentation are complete and valid</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">We're Here to Help</h3>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              If you have questions about this decision or need guidance on how to improve your application, 
              please don't hesitate to contact our support team. We're committed to helping qualified medical 
              professionals join our platform.
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            Thank you for your understanding.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
export const sendEmail = async (to, template, data = {}) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template](data.candidateName, data.reason);
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@fyp.com',
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmail, emailTemplates };
