import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const docs = ["phase1.md", "phase2.md", "phase3.md", "final.md"];

const headingPattern = /^### `([^`]+)`[^\n]*\n```[^\n]*\n([\s\S]*?)\n```/gm;

function writeFile(relativePath, content) {
  const filePath = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${content}\n`);
}

for (const doc of docs) {
  const docPath = path.join(root, doc);
  const source = fs.readFileSync(docPath, "utf8");

  let match;
  while ((match = headingPattern.exec(source))) {
    const [, relativePath, content] = match;
    writeFile(relativePath, content);
  }
}

for (const relativePath of ["src/hooks/useAdminMenu.ts", "src/app/page.tsx"]) {
  const filePath = path.join(root, relativePath);
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath);
  }
}

console.log("Extracted project files from docs.");
