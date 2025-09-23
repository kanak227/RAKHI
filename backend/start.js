#!/usr/bin/env node

/**
 * RAKHI Backend Startup Script
 * This script helps you get started with the RAKHI backend
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 RAKHI Backend Setup');
console.log('=====================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  try {
    fs.copyFileSync(path.join(__dirname, 'env.example'), envPath);
    console.log('✅ .env file created successfully');
    console.log('⚠️  Please update the .env file with your configuration\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit', cwd: __dirname });
    console.log('✅ Dependencies installed successfully\n');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed\n');
}

// Create upload directories
console.log('📁 Creating upload directories...');
const uploadDirs = [
  'uploads',
  'uploads/voice-codewords',
  'uploads/recordings',
  'uploads/voice-test'
];

uploadDirs.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`   ✅ Created: ${dir}`);
  } else {
    console.log(`   ✅ Exists: ${dir}`);
  }
});

console.log('\n🎉 Setup complete!');
console.log('\n📋 Next steps:');
console.log('1. Update .env file with your MongoDB URI and JWT secret');
console.log('2. Start MongoDB (if using local instance)');
console.log('3. Run: npm run dev');
console.log('\n🔗 API will be available at: http://localhost:3000');
console.log('📚 API documentation: http://localhost:3000/api/health');
console.log('\n💡 For voice recognition testing, use the /api/voice/test endpoint');

