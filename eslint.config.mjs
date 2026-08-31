import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  {
    ignores: [
      '.next/**',
      '.open-next/**',
      '.sqlite/**',
      '.wrangler/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'scripts/**',
      'drizzle/**'
    ]
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;
