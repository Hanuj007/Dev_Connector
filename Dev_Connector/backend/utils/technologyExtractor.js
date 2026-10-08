// Technology Extractor & Normalizer
// Normalizes technology names and extracts recognized technologies from freeform text

// Canonical dictionary mapping lowercase aliases to standardized technology display names
const TECH_DICTIONARY = {
  // Frontend
  'react': 'React',
  'react.js': 'React',
  'reactjs': 'React',
  'vue': 'Vue.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'angular': 'Angular',
  'angularjs': 'Angular',
  'svelte': 'Svelte',
  'next': 'Next.js',
  'next.js': 'Next.js',
  'nextjs': 'Next.js',
  'nuxt': 'Nuxt.js',
  'nuxt.js': 'Nuxt.js',
  'nuxtjs': 'Nuxt.js',
  'html': 'HTML',
  'html5': 'HTML',
  'css': 'CSS',
  'css3': 'CSS',
  'tailwind': 'TailwindCSS',
  'tailwindcss': 'TailwindCSS',
  'bootstrap': 'Bootstrap',
  'sass': 'Sass',
  'redux': 'Redux',

  // Backend & Runtimes
  'node': 'Node.js',
  'node.js': 'Node.js',
  'nodejs': 'Node.js',
  'express': 'Express',
  'express.js': 'Express',
  'expressjs': 'Express',
  'nest': 'NestJS',
  'nestjs': 'NestJS',
  'django': 'Django',
  'flask': 'Flask',
  'fastapi': 'FastAPI',
  'spring': 'Spring Boot',
  'springboot': 'Spring Boot',
  'spring-boot': 'Spring Boot',
  'dotnet': '.NET',
  '.net': '.NET',
  'aspnet': 'ASP.NET',
  'laravel': 'Laravel',
  'rails': 'Ruby on Rails',
  'ruby on rails': 'Ruby on Rails',

  // Programming Languages
  'javascript': 'JavaScript',
  'js': 'JavaScript',
  'typescript': 'TypeScript',
  'ts': 'TypeScript',
  'python': 'Python',
  'py': 'Python',
  'java': 'Java',
  'c++': 'C++',
  'cpp': 'C++',
  'c#': 'C#',
  'csharp': 'C#',
  'c': 'C',
  'go': 'Go',
  'golang': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'php': 'PHP',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'dart': 'Dart',
  'scala': 'Scala',
  'r': 'R',

  // Databases & ORMs
  'mongodb': 'MongoDB',
  'mongo': 'MongoDB',
  'mongoose': 'Mongoose',
  'postgresql': 'PostgreSQL',
  'postgres': 'PostgreSQL',
  'mysql': 'MySQL',
  'sqlite': 'SQLite',
  'redis': 'Redis',
  'cassandra': 'Cassandra',
  'firebase': 'Firebase',
  'firestore': 'Firestore',
  'dynamodb': 'DynamoDB',
  'prisma': 'Prisma',
  'sql': 'SQL',
  'nosql': 'NoSQL',

  // Cloud, DevOps & Tools
  'docker': 'Docker',
  'kubernetes': 'Kubernetes',
  'k8s': 'Kubernetes',
  'aws': 'AWS',
  'azure': 'Azure',
  'gcp': 'GCP',
  'git': 'Git',
  'github': 'GitHub',
  'graphql': 'GraphQL',
  'rest': 'REST API',
  'restful': 'REST API',
  'linux': 'Linux',
  'nginx': 'NGINX',

  // Mobile
  'flutter': 'Flutter',
  'react native': 'React Native',
  'react-native': 'React Native',
  'reactnative': 'React Native',
  'android': 'Android',
  'ios': 'iOS',

  // AI / ML / Data Science
  'machine learning': 'Machine Learning',
  'ml': 'Machine Learning',
  'deep learning': 'Deep Learning',
  'pytorch': 'PyTorch',
  'tensorflow': 'TensorFlow',
  'pandas': 'Pandas',
  'numpy': 'NumPy',
  'scikit-learn': 'Scikit-learn',
  'scikitlearn': 'Scikit-learn',
  'opencv': 'OpenCV'
};

/**
 * Normalize an individual skill or technology string to standard display casing.
 * If recognized in the dictionary, returns standard form.
 * If not recognized, returns title-cased cleaned version to prevent losing custom user skills.
 */
function normalizeTechnology(rawTech) {
  if (!rawTech || typeof rawTech !== 'string') return '';
  const cleaned = rawTech.trim();
  if (!cleaned) return '';

  const lower = cleaned.toLowerCase();
  if (TECH_DICTIONARY[lower]) {
    return TECH_DICTIONARY[lower];
  }

  // Preserve custom technologies with neat capitalization
  return cleaned
    .split(/[\s_-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extract technology names found in a block of freeform text (e.g. post text, repo description, repo name).
 * Uses case-insensitive word-boundary matching against recognized dictionary terms.
 */
function extractTechnologiesFromText(text) {
  if (!text || typeof text !== 'string') return [];
  const found = new Set();
  const lowerText = text.toLowerCase();

  for (const [alias, standardName] of Object.entries(TECH_DICTIONARY)) {
    // Escape special characters for regex (e.g. c++, .net, c#)
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');

    if (regex.test(lowerText)) {
      found.add(standardName);
    }
  }

  return Array.from(found);
}

module.exports = {
  TECH_DICTIONARY,
  normalizeTechnology,
  extractTechnologiesFromText
};
