# 🐾 PetCare - Smart Pet Health & Adoption System

A modern web application that connects loving families with pets in need of homes, and helps pet owners find the best care for their furry friends. Built with vanilla JavaScript, HTML5, and CSS3, featuring a responsive design and intuitive user interface.

## ✨ Features

### 🔐 User Authentication
- **User Registration & Login** - Secure account creation and authentication
- **Profile Management** - Personal user profiles with customizable settings
- **Session Management** - Remember me functionality and secure logout
- **Password Recovery** - Forgot password functionality

### 🐕 Pet Adoption
- **Browse Available Pets** - View pets available for adoption with detailed profiles
- **Advanced Filtering** - Filter pets by type (Dogs, Cats, Birds) and other criteria
- **Detailed Pet Profiles** - Comprehensive pet information including:
  - Basic details (name, breed, age, gender, color, weight)
  - Health records and vaccination status
  - Temperament and behavior notes
  - Diet preferences and special care instructions
  - Owner contact information
- **Adoption Request System** - Comprehensive adoption application form with:
  - Personal information collection
  - Household and environment assessment
  - Experience and lifestyle evaluation
  - Pet-specific questions
  - Commitment and agreement verification

### 📝 Pet Posting
- **List Pets for Adoption** - Easy-to-use form for pet owners to list their pets
- **Comprehensive Pet Information** - Detailed forms including:
  - Pet photos and basic information
  - Health records and vaccination certificates
  - Location and owner contact details
  - Special notes and care instructions
- **Category Selection** - Support for Dogs, Cats, and Birds
- **Health Documentation** - Upload vaccination certificates and health records

### 👤 User Management
- **User Profiles** - Personal dashboard with account information
- **Adoption Requests Tracking** - View and manage adoption requests
- **Pet Management** - Manage posted pets and adoption requests

