import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

import PersonalInfoForm from './PersonalInfoForm';
import EducationForm from './EducationForm';
import ExperienceForm from './ExperienceForm';
import ProjectsForm from './ProjectsForm';
import SkillsForm from './SkillsForm';
import ResumePreview from '../ResumePreview';
import { Resume } from '../../types/resume';
import { useAuth } from '../../context/AuthContext';

const ResumeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [activeSection, setActiveSection] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  
  const methods = useForm<Resume>({
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        linkedin: '',
        github: '',
      },
      education: [{ 
        institution: '', 
        location: '', 
        degree: '', 
        major: '', 
        startDate: '', 
        endDate: '' 
      }],
      experience: [{ 
        company: '', 
        location: '', 
        position: '', 
        startDate: '', 
        endDate: '', 
        descriptions: [''] 
      }],
      projects: [{ 
        name: '', 
        technologies: '', 
        date: '', 
        descriptions: [''] 
      }],
      skills: {
        languages: '',
        frameworks: '',
        tools: '',
        libraries: ''
      }
    }
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    const fetchResume = async () => {
      if (id) {
        try {
          const response = await axios.get(`/api/resumes/single?id=${id}`);
          methods.reset(response.data);
        } catch (error) {
          toast.error('Failed to load resume');
          navigate('/');
        }
      }
    };

    if (isAuthenticated && id) {
      fetchResume();
    }
  }, [id, methods, isAuthenticated, navigate]);

  const togglePreview = () => {
    setIsPreviewVisible(!isPreviewVisible);
  };

  const onSubmit = async (data: Resume) => {
    setIsSubmitting(true);
    try {
      if (id) {
        await axios.put(`/api/resumes/single?id=${id}`, data);
        toast.success('Resume updated successfully');
      } else {
        await axios.post('/api/resumes', data);
        toast.success('Resume created successfully');
      }
      navigate('/');
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormSection = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoForm />;
      case 'education':
        return <EducationForm />;
      case 'experience':
        return <ExperienceForm />;
      case 'projects':
        return <ProjectsForm />;
      case 'skills':
        return <SkillsForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <FormProvider {...methods}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">
          {id ? 'Edit Resume' : 'Create New Resume'}
        </h1>
        
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left panel - Form sections and navigation */}
          <div className="lg:col-span-1 bg-white shadow rounded-lg overflow-hidden">
            <nav className="border-b border-gray-200">
              <ul className="flex flex-col">
                {['personal', 'education', 'experience', 'projects', 'skills'].map((section) => (
                  <li key={section}>
                    <button
                      type="button"
                      onClick={() => setActiveSection(section)}
                      className={`w-full text-left py-3 px-4 ${
                        activeSection === section
                          ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {section.charAt(0).toUpperCase() + section.slice(1)} Information
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
            
            <div className="p-4 border-t border-gray-200">
              <button
                type="button"
                onClick={togglePreview}
                className="w-full mb-3 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
              >
                {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
              </button>
              
              <button
                type="button"
                onClick={methods.handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Resume'}
              </button>
            </div>
          </div>
          
          {/* Middle panel - Form fields */}
          <div className={`lg:col-span-${isPreviewVisible ? '1' : '2'} bg-white shadow rounded-lg p-6 mt-6 lg:mt-0`}>
            <form>
              {renderFormSection()}
            </form>
          </div>
          
          {/* Right panel - Preview */}
          {isPreviewVisible && (
            <div className="lg:col-span-1 mt-6 lg:mt-0">
              <ResumePreview />
            </div>
          )}
        </div>
      </div>
    </FormProvider>
  );
};

export default ResumeForm;