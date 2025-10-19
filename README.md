# Tabeeb - AI Medical Consultation System

## Project Overview

Tabeeb is a comprehensive healthcare platform that leverages AI technology to provide accessible, efficient, and quality medical consultation services. The system bridges the gap between patients and healthcare providers through intelligent automation, accessibility features, and comprehensive management tools for administrators and doctors.

---

## System Modules

### Module 1: AI Medical Consultation System
This module serves as the core medical consultation engine, providing users with immediate AI-powered healthcare guidance and emotional support assessment to ensure comprehensive patient care.

**Key Features:**
- AI chatbot for medical consultations and symptom assessment
- Real-time medical advice based on symptom input
- First aid tips and emergency medical guidance

### Module 2: Medical Report Analysis System
This module enables patients to upload and understand their medical reports through AI-powered interpretation, making complex medical information accessible to users with varying literacy levels.

**Key Features:**
- Medical report explainer for test results (CBC, MRI, X-rays)
- Image processing for report scanning and text extraction
- Layman's terms translation of medical terminology

### Module 3: Accessibility and Healthcare Navigation
This module provides voice-assisted user interactions and comprehensive healthcare facility location services to ensure accessible navigation and communication for all users.

**Key Features:**
- Voice-assisted login and signup functionality
- Multi-language text-to-speech and speech-to-text support (English and Urdu)
- Nearby hospital and pharmacy locator with Google Maps API and GPS integration

### Module 4: Health Education and Reference
This module offers educational content to improve health literacy and preventive care awareness.

**Key Features:**
- Medical dictionary with search functionality
- Blog and educational content management
- Medical terminology database maintenance
- Healthcare provider verification and credential management

### Module 5: Doctor Feedback and Rating System
This module enables patients to provide feedback and rate their consultation experience with healthcare providers. It uses sentiment analysis to monitor doctor performance based on patient feedback, enabling administrative actions to maintain service standards.

**Key Features:**
- Post-consultation rating system (1-5 stars)
- Detailed feedback forms for consultation quality assessment
- Anonymous feedback option for sensitive concerns
- Sentiment analysis of patient feedback and reviews
- Doctor performance scoring and trend analysis
- Flag system for consistently negative feedback
- Doctor suspension and ban management system

### Module 6: Doctor Consultation Management
This module provides healthcare providers with tools to manage patient consultations, access patient information, and deliver quality medical care through the platform.

**Key Features:**
- Patient consultation interface with call support
- Access to patient medical history and uploaded reports
- Prescription writing and management with calendar notifications
- Consultation scheduling and appointment management with payment integration

---

## Functional Requirements

### FR-1: AI Medical Consultation
- **FR-1.1:** System shall provide AI chatbot for medical consultations
- **FR-1.2:** System shall assess symptoms in real-time
- **FR-1.3:** System shall provide first aid tips and emergency guidance

### FR-2: Medical Report Analysis
- **FR-2.1:** System shall accept medical report uploads (CBC, MRI, X-rays)
- **FR-2.2:** System shall process and extract text from medical images
- **FR-2.3:** System shall translate medical terminology into layman's terms

### FR-3: Accessibility Features
- **FR-3.1:** System shall support voice-assisted login/signup
- **FR-3.2:** System shall provide text-to-speech and speech-to-text in English and Urdu
- **FR-3.3:** System shall locate nearby hospitals and pharmacies using GPS

### FR-4: Health Education
- **FR-4.1:** System shall maintain a searchable medical dictionary
- **FR-4.2:** System shall provide educational blog content
- **FR-4.3:** System shall manage healthcare provider credentials

### FR-5: Feedback and Rating
- **FR-5.1:** System shall allow patients to rate doctors (1-5 stars)
- **FR-5.2:** System shall collect detailed feedback from patients
- **FR-5.3:** System shall perform sentiment analysis on feedback
- **FR-5.4:** System shall flag doctors with consistently negative feedback
- **FR-5.5:** System shall enable admin to suspend/ban doctors

### FR-6: Doctor Consultation Management
- **FR-6.1:** System shall provide doctor interface for patient consultations
- **FR-6.2:** System shall grant doctors access to patient medical history
- **FR-6.3:** System shall enable prescription management
- **FR-6.4:** System shall handle appointment scheduling with payment integration

---

## Use Case Diagram

### Actors

1. **Patient**
   - Primary user seeking medical consultation and information
   - Interacts with AI chatbot, uploads reports, provides feedback

2. **Doctor**
   - Healthcare provider offering consultations
   - Manages appointments, accesses patient records, writes prescriptions

3. **Admin**
   - System administrator managing platform operations
   - Monitors feedback, manages doctors, handles content

