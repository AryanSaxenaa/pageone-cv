# PageOneCV - Resume Management Platform

A modern, full-stack web application that allows users to create, manage, and export professional resumes with ease. Built with React and TypeScript on the frontend, powered by serverless functions and MongoDB on the backend.

## Features

- **User Authentication**: Secure registration and login system with password hashing
- **Resume Builder**: Intuitive multi-step form for creating comprehensive resumes
- **Resume Management**: View, edit, and delete existing resumes from a centralized dashboard
- **PDF Export**: Generate professional PDFs with clean formatting and selectable text
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Real-time Validation**: Form validation with helpful error messages

## Live Demo

Visit the live application: [PageOneCV](https://pageonecv.vercel.app/)

## Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing
- **React Hook Form** - Efficient form handling and validation
- **Axios** - HTTP client for API requests
- **jsPDF** - Client-side PDF generation

### Backend
- **Node.js** - JavaScript runtime
- **Vercel Serverless Functions** - Scalable API endpoints
- **MongoDB** - Document-based database
- **Mongoose** - MongoDB object modeling
- **bcryptjs** - Password hashing and security
- **JSON Web Tokens** - Secure authentication

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB database (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/AryanSaxenaa/pageone-cv.git
cd pageone-cv
```

2. Install dependencies
```bash
npm install
```

3. Create environment variables
Create a `.env` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
├── api/                    # Serverless API functions
│   ├── auth/              # Authentication endpoints
│   ├── resumes/           # Resume CRUD operations
│   ├── models/            # Database schemas
│   ├── middleware/        # Authentication middleware
│   └── db/               # Database connection
├── src/                   # Frontend source code
│   ├── components/        # React components
│   ├── context/          # React context providers
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── dist/                # Production build files
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `GET /api/resumes/single?id={id}` - Get specific resume
- `PUT /api/resumes/single?id={id}` - Update resume
- `DELETE /api/resumes/single?id={id}` - Delete resume

## Deployment

This application is designed for deployment on Vercel with CLI deployment for optimal performance.

### Deploy to Vercel

1. Install Vercel CLI
```bash
npm install -g vercel
```

2. Deploy the application
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard or via CLI:
```bash
vercel env add MONGODB_URI
vercel env add JWT_SECRET
```

### Important Notes
- Use CLI deployment rather than GitHub integration to avoid serverless function limits
- Ensure MongoDB connection string is properly configured for production
- Environment variables must be set in Vercel dashboard

## Usage

1. **Register**: Create a new account with your email and password
2. **Login**: Access your dashboard with existing credentials
3. **Create Resume**: Use the step-by-step form to build your resume
   - Personal Information
   - Education Details
   - Work Experience
   - Projects
   - Skills
4. **Manage Resumes**: View all your resumes from the dashboard
5. **Export PDF**: Generate and download professional PDF versions
6. **Edit/Delete**: Update existing resumes or remove unwanted ones

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## Database Schema

### User Model
```javascript
{
  email: String (required, unique),
  password: String (hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Resume Model
```javascript
{
  user: ObjectId (ref: User),
  name: String,
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String
  },
  education: Array,
  experience: Array,
  projects: Array,
  skills: Array,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Known Issues

- PDF generation may take a moment for resumes with extensive content
- Mobile PDF preview has limited functionality compared to desktop

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Aryan Saxena**
- GitHub: [@AryanSaxenaa](https://github.com/AryanSaxenaa)
- Project Link: [https://github.com/AryanSaxenaa/pageone-cv](https://github.com/AryanSaxenaa/pageone-cv)

## Acknowledgments

- Thanks to the open-source community for the amazing tools and libraries
- Inspired by modern resume building platforms
- Built as a learning project for full-stack development
