import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Resume } from '../../types/resume';
import './ResumePreview.css';

const ResumePreview: React.FC = () => {
  const { watch } = useFormContext<Resume>();
  const formData = watch();

  return (
    <div className="resume-preview bg-white shadow-md p-6 rounded-lg overflow-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Preview</h2>
      
      <div className="preview-container border p-8 max-w-[850px] mx-auto bg-white text-black">
        {/* Header / Personal Info */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">{formData.personalInfo.fullName || 'Your Name'}</h1>
          <div className="flex flex-wrap justify-center text-sm gap-x-2">
            {formData.personalInfo.phone && (
              <span>{formData.personalInfo.phone}</span>
            )}
            {formData.personalInfo.email && (
              <>
                {formData.personalInfo.phone && <span>|</span>}
                <span>{formData.personalInfo.email}</span>
              </>
            )}
            {formData.personalInfo.linkedin && (
              <>
                {(formData.personalInfo.phone || formData.personalInfo.email) && <span>|</span>}
                <span>{formData.personalInfo.linkedin}</span>
              </>
            )}
            {formData.personalInfo.github && (
              <>
                {(formData.personalInfo.phone || formData.personalInfo.email || formData.personalInfo.linkedin) && <span>|</span>}
                <span>{formData.personalInfo.github}</span>
              </>
            )}
          </div>
        </div>

        {/* Education Section */}
        {formData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Education</h2>
            {formData.education.map((edu, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div className="font-bold">{edu.institution || 'University Name'}</div>
                  <div>{edu.location || 'Location'}</div>
                </div>
                <div className="flex justify-between items-start text-sm italic">
                  <div>{edu.degree}{edu.major ? `, ${edu.major}` : ''}</div>
                  <div>{edu.startDate} -- {edu.endDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Experience Section */}
        {formData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Experience</h2>
            {formData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between items-start">
                  <div className="font-bold">{exp.position || 'Position'}</div>
                  <div>{exp.startDate} -- {exp.endDate}</div>
                </div>
                <div className="italic text-sm mb-1">{exp.company}{exp.location ? `, ${exp.location}` : ''}</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {exp.descriptions.map((desc, descIndex) => (
                    <li key={descIndex}>{desc || 'Description of your responsibilities and achievements'}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Projects Section */}
        {formData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Projects</h2>
            {formData.projects.map((project, index) => (
              <div key={index} className="mb-3">
                <div className="flex justify-between items-start">
                  <div className="font-bold">{project.name || 'Project Name'} | <span className="font-normal">{project.technologies || 'Technologies Used'}</span></div>
                  <div>{project.date || 'Date'}</div>
                </div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {project.descriptions.map((desc, descIndex) => (
                    <li key={descIndex}>{desc || 'Description of your project and its impact'}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Skills Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-2">Technical Skills</h2>
          <div className="text-sm">
            {formData.skills.languages && (
              <div className="mb-1">
                <span className="font-bold">Languages:</span> {formData.skills.languages}
              </div>
            )}
            {formData.skills.frameworks && (
              <div className="mb-1">
                <span className="font-bold">Frameworks:</span> {formData.skills.frameworks}
              </div>
            )}
            {formData.skills.tools && (
              <div className="mb-1">
                <span className="font-bold">Developer Tools:</span> {formData.skills.tools}
              </div>
            )}
            {formData.skills.libraries && (
              <div className="mb-1">
                <span className="font-bold">Libraries:</span> {formData.skills.libraries}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;