4. **AI System**
   - Automated system providing medical consultation
   - Analyzes reports and performs sentiment analysis

### Use Cases

#### Patient Use Cases
- **UC-1:** Register/Login to System
  - *Includes:* Voice-Assisted Authentication
- **UC-2:** Consult AI Chatbot
  - *Includes:* Symptom Assessment, Emergency Guidance
- **UC-3:** Upload Medical Report
  - *Includes:* Report Analysis, Result Interpretation
- **UC-4:** Search Medical Dictionary
- **UC-5:** Read Educational Content
- **UC-6:** Find Nearby Healthcare Facilities
  - *Includes:* GPS Location Service
- **UC-7:** Book Doctor Appointment
  - *Includes:* Payment Processing
- **UC-8:** Rate and Review Doctor
  - *Includes:* Submit Feedback (Anonymous/Public)
- **UC-9:** Initiate Video/Voice Call with Doctor
- **UC-10:** View Prescription History

#### Doctor Use Cases
- **UC-11:** Register as Healthcare Provider
  - *Includes:* Credential Verification
- **UC-12:** View Patient Medical History
- **UC-13:** Conduct Consultation
  - *Includes:* Video/Voice Call
- **UC-14:** Write Prescription
- **UC-15:** Manage Appointment Schedule
- **UC-16:** View Patient Feedback
- **UC-17:** Update Profile and Credentials

#### Admin Use Cases
- **UC-18:** Verify Doctor Credentials
- **UC-19:** Review Doctor Candidates
  - *Includes:* Approve/Reject Application
- **UC-20:** Monitor Doctor Performance
  - *Includes:* View Feedback Analysis, Top-Ranked Doctors
- **UC-21:** Suspend/Ban Doctor
  - *Includes:* Review Flagged Comments
- **UC-22:** Manage Transaction Log
  - *Includes:* View Payment Records
- **UC-23:** Publish Educational Content
- **UC-24:** Manage Medical Dictionary
- **UC-25:** View System Analytics
- **UC-26:** Monitor Admin Activity Log
- **UC-27:** Add/Remove Admin Users

#### AI System Use Cases
- **UC-28:** Analyze Symptoms (automated)
- **UC-29:** Process Medical Reports (automated)
- **UC-30:** Perform Sentiment Analysis (automated)
- **UC-31:** Generate Report Interpretations (automated)

### Relationships

**Generalization:**
- Voice-Assisted Authentication *extends* Register/Login

**Include Relationships:**
- UC-2 includes Symptom Assessment
- UC-3 includes Report Analysis
- UC-7 includes Payment Processing
- UC-19 includes Approve/Reject Application
- UC-20 includes View Feedback Analysis

**Extend Relationships:**
- Anonymous Feedback extends UC-8
- Emergency Consultation extends UC-2

---

## Data Flow Diagram (DFD)

### Level 0: Context Diagram

**External Entities:**
- Patient
- Doctor
- Admin
- Payment Gateway
- GPS Service
- AI Engine

**System:** Tabeeb Medical Platform

**Data Flows:**
- Patient → System: Symptoms, Reports, Feedback, Appointment Requests
- System → Patient: Diagnosis, Report Analysis, Prescriptions, Educational Content
- Doctor → System: Prescriptions, Consultation Notes, Availability
- System → Doctor: Patient History, Appointment Schedule, Feedback
- Admin → System: Content, Doctor Approvals, System Configuration
- System → Admin: Analytics, Transaction Logs, Activity Reports
- System ↔ Payment Gateway: Payment Data, Transaction Status
- System ↔ GPS Service: Location Queries, Facility Data
- System ↔ AI Engine: Medical Queries, Analysis Requests

---

### Level 1: Major Processes

**Process 1.0: User Authentication**
- Input: Login credentials, Voice input
- Output: Authentication token, User session
- Data Stores: User Database

**Process 2.0: AI Medical Consultation**
- Input: Patient symptoms, Medical history
- Output: AI diagnosis, Treatment recommendations
- Data Stores: Consultation History, Medical Knowledge Base

**Process 3.0: Report Analysis**
- Input: Medical report images/documents
- Output: Interpreted results, Layman explanations
- Data Stores: Report Archive, Analysis Results

**Process 4.0: Appointment Management**
- Input: Booking requests, Doctor availability
- Output: Appointment confirmations, Schedules
- Data Stores: Appointment Database, Payment Records

**Process 5.0: Feedback Management**
- Input: Patient ratings, Comments
- Output: Sentiment scores, Performance metrics
- Data Stores: Feedback Database, Doctor Performance

