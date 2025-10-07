/**
 * Encryption Service for handling all E2E encryption in the app
 * Provides methods for encrypting messages, API keys, and user data
 */

import { encrypt, decrypt, encryptObject, decryptObject, hashData } from '@/utils/encryption';

export interface EncryptedData {
  encrypted: string;
  timestamp: number;
  version: string; // For future encryption algorithm updates
}

export class EncryptionService {
  private static instance: EncryptionService;
  private readonly VERSION = '1.0.0';

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Encrypt a message for storage
   */
  async encryptMessage(message: string): Promise<EncryptedData> {
    const encrypted = await encrypt(message);
    return {
      encrypted,
      timestamp: Date.now(),
      version: this.VERSION,
    };
  }

  /**
   * Decrypt a message from storage
   */
  async decryptMessage(data: EncryptedData | string): Promise<string> {
    // Handle both old format (plain string) and new format (EncryptedData)
    if (typeof data === 'string') {
      return decrypt(data);
    }
    return decrypt(data.encrypted);
  }

  /**
   * Encrypt sensitive user data
   */
  async encryptUserData<T>(data: T): Promise<EncryptedData> {
    const encrypted = await encryptObject(data);
    return {
      encrypted,
      timestamp: Date.now(),
      version: this.VERSION,
    };
  }

  /**
   * Decrypt user data
   */
  async decryptUserData<T>(data: EncryptedData | string): Promise<T | null> {
    if (typeof data === 'string') {
      return decryptObject<T>(data);
    }
    return decryptObject<T>(data.encrypted);
  }

  /**
   * Create a secure hash of sensitive data (for verification, not encryption)
   */
  async createHash(data: string): Promise<string> {
    return hashData(data);
  }

  /**
   * Encrypt API credentials
   */
  async encryptCredentials(credentials: Record<string, any>): Promise<EncryptedData> {
    return this.encryptUserData(credentials);
  }

  /**
   * Decrypt API credentials
   */
  async decryptCredentials(data: EncryptedData | string): Promise<Record<string, any> | null> {
    return this.decryptUserData<Record<string, any>>(data);
  }

  /**
   * Securely store data in localStorage with encryption
   */
  async secureStore(key: string, data: any): Promise<void> {
    try {
      const encrypted = await encryptObject(data);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error('Error storing encrypted data:', error);
      throw new Error('Failed to securely store data');
    }
  }

  /**
   * Retrieve and decrypt data from localStorage
   */
  async secureRetrieve<T>(key: string): Promise<T | null> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;
      return decryptObject<T>(encrypted);
    } catch (error) {
      console.error('Error retrieving encrypted data:', error);
      return null;
    }
  }

  /**
   * Remove data from secure storage
   */
  secureRemove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all encrypted data
   */
  secureClearAll(): void {
    // Only clear devonn-specific keys
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('devonn_') || key.includes('encrypted')) {
        localStorage.removeItem(key);
      }
    });
  }
}

// Export singleton instance
export const encryptionService = EncryptionService.getInstance();
