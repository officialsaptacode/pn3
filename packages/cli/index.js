#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const REPO_URL = "https://github.com/saptacode/pn3.git"; // Update with actual repo if private

rl.question("SaaS Project Name (e.g. acme-corp): ", (projectName) => {
  if (!projectName) {
    console.error("Project name is required.");
    process.exit(1);
  }

  const targetDir = path.join(process.cwd(), projectName);
  
  if (fs.existsSync(targetDir)) {
    console.error(`Directory ${projectName} already exists!`);
    process.exit(1);
  }

  console.log(`\n🚀 Creating SaaS factory in ${targetDir}...`);
  
  try {
    // 1. Clone without history (lazy degit)
    execSync(`git clone --depth 1 ${REPO_URL} ${targetDir}`, { stdio: "ignore" });
    fs.rmSync(path.join(targetDir, ".git"), { recursive: true, force: true });

    // 2. Dynamic String Replacement (The Brand Injector)
    const packageJsonPath = path.join(targetDir, "package.json");
    if (fs.existsSync(packageJsonPath)) {
      let pkg = fs.readFileSync(packageJsonPath, "utf-8");
      pkg = pkg.replace(/"name": ".*"/, `"name": "${projectName}"`);
      fs.writeFileSync(packageJsonPath, pkg);
    }

    // 3. Setup fresh Git & Env
    console.log("⚙️  Setting up environment...");
    execSync(`cd ${targetDir} && git init`, { stdio: "ignore" });
    
    // Copy .env if it exists
    if (fs.existsSync(path.join(targetDir, "apps/server/.env.example"))) {
      fs.copyFileSync(path.join(targetDir, "apps/server/.env.example"), path.join(targetDir, "apps/server/.env"));
    }

    console.log("\n✅ Factory ready. Next steps:");
    console.log(`cd ${projectName}`);
    console.log(`npx npm-check-updates -u && pnpm install`);
    console.log(`pnpm dev`);
  } catch (error) {
    console.error("Failed to scaffold project:", error.message);
  }
  
  rl.close();
});
