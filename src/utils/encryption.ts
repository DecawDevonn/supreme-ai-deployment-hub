/**
 * End-to-End Encryption utility using Web Crypto API
 * Provides AES-GCM encryption for sensitive data
 */

// Algorithm configuration
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits recommended for AES-GCM
const SALT_LENGTH = 16;
const PBKDF2_ITERATIONS = 100000;

// Generate a deterministic encryption key based on user session
const deriveKey = async (password: string, salt: Uint8Array): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ['encrypt', 'decrypt']
  );
};

// Get a session-specific master password
const getMasterPassword = (): string => {
  // Use a combination of browser fingerprint for key derivation
  const browserInfo = [
    navigator.userAgent,
    navigator.language,
    window.screen.colorDepth,
    window.screen.width,
    window.screen.height,
  ].join('|');
  
  // Create a hash
  let hash = 0;
  for (let i = 0; i < browserInfo.length; i++) {
    hash = ((hash << 5) - hash) + browserInfo.charCodeAt(i);
    hash |= 0;
  }
  
  return `DEVONN_E2E_${hash}`;
};

/**
 * Encrypt text using AES-GCM
 */
export const encrypt = async (text: string): Promise<string> => {
  if (!text) return '';
  
  try {
    // Generate random salt and IV
    const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
    
    // Derive encryption key
    const key = await deriveKey(getMasterPassword(), salt);
    
    // Encrypt the data
    const encoder = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: ALGORITHM, iv },
      key,
      encoder.encode(text)
    );
    
    // Combine salt + iv + encrypted data
    const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encrypted), salt.length + iv.length);
    
    // Convert to base64 for storage
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt text using AES-GCM
 */
export const decrypt = async (encryptedText: string): Promise<string> => {
  if (!encryptedText) return '';
  
  try {
    // Decode from base64
    const combined = new Uint8Array(
      atob(encryptedText).split('').map(char => char.charCodeAt(0))
    );
    
    // Extract salt, iv, and encrypted data
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH);
    
    // Derive decryption key
    const key = await deriveKey(getMasterPassword(), salt);
    
    // Decrypt the data
    const decrypted = await crypto.subtle.decrypt(
      { name: ALGORITHM, iv },
      key,
      encrypted
    );
    
    // Convert back to string
    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * Encrypt an object (converts to JSON first)
 */
export const encryptObject = async <T>(obj: T): Promise<string> => {
  return encrypt(JSON.stringify(obj));
};

/**
 * Decrypt to an object
 */
export const decryptObject = async <T>(encryptedText: string): Promise<T | null> => {
  try {
    const decrypted = await decrypt(encryptedText);
    return decrypted ? JSON.parse(decrypted) : null;
  } catch (error) {
    console.error('Error decrypting object:', error);
    return null;
  }
};

/**
 * Hash data (one-way)
 */
export const hashData = async (data: string): Promise<string> => {
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Check if encryption key needs rotation (every 30 days)
 */
export const shouldRotateKey = (encryptionTimestamp: number): boolean => {
  if (!encryptionTimestamp) return true;
  
  const ROTATION_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  const now = Date.now();
  
  return (now - encryptionTimestamp) > ROTATION_PERIOD_MS;
};
