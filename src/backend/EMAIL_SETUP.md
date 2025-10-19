# Email Configuration Setup

## Required Environment Variables

Add the following environment variables to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:3000
```

## Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Use this password as `EMAIL_PASS`

## Alternative Email Services

You can modify the email service in `src/backend/utils/emailService.js` to use other providers:

- **Outlook**: Change service to 'hotmail'
- **Yahoo**: Change service to 'yahoo'
- **Custom SMTP**: Replace the service configuration with custom SMTP settings

## Email Templates

The system includes two email templates:

### Approval Email

- Congratulatory message
- Instructions for next steps
- Link to dashboard access

### Rejection Email

- Professional rejection notice
- Optional reason for rejection
- Guidance for reapplication

## Testing

To test email functionality:

1. Set up your environment variables
2. Install dependencies: `npm install`
3. Start the server: `npm run dev`
4. Approve or reject a candidate through the admin panel

## Troubleshooting

- **Authentication Error**: Check your email credentials and app password
- **SMTP Error**: Verify your email service settings
- **Email Not Sending**: Check console logs for detailed error messages

The email service is designed to fail gracefully - if email sending fails, the approval/rejection process will still complete successfully.
