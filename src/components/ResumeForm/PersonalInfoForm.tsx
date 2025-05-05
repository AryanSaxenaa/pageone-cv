import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Resume } from '../../types/resume';

const PersonalInfoForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<Resume>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('personalInfo.fullName', { required: 'Full name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          {errors.personalInfo?.fullName && (
            <p className="text-red-500 text-xs mt-1">{errors.personalInfo.fullName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('personalInfo.email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          {errors.personalInfo?.email && (
            <p className="text-red-500 text-xs mt-1">{errors.personalInfo.email.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            {...register('personalInfo.phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9-+()]{10,15}$/,
                message: 'Invalid phone number'
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          {errors.personalInfo?.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.personalInfo.phone.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
            LinkedIn URL
          </label>
          <input
            type="text"
            id="linkedin"
            placeholder="linkedin.com/in/username"
            {...register('personalInfo.linkedin')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
        
        <div>
          <label htmlFor="github" className="block text-sm font-medium text-gray-700">
            GitHub URL
          </label>
          <input
            type="text"
            id="github"
            placeholder="github.com/username"
            {...register('personalInfo.github')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;