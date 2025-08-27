import * as esbuild from "esbuild";
import fs from "fs";
import path from "path";

// Build configuration
const buildConfig = {
  entryPoints: ["./src/index.ts"],
  bundle: true,
  outfile: "./build/code.js",
  format: "iife",
  target: "es2020",
  platform: "browser",
  external: ["SpreadsheetApp", "Logger", "Utilities", "HtmlService"],
  define: {
    global: "globalThis",
  },
  minify: false,
  sourcemap: false,
  treeShaking: true,
  metafile: true,
};

// Clean build directory
console.log("🧹 Cleaning build directory...");
if (fs.existsSync("./build")) {
  fs.rmSync("./build", { recursive: true, force: true });
}
fs.mkdirSync("./build", { recursive: true });

// Build the TypeScript code
console.log("🔨 Building TypeScript code...");
try {
  const result = await esbuild.build(buildConfig);
  console.log("✅ Build completed successfully");

  if (result.metafile && result.metafile.outputs) {
    const bundleSize = result.metafile.outputs["./build/code.js"]?.bytes || 0;
    console.log(`📦 Bundle size: ${(bundleSize / 1024).toFixed(2)} KB`);
  }
} catch (error) {
  console.error("❌ Build failed:", error);
  process.exit(1);
}

// Copy appsscript.json
console.log("📋 Copying appsscript.json...");
fs.copyFileSync("./src/appsscript.json", "./build/appsscript.json");

// Remove .d.ts files from build
console.log("🧹 Removing .d.ts files from build...");
const removeDtsFiles = (dir) => {
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        removeDtsFiles(filePath);
      } else if (file.endsWith(".d.ts")) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Removed ${filePath}`);
      }
    });
  }
};

removeDtsFiles("./build");

// Copy domain-specific UI files from payments domain
console.log("Copying domain-specific UI files from payments domain...");
const copyDomainUIFiles = () => {
  const sourceDir = "../../../src/domains/payments/ui";
  const targetDir = "./build/domains/payments/ui";
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
        if ([".html", ".css"].includes(ext)) {
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
    console.log(`✅ Successfully copied ${filesCopied} domain UI files`);
  } else {
    console.log("⚠️ No domain UI files found to copy");
  }
};

copyDomainUIFiles();

// Copy local HTML files from src directory
console.log("Copying local HTML files from src directory...");
const copyLocalHtmlFiles = () => {
  const sourceDir = "./src";
  const targetDir = "./build";
  let filesCopied = 0;

  // Recursive function to copy files and directories
  const copyRecursively = (source, target, relativePath = "") => {
    // Get all entries in the current directory
    const entries = fs.readdirSync(source, { withFileTypes: true });

    for (const entry of entries) {
      const sourcePath = path.join(source, entry.name);
      const targetPath = path.join(target, relativePath, entry.name);
      const newRelativePath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and other build directories
        if (entry.name === "node_modules" || entry.name === "build") {
          continue;
        }
        // Create the target directory and copy its contents recursively
        fs.mkdirSync(path.join(target, newRelativePath), { recursive: true });
        copyRecursively(sourcePath, target, newRelativePath);
      } else if (entry.isFile()) {
        // Only copy HTML and CSS files (add more extensions as needed)
        const ext = path.extname(entry.name).toLowerCase();
        if ([".html", ".css"].includes(ext)) {
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
    console.log("⚠️ No local HTML/CSS files found to copy");
  }
};

copyLocalHtmlFiles();

console.log("🎉 Build process completed!");
console.log("📁 Build output: ./build/");
console.log("🚀 Ready to deploy with: clasp push");