**Process 6.0: Doctor Management**
- Input: Doctor applications, Credentials
- Output: Verification status, Profile updates
- Data Stores: Doctor Database, Credential Verification

**Process 7.0: Transaction Processing**
- Input: Payment information
- Output: Payment confirmation, Transaction records
- Data Stores: Transaction Log

**Process 8.0: Healthcare Navigation**
- Input: GPS location, Search queries
- Output: Nearby facilities, Directions
- Data Stores: Facility Database

---

### Level 2: Detailed Process Decomposition

#### Process 2.0: AI Medical Consultation (Detailed)

**Process 2.1: Symptom Input Processing**
- Input: Patient symptoms (text/voice)
- Output: Structured symptom data
- Data Stores: Symptom Database

**Process 2.2: Medical Analysis**
- Input: Structured symptoms, Patient history
- Output: Preliminary diagnosis
- Data Stores: Medical Knowledge Base, AI Models

**Process 2.3: Recommendation Generation**
- Input: Diagnosis results
- Output: Treatment recommendations, First aid tips
- Data Stores: Treatment Guidelines

**Process 2.4: Consultation History Recording**
- Input: Consultation details
- Output: Updated patient record
- Data Stores: Consultation History

---

#### Process 5.0: Feedback Management (Detailed)

**Process 5.1: Feedback Collection**
- Input: Ratings, Comments from patients
- Output: Stored feedback entries
- Data Stores: Feedback Database

**Process 5.2: Sentiment Analysis**
- Input: Feedback text
- Output: Sentiment scores, Keywords
- Data Stores: AI Models

**Process 5.3: Performance Calculation**
- Input: Feedback scores, Sentiment data
- Output: Doctor performance metrics
- Data Stores: Doctor Performance

**Process 5.4: Flag Detection**
- Input: Negative feedback patterns
- Output: Flagged doctor alerts
- Data Stores: Alert System

**Process 5.5: Administrative Action**
- Input: Performance metrics, Flags
- Output: Suspension/Ban decisions
- Data Stores: Doctor Database, Admin Activity Log

---

#### Process 6.0: Doctor Management (Detailed)

**Process 6.1: Application Submission**
- Input: Doctor credentials, Documents
- Output: Candidate record
- Data Stores: Candidate Database

**Process 6.2: Credential Verification**
- Input: Submitted credentials
- Output: Verification status
- Data Stores: Verification Records

**Process 6.3: Admin Review**
- Input: Verified applications
- Output: Approval/Rejection decision
- Data Stores: Doctor Database

**Process 6.4: Profile Management**
- Input: Profile updates from doctors
- Output: Updated doctor records
- Data Stores: Doctor Database

---

### Level 3: Report Analysis Process Decomposition

#### Process 3.1: Report Upload**
- Input: Medical report files (images/PDFs)
- Output: Stored report files
- Data Stores: Report Storage

**Process 3.2: Image Processing**
- Input: Report images
- Output: Extracted text
- Data Stores: OCR Engine

**Process 3.3: Medical Term Extraction**
- Input: Extracted text
- Output: Identified medical terms
- Data Stores: Medical Dictionary

**Process 3.4: Report Interpretation**
- Input: Medical terms, Test values
- Output: Layman explanations
- Data Stores: Interpretation Templates

**Process 3.5: Result Presentation**
- Input: Interpretations
- Output: Patient-friendly report
- Data Stores: Report Archive

---

## System Sequence Diagrams

### SSD-1: Patient AI Consultation

```
Actor: Patient
System: Tabeeb Platform

1. Patient → System: Login credentials
2. System → Patient: Authentication success
3. Patient → System: Open AI chatbot
4. System → Patient: Chatbot interface
5. Patient → System: Enter symptoms
6. System → AI Engine: Process symptoms
7. AI Engine → System: Diagnosis and recommendations
8. System → Patient: Display results
9. Patient → System: Request follow-up questions
10. System → AI Engine: Additional context
11. AI Engine → System: Detailed explanation
12. System → Patient: Show detailed response
13. System → Database: Save consultation history
```

---

### SSD-2: Medical Report Upload and Analysis

```
Actor: Patient
System: Tabeeb Platform

1. Patient → System: Login credentials
2. System → Patient: Authentication success
3. Patient → System: Navigate to report upload
4. System → Patient: Upload interface
5. Patient → System: Upload report file
6. System → Storage: Save report
7. Storage → System: File stored confirmation
8. System → AI Engine: Process report image
9. AI Engine → System: Extracted text
10. System → AI Engine: Interpret medical terms
11. AI Engine → System: Layman explanation
12. System → Patient: Display interpreted results
13. System → Database: Store analysis
```

---

