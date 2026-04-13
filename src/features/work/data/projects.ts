import type { Project } from './types';

export const projects: Project[] = [
  {
    id: 'helios',
    name: 'Helios',
    description:
      'A type-safe SQL query builder for TypeScript. Construct complex queries with full type inference — no strings, no surprises. Zero runtime dependencies, used by 200+ developers.',
    githubUrl: 'https://github.com/nikhilmehra/helios',
    screenshotAlt: 'Helios query builder code example',
    technologies: ['TypeScript', 'Node.js', 'SQL'],
  },
  {
    id: 'vantage',
    name: 'Vantage',
    description:
      'A React component library for building live data dashboards. Connects to WebSocket streams and handles reconnection, state buffering, and time-series rendering automatically.',
    githubUrl: 'https://github.com/nikhilmehra/vantage',
    screenshotAlt: 'Vantage dashboard preview',
    technologies: ['React', 'TypeScript', 'WebSocket', 'D3.js'],
  },
  {
    id: 'fieldnotes',
    name: 'Fieldnotes',
    description:
      'A local-first markdown note-taking app with optional CRDT-based sync. Everything lives on your device; sync is conflict-free and requires no server.',
    githubUrl: 'https://github.com/nikhilmehra/fieldnotes',
    screenshotAlt: 'Fieldnotes app screenshot',
    technologies: ['TypeScript', 'SQLite', 'CRDTs', 'Electron'],
  },
];
