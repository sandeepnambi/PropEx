const fs = require('fs');
const path = require('path');

const directoryPaths = [
    path.join(__dirname, 'src', 'pages'),
    path.join(__dirname, 'src', 'components', 'agent'),
    path.join(__dirname, 'src', 'components', 'admin'),
    path.join(__dirname, 'src', 'components', 'listings'),
    path.join(__dirname, 'src', 'components', 'layout'),
];

const skipFiles = [
    'HomePage.tsx', 
    'AuthPage.tsx', 
    'Navbar.tsx', 
    'LoginForm.tsx', 
    'RegisterForm.tsx',
    'SearchForm.tsx'
];

const replacements = {
    'bg-white/95': 'bg-[#1a1d24]/95',
    'bg-white/90': 'bg-surface/90',
    'bg-white/80': 'bg-background/80',
    'bg-gray-50/80': 'bg-surface',
    'bg-white': 'bg-surface',
    'bg-gray-50': 'bg-background',
    'bg-gray-100': 'bg-background',
    'text-gray-900': 'text-white',
    'text-gray-800': 'text-gray-200',
    'text-gray-700': 'text-gray-300',
    'text-gray-600': 'text-gray-400',
    'text-gray-500': 'text-gray-500',
    'border-gray-100': 'border-gray-800',
    'border-gray-200': 'border-gray-800',
    'border-gray-300': 'border-gray-700',
    'from-white': 'from-surface',
    'to-gray-50': 'to-background',
    'from-gray-50': 'from-background',
    'to-white': 'to-surface',
    'from-gray-100': 'from-background',
    'from-primary to-secondary': 'from-primary to-yellow-600',
    'from-primary/10 to-secondary/10': 'from-primary/20 to-primary/5',
    'text-emerald-700': 'text-primary',
    'bg-emerald-100': 'bg-primary/20',
};

const walkSync = (dir, filelist = []) => {
    if (!fs.existsSync(dir)) return filelist;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            filelist = walkSync(filepath, filelist);
        } else {
            if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
                if (!skipFiles.some(f => filepath.includes(f))) {
                    filelist.push(filepath);
                }
            }
        }
    }
    return filelist;
};

let filesToProcess = [];
for (const dir of directoryPaths) {
    filesToProcess = filesToProcess.concat(walkSync(dir));
}

for (const filepath of filesToProcess) {
    let content = fs.readFileSync(filepath, 'utf8');
    let original = content;

    for (const [search, replace] of Object.entries(replacements)) {
        // Simple string replacement using a global regex.
        // We use word boundaries where appropriate to avoid partial matches
        let escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        content = content.replace(new RegExp(escapeRegExp(search), 'g'), replace);
    }

    if (content !== original) {
        fs.writeFileSync(filepath, content, 'utf8');
        console.log(`Updated ${filepath}`);
    }
}

console.log('Theme replacement complete.');