### SSD-3: Doctor Appointment Booking

```
Actor: Patient
System: Tabeeb Platform

1. Patient → System: Login credentials
2. System → Patient: Authentication success
3. Patient → System: Search for doctors
4. System → Database: Query available doctors
5. Database → System: Doctor list
6. System → Patient: Display doctors
7. Patient → System: Select doctor and time slot
8. System → Database: Check availability
9. Database → System: Slot available
10. System → Payment Gateway: Initiate payment
11. Patient → Payment Gateway: Payment details
12. Payment Gateway → System: Payment success
13. System → Database: Create appointment
14. System → Patient: Booking confirmation
15. System → Doctor: Appointment notification
```

---

### SSD-4: Doctor Consultation Session

```
Actor: Doctor
System: Tabeeb Platform

1. Doctor → System: Login credentials
2. System → Doctor: Authentication success
3. Doctor → System: View appointments
4. System → Database: Fetch appointments
5. Database → System: Appointment list
6. System → Doctor: Display appointments
7. Doctor → System: Start consultation
8. System → Patient: Call notification
9. Patient → System: Accept call
10. System: Establish video/voice connection
11. Doctor → System: Request patient history
12. System → Database: Fetch patient records
13. Database → System: Patient history
14. System → Doctor: Display medical history
15. Doctor → System: Write prescription
16. System → Database: Save prescription
17. System → Patient: Prescription notification
18. Doctor → System: End consultation
19. System → Database: Log consultation
20. System → Patient: Request feedback
```

---

### SSD-5: Patient Feedback Submission

```
Actor: Patient
System: Tabeeb Platform

1. Patient → System: Login credentials
2. System → Patient: Authentication success
3. System → Patient: Feedback prompt (post-consultation)
4. Patient → System: Select rating (1-5 stars)
5. Patient → System: Enter feedback comments
6. Patient → System: Choose anonymous/public option
7. Patient → System: Submit feedback
8. System → Database: Store feedback
9. System → AI Engine: Analyze sentiment
10. AI Engine → System: Sentiment score
11. System → Database: Update doctor performance
12. System → Patient: Feedback submitted confirmation
13. System: Check for negative patterns
14. System → Admin: Alert if flagged
```

---

### SSD-6: Admin Doctor Verification

```
Actor: Admin
System: Tabeeb Platform

1. Admin → System: Login credentials
2. System → Admin: Authentication success
3. Admin → System: View candidates
4. System → Database: Fetch pending applications
5. Database → System: Candidate list
6. System → Admin: Display candidates
7. Admin → System: Select candidate
8. System → Database: Fetch candidate details
9. Database → System: Credentials and documents
10. System → Admin: Display full application
11. Admin → System: Review credentials
12. Admin → System: Approve/Reject decision
13. System → Database: Update candidate status
14. System → Doctor: Approval/Rejection notification
15. System → Database: Log admin activity
```

---

### SSD-7: Admin Performance Monitoring

```
Actor: Admin
System: Tabeeb Platform

1. Admin → System: Login credentials
2. System → Admin: Authentication success
3. Admin → System: View feedback analysis
4. System → Database: Fetch feedback data
5. Database → System: Feedback records
6. System → AI Engine: Generate analytics
7. AI Engine → System: Performance metrics
8. System → Admin: Display top-ranked doctors
9. System → Admin: Display flagged comments
10. Admin → System: Select flagged doctor
11. System → Database: Fetch doctor details
12. Database → System: Complete feedback history
13. System → Admin: Display detailed analysis
14. Admin → System: Suspend doctor decision
15. System → Database: Update doctor status
16. System → Doctor: Suspension notification
17. System → Database: Log admin action
```

---

### SSD-8: Voice-Assisted Login

```
Actor: Patient
System: Tabeeb Platform

1. Patient → System: Activate voice login
2. System → Patient: Voice prompt
3. Patient → System: Speak credentials (voice)
4. System → Speech-to-Text Engine: Convert audio
5. Speech-to-Text → System: Text credentials
6. System → Database: Verify credentials
7. Database → System: Authentication result
8. System → Patient: Login success (audio)
9. System → Text-to-Speech: Generate response
10. Text-to-Speech → System: Audio output
11. System → Patient: Play confirmation audio
```

---

### SSD-9: Healthcare Facility Locator

```
Actor: Patient
System: Tabeeb Platform

1. Patient → System: Login credentials
2. System → Patient: Authentication success
3. Patient → System: Request nearby facilities
4. System → Patient: Request location permission
5. Patient → System: Grant location access
6. System → GPS Service: Get coordinates
7. GPS Service → System: Current location
8. System → Maps API: Query nearby hospitals/pharmacies
9. Maps API → System: Facility list with distances
10. System → Patient: Display facilities on map
11. Patient → System: Select facility
12. System → Maps API: Get directions
13. Maps API → System: Route information
14. System → Patient: Display navigation
```

