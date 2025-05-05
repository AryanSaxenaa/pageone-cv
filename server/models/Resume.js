import mongoose from 'mongoose';

// Schema for personal information
const personalInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  linkedin: { type: String },
  github: { type: String }
});

// Schema for education entries
const educationSchema = new mongoose.Schema({
  institution: { type: String, required: true },
  location: { type: String },
  degree: { type: String, required: true },
  major: { type: String },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true }
});

// Schema for experience entries
const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  location: { type: String },
  position: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  descriptions: [{ type: String }]
});

// Schema for project entries
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  technologies: { type: String, required: true },
  date: { type: String },
  descriptions: [{ type: String }]
});

// Schema for skills
const skillsSchema = new mongoose.Schema({
  languages: { type: String, required: true },
  frameworks: { type: String },
  tools: { type: String },
  libraries: { type: String }
});

// Main resume schema
const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true // Index for fast user lookup
  },
  name: {
    type: String,
    default: function() {
      return this.personalInfo?.fullName 
        ? `${this.personalInfo.fullName}'s Resume` 
        : 'Untitled Resume';
    }
  },
  personalInfo: personalInfoSchema,
  education: [educationSchema],
  experience: [experienceSchema],
  projects: [projectSchema],
  skills: skillsSchema
}, {
  timestamps: true
});

// Compound index for efficient querying
resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;