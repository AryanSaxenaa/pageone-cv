import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';
import { Plus, Trash2, MinusCircle } from 'lucide-react';
import { Resume } from '../../types/resume';

const ExperienceForm: React.FC = () => {
  const { register, control, formState: { errors } } = useFormContext<Resume>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
        <button
          type="button"
          onClick={() => append({ 
            company: '', 
            location: '', 
            position: '', 
            startDate: '', 
            endDate: '', 
            descriptions: [''] 
          })}
          className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Experience
        </button>
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="bg-gray-50 p-4 rounded-md mb-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">Experience #{index + 1}</h3>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                {...register(`experience.${index}.company`, { required: 'Company is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {errors.experience?.[index]?.company && (
                <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.company?.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                {...register(`experience.${index}.location`)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Position
              </label>
              <input
                type="text"
                {...register(`experience.${index}.position`, { required: 'Position is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
              {errors.experience?.[index]?.position && (
                <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.position?.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="text"
                  placeholder="Jan 2020"
                  {...register(`experience.${index}.startDate`, { required: 'Start date is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
                {errors.experience?.[index]?.startDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.startDate?.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  type="text"
                  placeholder="Present"
                  {...register(`experience.${index}.endDate`, { required: 'End date is required' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
                {errors.experience?.[index]?.endDate && (
                  <p className="text-red-500 text-xs mt-1">{errors.experience[index]?.endDate?.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Descriptions
              </label>
              <button
                type="button"
                onClick={() => {
                  const descriptions = [...field.descriptions];
                  descriptions.push('');
                  const newExperiences = [...fields];
                  newExperiences[index] = { ...newExperiences[index], descriptions };
                }}
                className="inline-flex items-center px-2 py-1 text-xs border border-transparent rounded-md shadow-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Description
              </button>
            </div>

            {field.descriptions.map((desc, descIndex) => (
              <div key={descIndex} className="flex items-start mb-2">
                <input
                  type="text"
                  {...register(`experience.${index}.descriptions.${descIndex}`, { 
                    required: 'Description is required' 
                  })}
                  placeholder="Developed a web application using React..."
                  className="flex-grow mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
                
                {field.descriptions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const newDescriptions = [...field.descriptions];
                      newDescriptions.splice(descIndex, 1);
                      const newExperiences = [...fields];
                      newExperiences[index] = { ...newExperiences[index], descriptions: newDescriptions };
                    }}
                    className="ml-2 mt-2"
                  >
                    <MinusCircle className="h-5 w-5 text-red-500 hover:text-red-700" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExperienceForm;