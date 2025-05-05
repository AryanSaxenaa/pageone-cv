import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Plus, FilePenLine, FileOutput, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface Resume {
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
  const [resumes, setResumes] = useState<Resume[]>([]);
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
        await axios.delete(`/api/resumes/${id}`);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted successfully');
      } catch (error) {
        toast.error('Failed to delete resume');
      }
    }
  };

  const handleExportPDF = async (id: string) => {
    try {
      const response = await axios.get(`/api/resumes/${id}/export`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'resume.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Resume exported successfully');
    } catch (error) {
      toast.error('Failed to export resume');
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