# PropEx
PropEx is a full-stack real estate platform with JWT authentication, Cloudinary uploads, and real-time updates for buyers and agents.

## Features

- 🏠 **Property Listings**: Search, filter and view detailed property information
- 🔐 **JWT Authentication**: Secure user authentication and role-based access
- ☁️ **Cloudinary Integration**: Cloud storage for property images
- 💬 **Real-time Updates**: Instant notifications for property inquiries
- 📱 **Responsive Design**: Mobile-first approach using Tailwind CSS
- 🎯 **Role-Based Access**: Different interfaces for buyers, agents and admins

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
```bash VITE_API_BASE_URL=http://localhost:Port_Num/api```

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
propex/
├── backend/                 # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Custom middleware
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   └── tests/             # Backend tests
└── frontend/              # Frontend React application
    ├── src/
    │   ├── components/    # Reusable components
    │   ├── context/       # React context
    │   ├── pages/        # Page components
    │   ├── types/        # TypeScript types
    │   └── utils/        # Utility functions
    └── public/           # Static assets
```

### License:
This README provides a comprehensive overview of your PropEx project, including setup instructions, project structure, and contribution guidelines. You can customize it further based on your specific needs and additional features.This README provides a comprehensive overview of your PropEx project, including setup instructions, project structure, and contribution guidelines. You can customize it further based on your specific needs and additional features.

