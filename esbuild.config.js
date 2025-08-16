const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs");

// Simple colored console output
const chalk = {
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
};

// Path aliases for monorepo packages
const aliases = {
  "@pm": path.resolve(__dirname, "src/domains/pm-toolkit"),
  "@forms": path.resolve(__dirname, "src/forms"),
  "@domains": path.resolve(__dirname, "src/domains"),
  "@ui": path.resolve(__dirname, "src/ui"),
  "@utils": path.resolve(__dirname, "src/utils"),
  "@": path.resolve(__dirname, "src"),

  "@/config": path.resolve(__dirname, "src/config"),
  "@/forms": path.resolve(__dirname, "src/forms"),
};

// Validate alias paths exist
for (const [alias, aliasPath] of Object.entries(aliases)) {
  if (!fs.existsSync(aliasPath)) {
    console.warn(
      chalk.yellow(
        `⚠️ Warning: Path alias '${alias}' points to a missing directory: ${aliasPath}`
      )
    );
  }
}

// Define domains/projects to build
const domains = [
  {
    name: "pm-toolkit",
    entryPoint: "src/apps-scripts/pm-toolkit/src/index.ts",
    outfile: "src/apps-scripts/pm-toolkit/build/code.js",
  },
  {
    name: "forms",
    entryPoint: "src/apps-scripts/forms-library/src/index.ts",
    outfile: "src/apps-scripts/forms-library/build/code.js",
  },
  // Add additional domains below if needed
  // {
  //   name: "another-domain",
  //   entryPoint: "src/another-domain/src/main.ts",
  //   outfile: "src/another-domain/build/code.js",
  // }
];

// Shared build options
const commonOptions = {
  bundle: true,
  platform: "node", // Changed from browser to node for better compatibility with Apps Script
  target: "es2019", // Ensure compatibility with Apps Script
  format: "cjs", // Changed from iife to cjs (CommonJS) for Apps Script compatibility
  tsconfig: "tsconfig.json",
  resolveExtensions: [".ts", ".js", ".json"],
  alias: aliases,
  sourcemap: true,
  logLevel: "info",
};

// Build one domain
async function buildDomain(domain) {
  console.log(chalk.cyan(`🔨 Building domain: ${domain.name}...`));

  const buildDir = path.dirname(domain.outfile);
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  try {
    await esbuild.build({
      ...commonOptions,
      entryPoints: [domain.entryPoint],
      outfile: domain.outfile,
    });
    console.log(chalk.green(`✅ Successfully built ${domain.name}`));
    return true;
  } catch (error) {
    console.error(chalk.red(`❌ Failed to build ${domain.name}:`), error);
    return false;
  }
}

// Entry point
async function buildDomains() {
  const targetDomain = process.env.DOMAIN;

  if (targetDomain) {
    const domain = domains.find((d) => d.name === targetDomain);

    if (!domain) {
      console.error(
        chalk.red(
          `❌ Domain '${targetDomain}' not found in esbuild.config.js.`
        ) + `\n🛠️  Add it to the 'domains' array near the top of the file.`
      );
      process.exit(1);
    }

    const success = await buildDomain(domain);
    if (!success) process.exit(1);
  } else {
    console.log(chalk.blue("📦 Building all domains..."));
    const results = await Promise.all(domains.map(buildDomain));

    if (results.every(Boolean)) {
      console.log(chalk.green("🎉 All builds completed successfully!"));
    } else {
      console.error(chalk.red("⚠️ Some builds failed."));
      process.exit(1);
    }
  }
}

buildDomains();
