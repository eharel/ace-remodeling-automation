const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Clean up build directory
console.log('Cleaning build directory...');
if (fs.existsSync('./build')) {
  fs.rmSync('./build', { recursive: true, force: true });
}
fs.mkdirSync('./build', { recursive: true });

// Copy appsscript.json
console.log('Copying appsscript.json...');
if (fs.existsSync('./src/appsscript.json')) {
  fs.copyFileSync('./src/appsscript.json', './build/appsscript.json');
} else {
  console.log('Warning: appsscript.json not found in src directory');
  // Create a basic appsscript.json if it doesn't exist
  fs.writeFileSync('./build/appsscript.json', JSON.stringify({
    "timeZone": "America/Denver",
    "dependencies": {},
    "exceptionLogging": "STACKDRIVER",
    "runtimeVersion": "V8"
  }, null, 2));
}

// Run the build process using the parent project's build script
console.log('Building project...');
try {
  execSync('cd ../.. && npm run build:pm', { stdio: 'inherit' });
  console.log('Build completed successfully');
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}

// Remove all .d.ts files from build directory
console.log('Removing TypeScript declaration files...');
const removeDtsFiles = (dir) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      removeDtsFiles(fullPath);
    } else if (entry.name.endsWith('.d.ts')) {
      fs.unlinkSync(fullPath);
    }
  }
};

removeDtsFiles('./build');

// Copy UI files from shared UI directory recursively
console.log('Copying UI files from shared UI directory...');
const copyUIFiles = () => {
  const sourceDir = '../../src/ui';
  const targetDir = './build/ui';
  let filesCopied = 0;
  
  // Create the target directory if it doesn't exist
  fs.mkdirSync(targetDir, { recursive: true });
  
  // Recursive function to copy files and directories
  const copyRecursively = (source, target) => {
    // Get all entries in the current directory
    const entries = fs.readdirSync(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, entry.name);
      
      if (entry.isDirectory()) {
        // Create the target directory and copy its contents recursively
        fs.mkdirSync(targetPath, { recursive: true });
        copyRecursively(sourcePath, targetPath);
      } else if (entry.isFile()) {
        // Only copy HTML and CSS files (add more extensions as needed)
        const ext = path.extname(entry.name).toLowerCase();
        if (['.html', '.css'].includes(ext)) {
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ Copied ${path.relative(sourceDir, sourcePath)}`);
          filesCopied++;
        }
      }
    }
  };
  
  // Start the recursive copy
  copyRecursively(sourceDir, targetDir);
  
  if (filesCopied > 0) {
    console.log(`✅ Successfully copied ${filesCopied} UI files`);
  } else {
    console.log('⚠️ No UI files found to copy');
  }
}

copyUIFiles();

// Copy local HTML files from src directory
console.log('Copying local HTML files from src directory...');
const copyLocalHtmlFiles = () => {
  const sourceDir = './src';
  const targetDir = './build';
  let filesCopied = 0;
  
  // Recursive function to copy files and directories
  const copyRecursively = (source, target, relativePath = '') => {
    // Get all entries in the current directory
    const entries = fs.readdirSync(source, { withFileTypes: true });
    
    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, relativePath, entry.name);
      const newRelativePath = path.join(relativePath, entry.name);
      
      if (entry.isDirectory()) {
        // Skip node_modules and other build directories
        if (entry.name === 'node_modules' || entry.name === 'build') {
          continue;
        }
        // Create the target directory and copy its contents recursively
        fs.mkdirSync(path.join(target, newRelativePath), { recursive: true });
        copyRecursively(sourcePath, target, newRelativePath);
      } else if (entry.isFile()) {
        // Only copy HTML and CSS files (add more extensions as needed)
        const ext = path.extname(entry.name).toLowerCase();
        if (['.html', '.css'].includes(ext)) {
          // Create parent directories if they don't exist
          const targetDir = path.dirname(targetPath);
          fs.mkdirSync(targetDir, { recursive: true });
          
          fs.copyFileSync(sourcePath, targetPath);
          console.log(`✅ Copied local file: ${newRelativePath}`);
          filesCopied++;
        }
      }
    }
  };
  
  // Start the recursive copy
  copyRecursively(sourceDir, targetDir);
  
  if (filesCopied > 0) {
    console.log(`✅ Successfully copied ${filesCopied} local HTML/CSS files`);
  } else {
    console.log('⚠️ No local HTML/CSS files found to copy');
  }
};

copyLocalHtmlFiles();

console.log('Build preparation complete. Ready for clasp push.');