### 🎨 User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Theme** - Toggle between light and dark modes
- **Interactive UI** - Smooth animations and intuitive navigation
- **Material Design Icons** - Modern iconography throughout the interface
- **Paw Print Background** - Animated background elements for visual appeal

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [MySQL](https://dev.mysql.com/downloads/) (version 8.0 or higher)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AsherWood39/DBMS_Project--PetCare.git
   cd DBMS_Project--PetCare
   ```

2. **Set Up Database**
   ```bash
   # Navigate to database directory
   cd database
   
   # Connect to MySQL and run schema
   mysql -u root -p
   source petcare_schema.sql;
   
   # Load sample data (optional)
   source sample_data.sql;
   
   # Create application user
   CREATE USER 'petcare_user'@'localhost' IDENTIFIED BY 'your_secure_password';
   GRANT ALL PRIVILEGES ON petcare_db.* TO 'petcare_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```
   This will install all required dependencies including:
   - Vite for development and building
   - Other project dependencies

4. **Configure Database Connection**
   ```javascript
   // Update client/utils/database.js with your database credentials
   const DB_CONFIG = {
       host: 'localhost',
       port: 3306,
       database: 'petcare_db',
       user: 'petcare_user',
       password: 'your_secure_password', // Update this
       charset: 'utf8mb4'
   };
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```
   This command:
   - Starts the Vite development server
   - Enables hot module replacement (HMR)
   - Opens the project in your default browser
   - Makes it available at `http://localhost:5173`

## 📁 Project Structure

```
DBMS_Project--PetCare/
├── client/                  # Frontend application
│   ├── pages/              # Page components
│   │   ├── home.html       # Home dashboard
│   │   ├── login.html      # User login page
│   │   ├── signup.html     # User registration page
│   │   ├── profile.html    # User profile management
│   │   ├── adopt_pet.html  # Pet adoption form
│   │   ├── post_pet.html   # Pet posting form
│   │   ├── details.html    # Pet details view
│   │   └── adoption_requests.html # Adoption requests management
│   ├── src/                # JavaScript modules
│   │   ├── main.js         # Main entry point
│   │   ├── theme.js        # Theme management
│   │   ├── auth.js         # Authentication utilities
│   │   ├── home.js         # Home page functionality
│   │   ├── login.js        # Login functionality
│   │   ├── signup.js       # Registration functionality
│   │   ├── profile.js      # Profile management
│   │   ├── adopt_pet.js    # Pet adoption logic
│   │   ├── post_pet.js     # Pet posting logic
│   │   ├── details.js      # Pet details functionality
│   │   └── adoption_request.js # Adoption request management
│   ├── style/              # CSS stylesheets
│   │   ├── global.css      # Global styles
│   │   ├── home_style.css  # Home page styles
│   │   ├── login-signup_style.css # Auth page styles
│   │   ├── profile.css     # Profile page styles
│   │   ├── adopt_pet.css   # Adoption page styles
│   │   ├── post_pet.css    # Pet posting styles
│   │   ├── details.css     # Pet details styles
│   │   └── adoption_request.css # Adoption request styles
│   ├── public/             # Static assets
│   │   ├── pet1.jpg - pet10.jpg # Pet images
│   │   ├── cat_seller.png  # Category icons
│   │   ├── dog_seller.png
│   │   ├── parrot_seller.png
│   │   └── paws.png        # UI elements
│   ├── utils/              # Utility functions
│   │   ├── auth.js         # Authentication utilities
│   │   └── database.js     # Database connection utilities
│   ├── index.html          # Main entry point
│   ├── package.json        # Project dependencies
│   ├── vite.config.mjs     # Vite configuration
│   └── README.md           # Project documentation
├── database/               # Database files
│   ├── petcare_schema.sql  # Complete database schema
│   ├── sample_data.sql     # Sample data for testing
│   └── README.md           # Database documentation
├── DATABASE_SETUP.md       # Database setup guide
└── README.md               # Main project documentation
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run serve` - Serve the built project on port 3000
- `npm run clean` - Clean dist and node_modules/.vite directories
- `npm run reinstall` - Clean and reinstall all dependencies

## 🎯 Usage

### For Pet Adopters
1. **Sign Up/Login** - Create an account or log in to existing account
2. **Browse Pets** - View available pets on the home page with filtering options
3. **View Details** - Click on any pet to see detailed information
4. **Submit Adoption Request** - Fill out the comprehensive adoption form
5. **Track Requests** - Monitor your adoption requests in your profile

### For Pet Owners
1. **Sign Up/Login** - Create an account or log in to existing account
2. **Post a Pet** - Use the "Post Pet" feature to list your pet for adoption
3. **Fill Pet Details** - Provide comprehensive information about your pet
4. **Upload Documents** - Add photos and health certificates
5. **Manage Requests** - Review and respond to adoption requests

## 🎨 Design Features

- **Modern UI/UX** - Clean, intuitive interface with Material Design principles
- **Responsive Layout** - Optimized for all screen sizes
- **Theme Support** - Dark and light mode toggle
- **Interactive Elements** - Smooth animations and hover effects
- **Accessibility** - Semantic HTML and keyboard navigation support

## 🔧 Technical Details

### Frontend
- **Framework** - Vanilla JavaScript with ES6+ modules
- **Build Tool** - Vite for fast development and optimized builds
- **Styling** - Pure CSS3 with custom properties and modern layout techniques
- **Icons** - Google Material Icons
- **Browser Support** - Modern browsers with ES6+ support

### Backend & Database
- **Database** - MySQL 8.0+ with comprehensive schema
- **Tables** - 10 tables covering users, pets, adoptions, health records
- **Features** - Stored procedures, triggers, views, and audit logging
- **API** - RESTful API endpoints for all operations
- **Security** - Prepared statements, input validation, and role-based access

## 🚀 Deployment

### Frontend Deployment

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

3. **Deploy Frontend**
   - Upload the `dist` folder contents to your web server
   - Configure your server to serve the `index.html` file
   - Ensure all static assets are properly served

### Backend & Database Deployment

1. **Set Up Production Database**
   ```sql
   -- Create production database
   CREATE DATABASE petcare_prod;
   USE petcare_prod;
   source petcare_schema.sql;
   ```

2. **Configure Environment Variables**
   ```env
   DB_HOST=your_production_host
   DB_PORT=3306
   DB_NAME=petcare_prod
   DB_USER=petcare_user
   DB_PASSWORD=your_secure_production_password
   ```

3. **Deploy Backend API**
   - Set up your backend server (Node.js, PHP, Python, etc.)
   - Configure database connection
   - Deploy API endpoints
   - Set up SSL certificates for HTTPS

4. **Update Frontend Configuration**
   ```javascript
   // Update API endpoints in client/utils/database.js
   const API_ENDPOINTS = {
       base: 'https://your-api-domain.com/api',
       // ... rest of endpoints
   };
   ```

## 🗄️ Database Features

### Core Tables
- **`users`** - User accounts with role-based access (Admin, Owner, Adopter)
- **`pets`** - Pet listings with comprehensive information
- **`adoption_requests`** - Detailed adoption applications
- **`adoptions`** - Completed adoption records
- **`pet_health_records`** - Medical history and health status
- **`vaccinations`** - Vaccination records with certificate storage

### Advanced Features
- **Stored Procedures** - `ApproveAdoptionRequest()`, `RejectAdoptionRequest()`
- **Views** - `available_pets_view`, `adoption_requests_view`
- **Triggers** - Automatic pet status updates, audit logging
- **Indexes** - Optimized for performance and search queries
- **Audit Logging** - Track all important actions and changes

### Sample Data
The database includes comprehensive sample data:
- 6 sample users (1 admin, 2 owners, 3 adopters)
- 8 sample pets with complete health records
- Sample adoption requests and messages
- System configuration settings

## 🔧 Backend Integration

### API Endpoints
The project includes a complete API specification in `client/utils/database.js`:

```javascript
// Example API usage
const dbAPI = new DatabaseAPI();

// Get available pets
const pets = await dbAPI.getPets({ category: 'Dog', available: true });

// Create adoption request
const request = await dbAPI.createAdoptionRequest({
    pet_id: 1,
    full_name: 'John Doe',
    // ... other fields
});

// User authentication
const user = await dbAPI.login('user@example.com', 'password');
```

### Backend Examples
The project includes examples for:
- **Node.js with Express** - Complete REST API setup
- **PHP Backend** - Simple API endpoints
- **Database Connection** - MySQL connection utilities

## 🚨 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MySQL service
   sudo systemctl status mysql
   
   # Test connection
   mysql -u petcare_user -p petcare_db
   ```

2. **Frontend Not Loading Data**
   - Check browser console for API errors
   - Verify database connection in `client/utils/database.js`
   - Ensure backend API is running

3. **Build Errors**
   ```bash
   # Clean and reinstall
   npm run clean
   npm run reinstall
   ```

4. **Database Schema Issues**
   ```sql
   -- Check table structure
   DESCRIBE pets;
   SHOW CREATE TABLE pets;
   
   -- Verify data
   SELECT COUNT(*) FROM users;
   SELECT COUNT(*) FROM pets;
   ```

### Debug Commands

```bash
# Check MySQL status
mysql -u root -p -e "SHOW PROCESSLIST;"

# Test API endpoints
curl http://localhost:3000/api/pets

# Check frontend build
npm run build && npm run preview
```

## 📚 Additional Resources

- **Database Documentation** - See `database/README.md` for detailed schema info
- **Database Setup Guide** - See `DATABASE_SETUP.md` for complete setup instructions
- **API Documentation** - Check `client/utils/database.js` for all available methods
- **Sample Queries** - See `database/sample_data.sql` for example queries

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help

- **General Issues** - Create an issue in the repository
- **Database Problems** - Check the troubleshooting section above
- **Setup Questions** - Refer to `DATABASE_SETUP.md` for detailed instructions
- **API Integration** - See `client/utils/database.js` for examples

### Common Solutions

1. **Database Connection Issues**
   - Verify MySQL is running
   - Check credentials in `client/utils/database.js`
   - Ensure database exists and has proper permissions

2. **Frontend Build Issues**
   - Run `npm run clean && npm run reinstall`
   - Check Node.js version (requires 14+)
   - Verify all dependencies are installed

3. **API Integration Issues**
   - Ensure backend server is running
   - Check API endpoint URLs
   - Verify CORS settings

### Documentation

- **Main README** - This file
- **Database Setup** - `DATABASE_SETUP.md`
- **Database Schema** - `database/README.md`
- **API Reference** - `client/utils/database.js`

## 🙏 Acknowledgments

- Material Design Icons for the beautiful iconography
- Vite team for the excellent build tool
- All contributors who help make this project better

---

**Made with ❤️ for pets and their families**