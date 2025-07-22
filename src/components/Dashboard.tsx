import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, FilePenLine, FileOutput, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Resume as ResumeType } from '../types/resume';
import jsPDF from 'jspdf';

interface DashboardResume {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  personalInfo: {
    fullName: string;
    email: string;
  };
}

const Dashboard: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const [resumes, setResumes] = useState<DashboardResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get('/api/resumes');
        setResumes(response.data);
      } catch (error) {
        toast.error('Failed to fetch resumes');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchResumes();
    }
  }, [isAuthenticated]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        console.log('Starting delete operation for resume ID:', id);
        
        // Use default axios headers (already set by AuthContext)
        const response = await axios.delete(`/api/resumes/single?id=${id}`);
        
        console.log('Delete response:', response.data);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } catch (error: any) {
        console.error('Delete error:', error);
        
        // More detailed error reporting
        if (error.response) {
          console.error('Response status:', error.response.status);
          console.error('Response data:', error.response.data);
          console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
          toast.error(`Failed to delete resume: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error('Request error:', error.request);
          toast.error('Failed to delete resume: Network error');
        } else {
          console.error('Error message:', error.message);
          toast.error(`Failed to delete resume: ${error.message}`);
        }
      }
    }
  };

  const handleExportPDF = async (id: string) => {
    try {
      console.log('Starting PDF export for resume ID:', id);
      
      // Get the resume data
      const response = await axios.get(`/api/resumes/single?id=${id}`);
      console.log('Resume data received:', response.data);
      
      const resume: ResumeType = response.data;
      
      // Validate resume data
      if (!resume || !resume.personalInfo) {
        throw new Error('Invalid resume data received');
      }
      
      // Create PDF with Jake's exact template formatting
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up fonts and styling to exactly match Jake's template
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const lineHeight = 5.5; // Closer to Times New Roman spacing
      let yPosition = margin;
      
      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize: number = 12, fontStyle: string = 'normal', x: number = margin) => {
        pdf.setFontSize(fontSize);
        pdf.setFont('times', fontStyle); // Use Times font to match template
        pdf.setTextColor(0, 0, 0);
        
        const textWidth = pageWidth - (margin * 2);
        const splitText = pdf.splitTextToSize(text, textWidth);
        
        // Check if we need a new page
        if (yPosition + (splitText.length * lineHeight) > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(splitText, x, yPosition);
        yPosition += splitText.length * lineHeight;
      };
      
      // Helper function to add centered text
      const addCenteredText = (text: string, fontSize: number = 12, fontStyle: string = 'normal') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('times', fontStyle);
        pdf.setTextColor(0, 0, 0);
        
        const textWidth = pdf.getTextWidth(text);
        const x = (pageWidth - textWidth) / 2;
        
        // Check if we need a new page
        if (yPosition + lineHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(text, x, yPosition);
        yPosition += lineHeight;
      };
      
      // Helper function to add two-column text (left and right aligned)
      const addTwoColumnText = (leftText: string, rightText: string, leftFontSize: number = 12, rightFontSize: number = 12, leftStyle: string = 'normal', rightStyle: string = 'normal') => {
        pdf.setFontSize(leftFontSize);
        pdf.setFont('times', leftStyle);
        pdf.text(leftText, margin, yPosition);
        
        pdf.setFontSize(rightFontSize);
        pdf.setFont('times', rightStyle);
        const rightTextWidth = pdf.getTextWidth(rightText);
        pdf.text(rightText, pageWidth - margin - rightTextWidth, yPosition);
        
        yPosition += lineHeight;
      };
      
      // Helper function to add section header with underline
      const addSectionHeader = (title: string) => {
        yPosition += 3; // Space before section
        pdf.setFontSize(14);
        pdf.setFont('times', 'bold');
        pdf.text(title.toUpperCase(), margin, yPosition);
        yPosition += 2;
        
        // Add underline
        pdf.setDrawColor(128, 128, 128);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 4;
      };
      
      // Header section - exactly like Jake's template
      // Large centered name
      addCenteredText(resume.personalInfo?.fullName || 'Your Name', 20, 'bold');
      yPosition += 2;
      
      // Contact information centered on one line with separators
      const contactParts = [];
      if (resume.personalInfo?.phone) contactParts.push(resume.personalInfo.phone);
      if (resume.personalInfo?.email) contactParts.push(resume.personalInfo.email);
      if (resume.personalInfo?.linkedin) contactParts.push(resume.personalInfo.linkedin);
      if (resume.personalInfo?.github) contactParts.push(resume.personalInfo.github);
      
      if (contactParts.length > 0) {
        addCenteredText(contactParts.join(' | '), 12, 'normal');
      }
      
      // Education section
      if (resume.education && resume.education.length > 0) {
        addSectionHeader('Education');
        
        resume.education.forEach(edu => {
          // Institution and location on first line
          const institution = edu.institution || 'University Name';
          const location = edu.location || 'Location';
          addTwoColumnText(institution, location, 12, 12, 'bold', 'normal');
          
          // Degree and dates on second line
          const degreeInfo = `${edu.degree}${edu.major ? `, ${edu.major}` : ''}`;
          const dateRange = `${edu.startDate} -- ${edu.endDate}`;
          addTwoColumnText(degreeInfo, dateRange, 12, 12, 'italic', 'italic');
          
          yPosition += 2; // Space between education entries
        });
      }
      
      // Experience section
      if (resume.experience && resume.experience.length > 0) {
        addSectionHeader('Experience');
        
        resume.experience.forEach(exp => {
          // Position and dates on first line
          const position = exp.position || 'Position';
          const dateRange = `${exp.startDate} -- ${exp.endDate}`;
          addTwoColumnText(position, dateRange, 12, 12, 'bold', 'normal');
          
          // Company and location on second line
          const companyLocation = `${exp.company}${exp.location ? `, ${exp.location}` : ''}`;
          addText(companyLocation, 12, 'italic');
          
          // Bullet points for descriptions
          if (exp.descriptions && exp.descriptions.length > 0) {
            exp.descriptions.forEach(desc => {
              if (desc.trim()) {
                // Add bullet point
                pdf.setFont('times', 'normal');
                pdf.setFontSize(12);
                
                const bulletX = margin + 10;
                const textWidth = pageWidth - bulletX - margin;
                const bulletText = `• ${desc}`;
                const splitText = pdf.splitTextToSize(bulletText, textWidth);
                
                if (yPosition + (splitText.length * lineHeight) > pageHeight - margin) {
                  pdf.addPage();
                  yPosition = margin;
                }
                
                pdf.text(splitText, bulletX, yPosition);
                yPosition += splitText.length * lineHeight;
              }
            });
          }
          yPosition += 3; // Space between experiences
        });
      }
      
      // Projects section
      if (resume.projects && resume.projects.length > 0) {
        addSectionHeader('Projects');
        
        resume.projects.forEach(project => {
          // Project name | technologies and date on first line
          const projectTitle = `${project.name || 'Project Name'} | ${project.technologies || 'Technologies Used'}`;
          const projectDate = project.date || 'Date';
          addTwoColumnText(projectTitle, projectDate, 12, 12, 'bold', 'normal');
          
          // Bullet points for descriptions
          if (project.descriptions && project.descriptions.length > 0) {
            project.descriptions.forEach(desc => {
              if (desc.trim()) {
                // Add bullet point
                pdf.setFont('times', 'normal');
                pdf.setFontSize(12);
                
                const bulletX = margin + 10;
                const textWidth = pageWidth - bulletX - margin;
                const bulletText = `• ${desc}`;
                const splitText = pdf.splitTextToSize(bulletText, textWidth);
                
                if (yPosition + (splitText.length * lineHeight) > pageHeight - margin) {
                  pdf.addPage();
                  yPosition = margin;
                }
                
                pdf.text(splitText, bulletX, yPosition);
                yPosition += splitText.length * lineHeight;
              }
            });
          }
          yPosition += 2; // Space between projects
        });
      }
      
      // Technical Skills section
      if (resume.skills) {
        addSectionHeader('Technical Skills');
        
        pdf.setFontSize(12);
        
        if (resume.skills.languages) {
          pdf.setFont('times', 'bold');
          const langLabel = 'Languages:';
          const langLabelWidth = pdf.getTextWidth(langLabel);
          pdf.text(langLabel, margin, yPosition);
          
          pdf.setFont('times', 'normal');
          pdf.text(resume.skills.languages, margin + langLabelWidth + 2, yPosition);
          yPosition += lineHeight;
        }
        
        if (resume.skills.frameworks) {
          pdf.setFont('times', 'bold');
          const fwLabel = 'Frameworks:';
          const fwLabelWidth = pdf.getTextWidth(fwLabel);
          pdf.text(fwLabel, margin, yPosition);
          
          pdf.setFont('times', 'normal');
          pdf.text(resume.skills.frameworks, margin + fwLabelWidth + 2, yPosition);
          yPosition += lineHeight;
        }
        
        if (resume.skills.tools) {
          pdf.setFont('times', 'bold');
          const toolLabel = 'Developer Tools:';
          const toolLabelWidth = pdf.getTextWidth(toolLabel);
          pdf.text(toolLabel, margin, yPosition);
          
          pdf.setFont('times', 'normal');
          pdf.text(resume.skills.tools, margin + toolLabelWidth + 2, yPosition);
          yPosition += lineHeight;
        }
        
        if (resume.skills.libraries) {
          pdf.setFont('times', 'bold');
          const libLabel = 'Libraries:';
          const libLabelWidth = pdf.getTextWidth(libLabel);
          pdf.text(libLabel, margin, yPosition);
          
          pdf.setFont('times', 'normal');
          pdf.text(resume.skills.libraries, margin + libLabelWidth + 2, yPosition);
          yPosition += lineHeight;
        }
      }
      
      // Download the PDF
      pdf.save(`${resume.personalInfo?.fullName || 'resume'}-resume.pdf`);
      
      toast.success('Resume exported successfully');
    } catch (error: any) {
      console.error('Export error:', error);
      
      // More detailed error reporting
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Full error response:', JSON.stringify(error.response.data, null, 2));
        toast.error(`Failed to export resume: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        console.error('Request error:', error.request);
        toast.error('Failed to export resume: Network error');
      } else {
        console.error('Error message:', error.message);
        toast.error(`Failed to export resume: ${error.message}`);
      }
    }
  };

  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
        <Link
          to="/resume/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Resume
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : resumes.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes found</h3>
          <p className="text-gray-500 mb-6">You haven't created any resumes yet. Create your first resume to get started.</p>
          <Link
            to="/resume/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {resumes.map((resume) => (
              <li key={resume._id}>
                <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-medium text-gray-900">
                      {resume.personalInfo.fullName || 'Unnamed Resume'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleExportPDF(resume._id)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      title="Export PDF"
                    >
                      <FileOutput className="h-5 w-5 text-gray-500" />
                    </button>
                    <Link
                      to={`/resume/edit/${resume._id}`}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      title="Edit"
                    >
                      <FilePenLine className="h-5 w-5 text-gray-500" />
                    </Link>
                    <button
                      onClick={() => handleDelete(resume._id)}
                      className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      title="Delete"
                    >
                      <Trash2 className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;