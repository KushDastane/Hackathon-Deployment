
const crypto = require('crypto');

// 32-byte key for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'ambulance_secret_key_256_for_encryption';
const KEY = Buffer.from(ENCRYPTION_KEY.substring(0, 32)); // 256-bit key
const IV_LENGTH = 12; // Recommended IV length for GCM

// Encrypt data using AES-256-GCM
function encryptData(text) {
  try {
    const iv = crypto.randomBytes(IV_LENGTH); // random 12-byte IV
    const cipher = crypto.createCipheriv('aes-256-gcm', KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag().toString('hex');

    // return iv + encrypted data + authTag (joined by colons)
    return `${iv.toString('hex')}:${encrypted}:${authTag}`;
  } catch (error) {
    console.error('Encryption error:', error.message);
    return text;
  }
}

// Decrypt data using AES-256-GCM
function decryptData(data) {
  try {
    const [ivHex, encryptedData, authTagHex] = data.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');

    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error.message);
    return data; // fallback to original text
  }
}

module.exports = { encryptData, decryptData };
