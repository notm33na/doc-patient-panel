# 📧 Email Configuration Guide for Tabeeb Medical Platform

## Overview
This guide will help you set up email notifications for candidate approval and rejection.

## 🔧 Gmail SMTP Setup

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled

### Step 2: Generate App Password
1. Go to Google Account → Security → 2-Step Verification
2. Scroll down to "App passwords"
3. Click "App passwords"
4. Select "Mail" and "Other (custom name)"
5. Enter "Tabeeb Medical Platform" as the name
6. Copy the generated 16-character password

### Step 3: Configure Environment Variables
Create a `.env` file in `src/backend/` with:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Port
PORT=5000
```

## 📧 Email Templates

### Approval Email Features:
- ✅ Professional congratulations message
- ✅ Next steps for new doctors
- ✅ Dashboard access link
- ✅ Beautiful HTML styling
- ✅ Support contact information

### Rejection Email Features:
- ✅ Respectful rejection message
- ✅ Specific rejection reason (if provided)
- ✅ Guidance for reapplication
- ✅ Support contact information
- ✅ Professional styling

## 🧪 Testing Email Configuration

### Test 1: Configuration Check
```bash
cd src/backend
node test-email-config.js
```

### Test 2: Send Test Emails
1. Edit `test-email-config.js`
2. Uncomment the last line: `testSendEmail();`
3. Replace `test@example.com` with your test email
4. Run: `node test-email-config.js`

## 🎯 How It Works

### When Admin Approves Candidate:
1. Admin clicks "Approve" in the frontend
2. Backend moves candidate to Doctor collection
3. **Email automatically sent** with approval message
4. Candidate receives professional welcome email

### When Admin Rejects Candidate:
1. Admin clicks "Reject" and provides reason
2. Backend removes candidate from pending collection
3. **Email automatically sent** with rejection message
4. Candidate receives respectful rejection email with feedback

## 🔍 Troubleshooting

### Common Issues:

1. **"Invalid login" error:**
   - Check if 2FA is enabled
   - Verify app password is correct
   - Ensure EMAIL_USER is correct

2. **"Connection timeout" error:**
   - Check internet connection
   - Verify Gmail SMTP settings
   - Try different email service

3. **"Email not received":**
   - Check spam folder
   - Verify email address is correct
   - Check email service logs

### Debug Steps:
1. Run `node test-email-config.js`
2. Check console output for errors
3. Verify environment variables
4. Test with different email addresses

## 📱 Email Service Integration

The email service is already integrated into:
- ✅ `PendingDoctorRoute.js` - Approval/Rejection endpoints
- ✅ `emailService.js` - Email templates and sending
- ✅ Automatic error handling (won't fail approval/rejection if email fails)

## 🎉 Success Indicators

When properly configured, you should see:
- ✅ Console logs: "Approval email sent successfully"
- ✅ Console logs: "Rejection email sent successfully"
- ✅ Candidates receive professional emails
- ✅ No errors in server logs

## 📞 Support

If you encounter issues:
1. Check the console logs for specific error messages
2. Verify your Gmail app password is correct
3. Ensure 2FA is enabled on your Google account
4. Test with a different email address

---

**Note:** The email system is already fully implemented and will work automatically once configured!
