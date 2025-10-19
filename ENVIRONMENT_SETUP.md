# Environment Variables Setup Guide

## Required Environment Variables

Create a `.env` file in the `src/backend/` directory with the following variables:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production

# Email Configuration (Gmail SMTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server Port
PORT=5000
```

## Setup Instructions

1. **MongoDB Atlas Setup**:
   - Create a MongoDB Atlas account
   - Create a cluster and database
   - Get your connection string and replace the placeholder values

2. **JWT Secret**:
   - Generate a strong, random secret key
   - Use at least 32 characters
   - Keep this secret secure

3. **Email Configuration**:
   - Enable 2-factor authentication on your Gmail account
   - Generate an app password for "Mail"
   - Use the app password as EMAIL_PASS

4. **Frontend URL**:
   - Set to your frontend application URL
   - Use `http://localhost:3000` for local development

## Security Notes

- Never commit `.env` files to version control
- Use different values for development, staging, and production
- Rotate secrets regularly
- Use strong, unique passwords for all services
