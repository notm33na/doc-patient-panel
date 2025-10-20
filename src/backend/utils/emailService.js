import nodemailer from 'nodemailer';

// Email configuration
const createTransporter = () => {
  // Check if email configuration is available
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email configuration missing!');
    console.error('Please set EMAIL_USER and EMAIL_PASS in your .env file');
    console.error('Current EMAIL_USER:', process.env.EMAIL_USER ? 'Set' : 'Not set');
    console.error('Current EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASS in .env file');
  }

  console.log('📧 Email configuration found:');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Set' : 'Not set');

  return nodemailer.createTransport({
    service: 'gmail', // You can change this to other services like 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
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
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" 
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
  }),
  
  deletion: (doctorName, reason = '') => ({
    subject: 'Account Termination Notice - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⚠️ Account Termination</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your doctor account has been removed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear Dr. ${doctorName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            We are writing to inform you that your doctor account has been <strong style="color: #dc3545;">terminated</strong> 
            from our medical platform effective immediately.
          </p>
          
          ${reason ? `
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">Reason for Termination</h3>
            <p style="color: #721c24; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          ` : ''}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">What This Means</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Your access to the platform has been permanently revoked</li>
              <li>All patient appointments and records are no longer accessible</li>
              <li>Your profile and credentials have been removed from our system</li>
              <li>You will not be able to re-register with the same credentials</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">Important Information</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
              Your credentials (email, phone, and license numbers) have been blacklisted to prevent 
              future registrations. If you believe this action was taken in error, please contact 
              our support team immediately.
            </p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Contact Support</h3>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              If you have any questions about this termination or believe there has been an error, 
              please contact our support team as soon as possible. We are committed to fair and 
              transparent processes.
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated notification. Please do not reply to this email.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  adminCreated: (adminName, adminEmail, adminRole, createdBy, password) => ({
    subject: 'Welcome! Your Admin Account Has Been Created - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Welcome!</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your admin account has been created</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${adminName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Congratulations! Your admin account has been successfully created on the FYP Medical Platform. 
            You now have administrative access to manage the system.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">Account Details</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Email:</strong> ${adminEmail}</li>
              <li><strong>Password:</strong> <span style="background: #f8f9fa; padding: 4px 8px; border-radius: 4px; font-family: monospace; font-weight: bold; color: #dc3545;">${password}</span></li>
              <li><strong>Role:</strong> ${adminRole}</li>
              <li><strong>Status:</strong> Active</li>
              <li><strong>Created By:</strong> ${createdBy}</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Important Security Notice</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
              <strong>Please change your password immediately after first login!</strong><br>
              Your temporary password is provided above. For security reasons, please:
              <br>• Change your password on first login
              <br>• Use a strong, unique password
              <br>• Never share your credentials with others
              <br>• Log out when finished
              <br>• Report any suspicious activity immediately
            </p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Next Steps</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Use the email and password above to log in</li>
              <li><strong>Change your password immediately</strong></li>
              <li>Complete your profile setup if needed</li>
              <li>Familiarize yourself with the admin dashboard</li>
              <li>Review your assigned permissions and responsibilities</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Login to Admin Dashboard
            </a>
          </div>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">🔒 Security Reminder</h3>
            <p style="color: #721c24; margin: 0; line-height: 1.6;">
              This email contains sensitive login information. Please:
              <br>• Delete this email after noting your credentials
              <br>• Do not forward this email to others
              <br>• Store your new password securely
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            If you have any questions, please contact the system administrator.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  adminDeleted: (adminName, adminEmail, deletedBy, reason = '') => ({
    subject: 'Admin Account Termination Notice - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">⚠️ Account Terminated</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your admin account has been removed</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${adminName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            We are writing to inform you that your admin account has been <strong style="color: #dc3545;">terminated</strong> 
            from the FYP Medical Platform effective immediately.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">Account Details</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Email:</strong> ${adminEmail}</li>
              <li><strong>Terminated By:</strong> ${deletedBy}</li>
              <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
              ${reason ? `<li><strong>Reason:</strong> ${reason}</li>` : ''}
            </ul>
          </div>
          
          ${reason ? `
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">Reason for Termination</h3>
            <p style="color: #721c24; margin: 0; line-height: 1.6;">${reason}</p>
          </div>
          ` : ''}
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">What This Means</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Your admin access has been permanently revoked</li>
              <li>You can no longer log into the admin dashboard</li>
              <li>All administrative privileges have been removed</li>
              <li>Your account data has been deleted from our system</li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Contact Information</h3>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              If you believe this action was taken in error or have questions about this termination, 
              please contact the system administrator immediately. We are committed to fair and 
              transparent administrative processes.
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated notification. Please do not reply to this email.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  passwordReset: (adminName, resetLink) => ({
    subject: 'Password Reset Request - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Reset your admin password</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${adminName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            We received a request to reset your admin password for the FYP Medical Platform. 
            If you made this request, please click the button below to reset your password.
          </p>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Important Security Notice</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
              <strong>This link will expire in 10 minutes for security reasons.</strong><br>
              If you don't reset your password within this time, you'll need to request a new reset link.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; font-size: 16px;">
              Reset My Password
            </a>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">Security Information</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>This link can only be used once</li>
              <li>The link expires after 10 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>Your current password remains unchanged until you complete the reset</li>
            </ul>
          </div>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">🔒 Security Reminder</h3>
            <p style="color: #721c24; margin: 0; line-height: 1.6;">
              If you didn't request this password reset, please:
              <br>• Ignore this email
              <br>• Check your account for any suspicious activity
              <br>• Contact support if you have concerns
              <br>• Consider changing your password manually if you suspect unauthorized access
            </p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Need Help?</h3>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              If you're having trouble with the reset link or have any questions, 
              please contact our support team. We're here to help ensure your account security.
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated email. Please do not reply to this message.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  emailVerification: (adminName, otp, currentEmail, newEmail) => ({
    subject: 'Email Verification OTP - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">📧 Email Verification</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Verify your new email address</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${adminName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            You have requested to change your email address from <strong>${currentEmail}</strong> to <strong>${newEmail}</strong>. 
            To complete this change, please use the verification code below.
          </p>
          
          <div style="background: white; padding: 30px; border-radius: 8px; margin: 20px 0; text-align: center; border: 2px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0; font-size: 18px;">Your Verification Code</h3>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #28a745; letter-spacing: 5px; font-family: monospace;">${otp}</span>
            </div>
            <p style="color: #6c757d; margin: 0; font-size: 14px;">Enter this code in the verification form</p>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Important Security Notice</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
              <strong>This verification code will expire in 10 minutes.</strong><br>
              If you don't verify your email within this time, you'll need to request a new verification code.
            </p>
          </div>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">Security Information</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>This code can only be used once</li>
              <li>The code expires after 10 minutes</li>
              <li>If you didn't request this change, please ignore this email</li>
              <li>Your current email remains unchanged until verification is complete</li>
            </ul>
          </div>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">🔒 Security Reminder</h3>
            <p style="color: #721c24; margin: 0; line-height: 1.6;">
              If you didn't request this email change, please:
              <br>• Ignore this email
              <br>• Check your account for any suspicious activity
              <br>• Contact support if you have concerns
              <br>• Consider changing your password if you suspect unauthorized access
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated email. Please do not reply to this message.<br>
            <strong>FYP Medical Platform</strong>
          </p>
        </div>
      </div>
    `
  }),
  
  emailChangeConfirmation: (adminName, newEmail, oldEmail) => ({
    subject: 'Email Change Confirmed - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✅ Email Changed Successfully</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your email address has been updated</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${adminName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            Your email address has been successfully changed from <strong>${oldEmail}</strong> to <strong>${newEmail}</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3 style="color: #28a745; margin-top: 0;">Change Summary</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Old Email:</strong> ${oldEmail}</li>
              <li><strong>New Email:</strong> ${newEmail}</li>
              <li><strong>Change Date:</strong> ${new Date().toLocaleDateString()}</li>
              <li><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Confirmed</span></li>
            </ul>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">What's Next?</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li>Use your new email address for all future logins</li>
              <li>Update any saved bookmarks or shortcuts</li>
              <li>Notify your team members of your new email address</li>
              <li>Check your spam folder if you don't receive future emails</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h3 style="color: #856404; margin-top: 0;">⚠️ Important Notice</h3>
            <p style="color: #856404; margin: 0; line-height: 1.6;">
              Your old email address (${oldEmail}) will no longer receive system notifications. 
              All future communications will be sent to your new email address.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:8080'}/login" 
               style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
              Login with New Email
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
  
  emailChangeNotification: (adminName, newEmail, oldEmail) => ({
    subject: 'Email Address Changed - FYP Medical Platform',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">📧 Email Address Changed</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Notification of email change</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${adminName},</h2>
          
          <p style="color: #555; line-height: 1.6; font-size: 16px;">
            This is to notify you that your email address has been changed from <strong>${oldEmail}</strong> to <strong>${newEmail}</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #6c757d;">
            <h3 style="color: #6c757d; margin-top: 0;">Change Details</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Previous Email:</strong> ${oldEmail}</li>
              <li><strong>New Email:</strong> ${newEmail}</li>
              <li><strong>Change Date:</strong> ${new Date().toLocaleDateString()}</li>
              <li><strong>Change Time:</strong> ${new Date().toLocaleTimeString()}</li>
            </ul>
          </div>
          
          <div style="background: #f8d7da; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc3545;">
            <h3 style="color: #721c24; margin-top: 0;">🔒 Security Notice</h3>
            <p style="color: #721c24; margin: 0; line-height: 1.6;">
              If you did not make this change, please:
              <br>• Contact support immediately
              <br>• Check your account for suspicious activity
              <br>• Consider changing your password
              <br>• Review your account security settings
            </p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">Next Steps</h3>
            <p style="color: #555; margin: 0; line-height: 1.6;">
              All future system notifications will be sent to your new email address. 
              Please update any saved login credentials or bookmarks to use your new email address.
            </p>
          </div>
          
          <p style="color: #777; font-size: 14px; text-align: center; margin-top: 30px;">
            This is an automated notification. Please do not reply to this email.<br>
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
    console.log(`📧 Attempting to send ${template} email to: ${to}`);
    console.log('Email data:', JSON.stringify(data, null, 2));
    
    const transporter = createTransporter();
    let emailTemplate;
    
    // Handle different template types
    if (template === 'deletion') {
      emailTemplate = emailTemplates[template](data.doctorName, data.reason);
    } else if (template === 'adminCreated') {
      emailTemplate = emailTemplates[template](data.adminName, data.adminEmail, data.adminRole, data.createdBy, data.password);
    } else if (template === 'adminDeleted') {
      emailTemplate = emailTemplates[template](data.adminName, data.adminEmail, data.deletedBy, data.reason);
    } else if (template === 'passwordReset') {
      emailTemplate = emailTemplates[template](data.adminName, data.resetLink);
    } else if (template === 'emailVerification') {
      emailTemplate = emailTemplates[template](data.adminName, data.otp, data.currentEmail, data.newEmail);
    } else if (template === 'emailChangeConfirmation') {
      emailTemplate = emailTemplates[template](data.adminName, data.newEmail, data.oldEmail);
    } else if (template === 'emailChangeNotification') {
      emailTemplate = emailTemplates[template](data.adminName, data.newEmail, data.oldEmail);
    } else {
      emailTemplate = emailTemplates[template](data.candidateName, data.reason);
    }
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };
    
    console.log('📤 Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

export default { sendEmail, emailTemplates };
