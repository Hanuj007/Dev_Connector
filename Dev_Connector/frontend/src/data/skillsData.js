// Comprehensive Predefined Technical Skills Database
// Structured for quick suggestion, search filtering, and future database expansion

export const POPULAR_SKILLS = [
  'Java',
  'Python',
  'C++',
  'JavaScript',
  'React',
  'Node.js',
  'MongoDB',
  'SQL',
  'HTML',
  'CSS',
  'Git',
  'Docker'
];

export const ALL_SKILLS = [
  // Programming Languages
  'C',
  'C++',
  'C#',
  'Dart',
  'Go',
  'Java',
  'JavaScript',
  'Kotlin',
  'PHP',
  'Python',
  'R',
  'Ruby',
  'Rust',
  'Scala',
  'Swift',
  'TypeScript',

  // Frontend & UI
  'Angular',
  'Bootstrap',
  'CSS',
  'HTML',
  'Next.js',
  'Nuxt.js',
  'React',
  'Redux',
  'Sass',
  'Svelte',
  'TailwindCSS',
  'Vue.js',
  'Webpack',
  'Vite',

  // Backend & Frameworks
  'ASP.NET',
  '.NET',
  'Django',
  'Express',
  'FastAPI',
  'Flask',
  'GraphQL',
  'Laravel',
  'NestJS',
  'Node.js',
  'REST API',
  'Ruby on Rails',
  'Spring Boot',

  // Databases & ORMs
  'Cassandra',
  'DynamoDB',
  'Firebase',
  'Firestore',
  'MongoDB',
  'Mongoose',
  'MySQL',
  'NoSQL',
  'PostgreSQL',
  'Prisma',
  'Redis',
  'SQLite',
  'SQL',

  // DevOps, Cloud & Tools
  'AWS',
  'Azure',
  'CI/CD',
  'Docker',
  'GCP',
  'Git',
  'GitHub',
  'GitHub Actions',
  'Kubernetes',
  'Linux',
  'NGINX',
  'Terraform',

  // Mobile
  'Android',
  'Flutter',
  'iOS',
  'React Native',

  // AI, Data Science & Machine Learning
  'Deep Learning',
  'Machine Learning',
  'NLP',
  'NumPy',
  'OpenCV',
  'Pandas',
  'PyTorch',
  'Scikit-learn',
  'TensorFlow'
];

/**
 * Filter skills based on user search query and current selection.
 * @param {string} query Search input text
 * @param {string[]} selectedSkills Currently selected skills
 * @returns {string[]} Filtered skills suggestions
 */
export function searchSkills(query = '', selectedSkills = []) {
  const selectedLower = new Set(selectedSkills.map((s) => s.toLowerCase()));
  const q = query.trim().toLowerCase();

  // If search query is empty, return remaining popular skills
  if (!q) {
    return POPULAR_SKILLS.filter((s) => !selectedLower.has(s.toLowerCase()));
  }

  // Filter skills matching query, excluding already selected ones
  const prefixMatches = [];
  const substringMatches = [];

  for (const skill of ALL_SKILLS) {
    const skillLower = skill.toLowerCase();
    if (selectedLower.has(skillLower)) continue;

    if (skillLower.startsWith(q)) {
      prefixMatches.push(skill);
    } else if (skillLower.includes(q)) {
      substringMatches.push(skill);
    }
  }

  return [...prefixMatches, ...substringMatches];
}
