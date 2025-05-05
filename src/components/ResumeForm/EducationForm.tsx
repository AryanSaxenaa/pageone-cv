import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Resume } from '../../types/resume';

const EducationForm: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<Resume>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Education</h2>
        <button
          type="button"
          onClick={() => append({ 
            institution: '', 
            location: '', 
            degree: '', 
            major: '', 
            startDate: '', 
            endDate: '' 
          })}
          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Education
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Education #{index + 1}</h3>
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="inline-flex items-center p-1 border border-transparent rounded-md text-red-500 hover:bg-red-50"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <input
                type="text"
                {...register(`education.${index}.institution`, { required: 'Institution is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {errors.education?.[index]?.institution && (
                <p className="text-red-500 text-xs mt-1">{errors.education[index]?.institution?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                {...register(`education.${index}.location`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Degree
              </label>
              <input
                type="text"
                {...register(`education.${index}.degree`, { required: 'Degree is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {errors.education?.[index]?.degree && (
                <p className="text-red-500 text-xs mt-1">{errors.education[index]?.degree?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Major
              </label>
              <input
                type="text"
                {...register(`education.${index}.major`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                type="text"
                placeholder="Aug. 2018"
                {...register(`education.${index}.startDate`, { required: 'Start date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {errors.education?.[index]?.startDate && (
                <p className="text-red-500 text-xs mt-1">{errors.education[index]?.startDate?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                type="text"
                placeholder="May 2022 (or Present)"
                {...register(`education.${index}.endDate`, { required: 'End date is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {errors.education?.[index]?.endDate && (
                <p className="text-red-500 text-xs mt-1">{errors.education[index]?.endDate?.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationForm;