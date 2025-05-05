import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Resume } from '../../types/resume';

const SkillsForm: React.FC = () => {
  const { register, formState: { errors } } = useFormContext<Resume>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Technical Skills</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="languages" className="block text-sm font-medium text-gray-700">
            Programming Languages
          </label>
          <input
            type="text"
            id="languages"
            placeholder="Java, Python, C/C++, JavaScript"
            {...register('skills.languages', { required: 'At least one language is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          {errors.skills?.languages && (
            <p className="text-red-500 text-xs mt-1">{errors.skills.languages.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">Separate multiple languages with commas</p>
        </div>
        
        <div>
          <label htmlFor="frameworks" className="block text-sm font-medium text-gray-700">
            Frameworks
          </label>
          <input
            type="text"
            id="frameworks"
            placeholder="React, Node.js, Flask, Express"
            {...register('skills.frameworks')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple frameworks with commas</p>
        </div>
        
        <div>
          <label htmlFor="tools" className="block text-sm font-medium text-gray-700">
            Developer Tools
          </label>
          <input
            type="text"
            id="tools"
            placeholder="Git, Docker, AWS, VS Code"
            {...register('skills.tools')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tools with commas</p>
        </div>
        
        <div>
          <label htmlFor="libraries" className="block text-sm font-medium text-gray-700">
            Libraries
          </label>
          <input
            type="text"
            id="libraries"
            placeholder="pandas, NumPy, Matplotlib"
            {...register('skills.libraries')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple libraries with commas</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;