---

### SSD-10: Admin Transaction Log Review

```
Actor: Admin
System: Tabeeb Platform

1. Admin → System: Login credentials
2. System → Admin: Authentication success
3. Admin → System: Access transaction log
4. System → Database: Fetch payment records
5. Database → System: Transaction data
6. System → Admin: Display transaction log
7. Admin → System: Filter by date/doctor/patient
8. System → Database: Query filtered data
9. Database → System: Filtered transactions
10. System → Admin: Display results
11. Admin → System: Export report
12. System: Generate report file
13. System → Admin: Download report
14. System → Database: Log admin activity
```

---

### SSD-11: Doctor Prescription Management

```
Actor: Doctor
System: Tabeeb Platform

1. Doctor → System: Login credentials
2. System → Doctor: Authentication success
3. Doctor → System: View patient during consultation
4. System → Database: Fetch patient details
5. Database → System: Patient information
6. System → Doctor: Display patient data
7. Doctor → System: Write prescription details
8. Doctor → System: Add medications and dosage
9. Doctor → System: Set reminders
10. System → Database: Save prescription
11. System → Patient: Prescription notification
12. System → Calendar Service: Schedule reminders
13. Calendar Service → Patient: Medication reminders
14. System → Database: Log prescription activity
```

---

### SSD-12: Medical Dictionary Search

```
Actor: Patient/Doctor
System: Tabeeb Platform

1. User → System: Login credentials
2. System → User: Authentication success
3. User → System: Access medical dictionary
4. System → Database: Fetch dictionary interface
5. User → System: Enter search term
6. System → Database: Query medical terms
7. Database → System: Matching terms
8. System → User: Display search results
9. User → System: Select term
10. System → Database: Fetch detailed definition
11. Database → System: Term details with examples
12. System → User: Display full information
13. System: Offer related terms
14. System → Database: Log search activity
```

---

## Technology Stack

### Frontend
- React 18.3.1
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Router DOM
- Recharts (data visualization)
- Lucide React (icons)

### Backend (Lovable Cloud)
- Supabase (Database, Authentication, Storage)
- PostgreSQL
- Edge Functions (Serverless)

### AI/ML Services
- Lovable AI Gateway
- Google Gemini 2.5 (Medical consultation, Report analysis)
- Sentiment Analysis Engine

### APIs & Services
- Google Maps API (Location services)
- Speech-to-Text / Text-to-Speech APIs
- Payment Gateway Integration
- GPS Services

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Git

### Steps

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd doc-patient-panel

# Install frontend dependencies
npm install

# Install backend dependencies
cd src/backend
npm install
cd ../..

# Start development server
npm run dev
```

### Environment Variables

#### Frontend Environment Variables
Create a `.env` file in the root directory with the following:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_key
```

#### Backend Environment Variables
Create a `.env` file in `src/backend/` directory with the following:
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

#### Environment Setup Guide
For detailed setup instructions, see [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md).

---

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   └── ui/             # Reusable UI components (shadcn)
├── pages/              # Route pages
│   ├── Dashboard.tsx
│   ├── ChatScreen.tsx
│   ├── Doctors.tsx
│   ├── Patients.tsx
│   ├── FeedbackAnalysis.tsx
│   ├── Candidates.tsx
│   ├── TransactionLog.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

---

## Security Considerations

### Authentication
- Role-based access control (Admin, Doctor, Patient)
- Secure token-based authentication
- User roles stored in separate database table

### Data Protection
- Encrypted patient medical records
- HIPAA-compliant data handling
- Secure file storage for medical reports

### API Security
- Rate limiting on AI endpoints
- Input validation and sanitization
- CORS configuration

---

## Deployment

### Deploy to Lovable
Simply click the **Publish** button in the Lovable editor.

### Custom Domain
Navigate to: Project > Settings > Domains to connect your custom domain.

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## Support & Documentation

- **Lovable Documentation:** [https://docs.lovable.dev/](https://docs.lovable.dev/)
- **Project Issues:** Use the GitHub Issues tab
- **Community:** Join the Lovable Discord community

---

## License

[Specify your license here]

---

## Acknowledgments

- Built with [Lovable](https://lovable.dev)
- Powered by Supabase and Google Gemini AI
- UI components from shadcn/ui

---

**Project URL:** https://lovable.dev/projects/fe2c7172-0a2d-4289-a0cd-be6d946d46bf