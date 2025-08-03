#!/usr/bin/env node

/**
 * Fix TypeScript Path Aliases Script
 * Converts @/ imports to relative imports in all TypeScript files
 */

const fs = require('fs');
const path = require('path');

function getAllTsFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== 'node_modules' && item !== 'dist') {
      getAllTsFiles(fullPath, files);
    } else if (item.endsWith('.ts') && !item.endsWith('.d.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function getRelativePath(fromFile, toPath) {
  const fromDir = path.dirname(fromFile);
  const srcDir = path.join(__dirname, 'src');
  
  // Convert @/path to src/path
  const targetPath = toPath.replace('@/', '');
  const fullTargetPath = path.join(srcDir, targetPath);
  
  // Get relative path from current file to target
  let relativePath = path.relative(fromDir, fullTargetPath);
  
  // Ensure it starts with ./ or ../
  if (!relativePath.startsWith('.')) {
    relativePath = './' + relativePath;
  }
  
  // Convert backslashes to forward slashes for consistency
  return relativePath.replace(/\\/g, '/');
}

function fixImportsInFile(filePath) {
  console.log(`Fixing imports in: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Match import statements with @/ aliases
  const importRegex = /import\s+(?:{[^}]*}|\*\s+as\s+\w+|\w+)\s+from\s+['"](@\/[^'"]*)['"]/g;
  
  content = content.replace(importRegex, (match, aliasPath) => {
    const relativePath = getRelativePath(filePath, aliasPath);
    const newImport = match.replace(aliasPath, relativePath);
    console.log(`  ${aliasPath} -> ${relativePath}`);
    modified = true;
    return newImport;
  });
  
  // Also fix require statements
  const requireRegex = /require\(['"](@\/[^'"]*)['"]\)/g;
  
  content = content.replace(requireRegex, (match, aliasPath) => {
    const relativePath = getRelativePath(filePath, aliasPath);
    const newRequire = match.replace(aliasPath, relativePath);
    console.log(`  ${aliasPath} -> ${relativePath}`);
    modified = true;
    return newRequire;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Updated ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes needed in ${filePath}`);
  }
  
  return modified;
}

function main() {
  console.log('🔧 Fixing TypeScript path aliases in server files...');
  
  const srcDir = path.join(__dirname, 'src');
  const tsFiles = getAllTsFiles(srcDir);
  
  console.log(`Found ${tsFiles.length} TypeScript files to process`);
  
  let totalModified = 0;
  
  for (const file of tsFiles) {
    if (fixImportsInFile(file)) {
      totalModified++;
    }
  }
  
  console.log(`\n✅ Fixed imports in ${totalModified} files`);
  console.log('🎉 All TypeScript path aliases have been converted to relative imports!');
}

if (require.main === module) {
  main();
}

module.exports = { fixImportsInFile, getRelativePath };
