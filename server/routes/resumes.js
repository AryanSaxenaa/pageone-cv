import express from 'express';
import puppeteer from 'puppeteer';
import Resume from '../models/Resume.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all resumes for current user
router.get('/', auth, async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.json(resumes);
  } catch (err) {
    console.error('Get resumes error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific resume
router.get('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    console.error('Get resume error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new resume
router.post('/', auth, async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      user: req.user.id
    };
    
    const resume = new Resume(resumeData);
    await resume.save();
    
    res.status(201).json(resume);
  } catch (err) {
    console.error('Create resume error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update a resume
router.put('/:id', auth, async (req, res) => {
  try {
    let resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Update fields
    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(resume);
  } catch (err) {
    console.error('Update resume error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a resume
router.delete('/:id', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    await Resume.findByIdAndDelete(req.params.id);
    res.json({ message: 'Resume deleted' });
  } catch (err) {
    console.error('Delete resume error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export resume to PDF
router.get('/:id/export', auth, async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id });
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    // Generate HTML for the resume
    const html = generateResumeHTML(resume);
    
    // Launch headless browser
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(html);
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    
    await browser.close();
    
    // Send PDF
    res.contentType('application/pdf');
    res.send(pdf);
  } catch (err) {
    console.error('Export resume error:', err);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// Aggregate resumes by skill (for analytics)
router.get('/analytics/skills', auth, async (req, res) => {
  try {
    const skillCounts = await Resume.aggregate([
      { $match: { user: req.user.id } },
      { $project: { 
        languageArray: { $split: ["$skills.languages", ", "] }
      }},
      { $unwind: "$languageArray" },
      { $group: {
        _id: "$languageArray",
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json(skillCounts);
  } catch (err) {
    console.error('Skills analytics error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to generate resume HTML
function generateResumeHTML(resume) {
  const {
    personalInfo,
    education,
    experience,
    projects,
    skills
  } = resume;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${personalInfo.fullName}'s Resume</title>
      <style>
        body {
          font-family: "Times New Roman", Times, serif;
          font-size: 12px;
          line-height: 1.5;
          color: #000;
          margin: 0;
          padding: 0 30px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 20px;
          margin-bottom: 5px;
        }
        .contact-info {
          font-size: 11px;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 8px;
        }
        .section-title {
          font-size: 14px;
          text-transform: uppercase;
          font-weight: bold;
          border-bottom: 1px solid #000;
          margin-bottom: 8px;
        }
        .section {
          margin-bottom: 15px;
        }
        .item {
          margin-bottom: 8px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
        }
        .item-subheader {
          display: flex;
          justify-content: space-between;
          font-style: italic;
          font-size: 11px;
        }
        .item-title {
          font-weight: bold;
        }
        ul {
          margin-top: 3px;
          margin-bottom: 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 3px;
        }
        .skills-item {
          margin-bottom: 4px;
        }
        .skills-item span {
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${personalInfo.fullName}</h1>
        <div class="contact-info">
          ${personalInfo.phone ? `<span>${personalInfo.phone}</span>` : ''}
          ${personalInfo.email ? `<span>| ${personalInfo.email}</span>` : ''}
          ${personalInfo.linkedin ? `<span>| ${personalInfo.linkedin}</span>` : ''}
          ${personalInfo.github ? `<span>| ${personalInfo.github}</span>` : ''}
        </div>
      </div>
      
      ${education.length > 0 ? `
        <div class="section">
          <div class="section-title">Education</div>
          ${education.map(edu => `
            <div class="item">
              <div class="item-header">
                <div class="item-title">${edu.institution}</div>
                <div>${edu.location}</div>
              </div>
              <div class="item-subheader">
                <div>${edu.degree}${edu.major ? `, ${edu.major}` : ''}</div>
                <div>${edu.startDate} -- ${edu.endDate}</div>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${experience.length > 0 ? `
        <div class="section">
          <div class="section-title">Experience</div>
          ${experience.map(exp => `
            <div class="item">
              <div class="item-header">
                <div class="item-title">${exp.position}</div>
                <div>${exp.startDate} -- ${exp.endDate}</div>
              </div>
              <div class="item-subheader">
                <div>${exp.company}${exp.location ? `, ${exp.location}` : ''}</div>
              </div>
              <ul>
                ${exp.descriptions.map(desc => `
                  <li>${desc}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${projects.length > 0 ? `
        <div class="section">
          <div class="section-title">Projects</div>
          ${projects.map(project => `
            <div class="item">
              <div class="item-header">
                <div class="item-title">${project.name} | <span style="font-weight: normal;">${project.technologies}</span></div>
                <div>${project.date}</div>
              </div>
              <ul>
                ${project.descriptions.map(desc => `
                  <li>${desc}</li>
                `).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <div class="section">
        <div class="section-title">Technical Skills</div>
        ${skills.languages ? `<div class="skills-item"><span>Languages:</span> ${skills.languages}</div>` : ''}
        ${skills.frameworks ? `<div class="skills-item"><span>Frameworks:</span> ${skills.frameworks}</div>` : ''}
        ${skills.tools ? `<div class="skills-item"><span>Developer Tools:</span> ${skills.tools}</div>` : ''}
        ${skills.libraries ? `<div class="skills-item"><span>Libraries:</span> ${skills.libraries}</div>` : ''}
      </div>
    </body>
    </html>
  `;
}

export default router;