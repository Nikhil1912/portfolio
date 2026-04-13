import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceCard } from './ExperienceCard';
import type { Experience } from '../data/types';

const currentRole: Experience = {
  id: 'current',
  company: 'Acme Labs',
  title: 'Senior Software Engineer',
  startDate: 'Jan 2022',
  endDate: null,
  isCurrent: true,
  description: 'Building things at scale.',
  skills: ['TypeScript', 'React'],
};

const pastRole: Experience = {
  id: 'past',
  company: 'Mosaic Systems',
  title: 'Software Engineer',
  startDate: 'Jun 2020',
  endDate: 'Dec 2021',
  isCurrent: false,
  description: 'Shipped dashboards for enterprise customers.',
  skills: ['Python', 'Docker'],
};

describe('ExperienceCard — current role', () => {
  it('renders the company name', () => {
    render(<ExperienceCard experience={currentRole} />);
    expect(screen.getByRole('heading', { name: 'Acme Labs', level: 3 })).toBeInTheDocument();
  });

  it('renders the job title', () => {
    render(<ExperienceCard experience={currentRole} />);
    expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
  });

  it('shows "Present" when endDate is null', () => {
    render(<ExperienceCard experience={currentRole} />);
    expect(screen.getByText(/Jan 2022 – Present/)).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<ExperienceCard experience={currentRole} />);
    expect(screen.getByText('Building things at scale.')).toBeInTheDocument();
  });

  it('renders all skill tags', () => {
    render(<ExperienceCard experience={currentRole} />);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});

describe('ExperienceCard — past role', () => {
  it('renders the company name', () => {
    render(<ExperienceCard experience={pastRole} />);
    expect(screen.getByText('Mosaic Systems')).toBeInTheDocument();
  });

  it('renders the job title', () => {
    render(<ExperienceCard experience={pastRole} />);
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
  });

  it('shows the date range with end date', () => {
    render(<ExperienceCard experience={pastRole} />);
    expect(screen.getByText(/Jun 2020 – Dec 2021/)).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<ExperienceCard experience={pastRole} />);
    expect(screen.getByText('Shipped dashboards for enterprise customers.')).toBeInTheDocument();
  });

  it('renders all skill tags', () => {
    render(<ExperienceCard experience={pastRole} />);
    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
  });
});
