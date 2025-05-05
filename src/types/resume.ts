export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin?: string;
  github?: string;
}

export interface Education {
  institution: string;
  location: string;
  degree: string;
  major: string;
  startDate: string;
  endDate: string;
}

export interface Experience {
  company: string;
  location: string;
  position: string;
  startDate: string;
  endDate: string;
  descriptions: string[];
}

export interface Project {
  name: string;
  technologies: string;
  date: string;
  descriptions: string[];
}

export interface Skills {
  languages: string;
  frameworks: string;
  tools: string;
  libraries: string;
}

export interface Resume {
  _id?: string;
  user?: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
  createdAt?: string;
  updatedAt?: string;
}