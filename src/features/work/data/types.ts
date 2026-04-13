export interface Experience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string | null;
  description: string;
  skills: string[];
  isCurrent: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  screenshotAlt: string;
  technologies: string[];
}
