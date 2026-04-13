import type { Experience } from './types';

export const experiences: Experience[] = [
  {
    id: 'acme-labs',
    company: 'Acme Labs',
    title: 'Senior Software Engineer',
    startDate: 'Jan 2022',
    endDate: null,
    isCurrent: true,
    description:
      'Leading development of the customer data platform — a distributed system processing 50M+ events per day. Redesigned the ingestion pipeline to reduce end-to-end latency by 40% and enable real-time analytics.',
    skills: ['TypeScript', 'React', 'Node.js', 'AWS', 'PostgreSQL', 'Kafka'],
  },
  {
    id: 'mosaic-systems',
    company: 'Mosaic Systems',
    title: 'Software Engineer',
    startDate: 'Jun 2020',
    endDate: 'Dec 2021',
    isCurrent: false,
    description:
      'Built and shipped the core analytics dashboard used by 500+ enterprise customers. Owned the React component library and GraphQL API layer end-to-end.',
    skills: ['React', 'Python', 'GraphQL', 'Docker'],
  },
  {
    id: 'meridian-tech',
    company: 'Meridian Technologies',
    title: 'Software Engineering Intern',
    startDate: 'Jun 2019',
    endDate: 'Aug 2019',
    isCurrent: false,
    description:
      'Implemented automated testing infrastructure that cut CI build times by 25% and caught three production regressions before release.',
    skills: ['JavaScript', 'Jest', 'GitHub Actions'],
  },
];
