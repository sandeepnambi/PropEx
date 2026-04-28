# PropEx
PropEx is a full-stack real estate platform with JWT authentication, Cloudinary uploads, and real-time updates for buyers and agents.

## Features

- 🏠 **Property Listings**: Search, filter and view detailed property information
- 🔐 **JWT Authentication**: Secure user authentication with strict password validation
- 🇮🇳 **INR Localization**: Fully standardized for the Indian market with Rupee symbols (₹) and Indian formatting
- ☁️ **Cloudinary Integration**: Cloud storage for property images
- 💬 **Real-time Updates**: Instant notifications for property inquiries
- 📱 **Responsive Design**: Mobile-first approach using Vanilla CSS
- 🎯 **Role-Based Access**: Specialized dashboards for Buyers, Tenants, Managers, Owners, and Admins
- 📖 **Comprehensive Docs**: Detailed role overviews and operational workflows in `/docs`

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- React Router for navigation
- Axios for API requests

### Backend
- Node.js with Express
- TypeScript for type safety
- MongoDB with Mongoose
- JWT for authentication
- SendGrid for email notifications
- Cloudinary for image hosting

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Cloudinary account
- SendGrid account

### Environment Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/propex.git
cd propex
```

2.Install dependencies
```bash
npm run install:all
```

3.Configure environment variables:
Create .env file in backend directory:

```bash
PORT=PORT_Num
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=Time_Duration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
FRONTEND_URL=http://localhost:Port_number
```

Create ```bash .env.local``` file in frontend directory:
```bash 
VITE_API_BASE_URL=http://localhost:Port_Num/api
```

Running the Application
1.Start the backend server:
```bash
cd backend
npm run dev
```

2.Start the frontend development server:
```bash
cd frontend
npm run dev
```

### Project Structure:

```bash
propex-workspace/
├── docs/                      # Comprehensive Role & Workflow Documentation
├── PropEx/
│   ├── backend/               # Node.js Express API server
│   │   ├── src/
│   │   │   ├── controllers/   # Request handlers
│   │   │   ├── models/        # Database models
│   │   │   ├── routes/        # API routes
│   │   │   └── services/      # Business logic (Payments, Auth, etc.)
│   └── frontend/              # React TypeScript application
│       ├── src/
│       │   ├── components/    # UI Components (Admin, Agent, Tenant, etc.)
│       │   ├── pages/         # Page components
│       │   └── context/       # State management (Auth, etc.)
```

### License:
This README provides a comprehensive overview of the PropEx project, including setup instructions, project structure, and role-based workflows. You can customize it further based on your specific needs and additional features.
