# PetCare Project

A web application for managing pet care services with user authentication using Firebase.

## Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A code editor (VS Code recommended)

## Project Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AsherWood39/DBMS_Project--PetCare.git
   cd DBMS_Project--PetCare
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```
   This will install all required dependencies including:
   - Firebase SDK for authentication
   - Vite for development and building
   - Other project dependencies

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:
     ```env
     VITE_FIREBASE_API_KEY=your_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

## Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```
   This command:
   - Starts the Vite development server
   - Enables hot module replacement (HMR)
   - Opens the project in your default browser
   - Default address: http://localhost:5173

2. **Project Structure**
   ```
   DBMS_Project--PetCare/
   ├── pages/             # Page components
   │   ├── login.html     # Login page
   │   ├── login.js      # Login logic
   │   ├── signup.html   # Signup page
   │   └── signup.js     # Signup logic
   ├── utils/
   │   └── firebase.js   # Firebase configuration and utilities
   ├── public/           # Static assets
   ├── index.html        # Main entry point
   └── package.json      # Project dependencies and scripts
   ```

3. **Firebase Authentication**
   - User signup with email/password
   - User login with email/password
   - Password reset functionality
   - Email verification
   - Remember me functionality
   - Error handling for various auth scenarios

4. **Available Scripts**
   ```bash
   npm run dev      # Start development server
   npm run build    # Build for production
   npm run preview  # Preview production build locally
   ```

## Deployment

1. **Build the Project**
   ```bash
   npm run build
   ```
   This creates a `dist` directory with optimized files for production.

2. **Preview the Build (Optional)**
   ```bash
   npm run preview
   ```
   Test the production build locally before deploying.

3. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```
   Deploys the project to Firebase Hosting.

## Features
- User Authentication (Signup/Login)
- Email Verification
- Password Reset
- Remember Me Functionality
- Form Validation
- Error Handling
- Responsive Design

## Troubleshooting

1. **Environment Variables**
   - Ensure `.env` file exists and contains all required Firebase configuration
   - Check that all variables start with `VITE_`

2. **Common Issues**
   - If modules are not found, run `npm install`
   - For Firebase errors, check console for specific error messages
   - For CORS issues, ensure you're running through `npm run dev`

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.
