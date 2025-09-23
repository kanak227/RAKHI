const fs = require('fs');
const path = require('path');

/**
 * Create upload directory if it doesn't exist
 */
const createUploadDir = () => {
  const uploadDir = path.join(__dirname, '../uploads');
  const voiceDir = path.join(uploadDir, 'voice-codewords');
  const recordingsDir = path.join(uploadDir, 'recordings');

  [uploadDir, voiceDir, recordingsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
};

/**
 * Delete file safely
 */
const deleteFile = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`🗑️ Deleted file: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

/**
 * Get file size in bytes
 */
const getFileSize = (filePath) => {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    console.error('Error getting file size:', error);
    return 0;
  }
};

/**
 * Check if file exists
 */
const fileExists = (filePath) => {
  return fs.existsSync(filePath);
};

/**
 * Get file extension
 */
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

/**
 * Validate audio file
 */
const validateAudioFile = (file) => {
  const allowedTypes = ['.wav', '.mp3', '.m4a', '.aac'];
  const allowedMimes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/mp4', 'audio/aac'];
  
  const extension = getFileExtension(file.originalname);
  const isValidType = allowedTypes.includes(extension) || allowedMimes.includes(file.mimetype);
  
  return {
    isValid: isValidType,
    extension,
    mimeType: file.mimetype
  };
};

module.exports = {
  createUploadDir,
  deleteFile,
  getFileSize,
  fileExists,
  getFileExtension,
  validateAudioFile
};

