
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting portfolio customization...');

// Update package.json with professional metadata
const packageJsonPath = path.join(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.name = 'dave-ops-portfolio';
packageJson.description = 'Professional DevOps portfolio showcasing cloud infrastructure, automation, and best practices';
packageJson.version = '1.0.0';
packageJson.author = 'Dave - DevOps Engineer';
packageJson.homepage = 'https://dmaru09sub.github.io/dave-ops-portfolio';
packageJson.repository = {
  type: 'git',
  url: 'https://github.com/dmaru09sub/dave-ops-portfolio.git'
};
packageJson.keywords = ['devops', 'portfolio', 'cloud', 'automation', 'infrastructure'];

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✓ Updated package.json with professional metadata');

// Update index.html with professional meta tags and remove Lovable references
const indexHtmlPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// Update title
indexHtml = indexHtml.replace(/<title>.*<\/title>/, '<title>Dave\'s DevOps Portfolio | Cloud Infrastructure & Automation</title>');

// Update meta description
indexHtml = indexHtml.replace(
  /<meta name="description" content=".*">/,
  '<meta name="description" content="Professional DevOps portfolio showcasing cloud infrastructure projects, automation solutions, and best practices in modern software deployment.">'
);

// Add professional meta tags
const professionalMetaTags = `
  <meta name="author" content="Dave - DevOps Engineer">
  <meta name="keywords" content="DevOps, Cloud Infrastructure, Automation, AWS, Docker, Kubernetes, CI/CD, Portfolio">
  <meta property="og:title" content="Dave's DevOps Portfolio">
  <meta property="og:description" content="Professional DevOps portfolio showcasing cloud infrastructure projects and automation solutions">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://dmaru09sub.github.io/dave-ops-portfolio">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Dave's DevOps Portfolio">
  <meta name="twitter:description" content="Professional DevOps portfolio showcasing cloud infrastructure projects and automation solutions">`;

// Remove Lovable meta tags and GPT Engineer script
indexHtml = indexHtml.replace(/<meta name="description" content="Vite \+ React">/, '');
indexHtml = indexHtml.replace(/<script src="https:\/\/cdn\.gpteng\.co\/gptengineer\.js" type="module"><\/script>/, '');

// Add professional meta tags before closing head tag
indexHtml = indexHtml.replace('</head>', `${professionalMetaTags}\n  </head>`);

fs.writeFileSync(indexHtmlPath, indexHtml);
console.log('✓ Updated index.html with professional meta tags');

// Create professional README.md
const readmePath = path.join(__dirname, '../README.md');
const professionalReadme = `# Dave's DevOps Portfolio

A professional portfolio showcasing DevOps expertise, cloud infrastructure projects, and automation solutions.

## 🚀 About

This portfolio demonstrates my experience in:

- **Cloud Infrastructure**: AWS, Azure, GCP deployments and management
- **Automation**: CI/CD pipelines, Infrastructure as Code (IaC)
- **Containerization**: Docker, Kubernetes orchestration
- **Monitoring**: Application and infrastructure observability
- **DevOps Best Practices**: Security, scalability, and reliability

## 🛠️ Technologies

- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Deployment**: GitHub Actions, GitHub Pages
- **UI Components**: shadcn/ui, Radix UI

## 📋 Features

- **Portfolio Projects**: Detailed project showcases with technology stacks
- **Tutorials**: DevOps and cloud engineering educational content
- **Contact Form**: Professional inquiry handling
- **Admin Dashboard**: Content management system
- **Responsive Design**: Mobile-first approach

## 🔧 Local Development

\`\`\`bash
# Clone the repository
git clone https://github.com/dmaru09sub/dave-ops-portfolio.git

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## 📫 Contact

For DevOps consultation or collaboration opportunities, please use the contact form on the website.

---

Built with modern web technologies and DevOps best practices.
`;

fs.writeFileSync(readmePath, professionalReadme);
console.log('✓ Created professional README.md');

// Clean up development files that shouldn't be in production
const filesToRemove = [
  'src/components/ui/use-toast.ts', // Duplicate file
];

filesToRemove.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`✓ Removed development file: ${file}`);
  }
});

console.log('🎉 Portfolio customization completed successfully!');
