# End-to-End Encryption (E2E) in Devonn.AI

## Overview

Devonn.AI implements comprehensive end-to-end encryption to protect sensitive user data, API keys, chat messages, and credentials throughout the entire application lifecycle.

---

## Architecture

### Client-Side Encryption (Frontend)

**Technology**: Web Crypto API (AES-GCM-256)

**What's Encrypted:**
- API keys and credentials
- Chat messages and conversation history
- User preferences and settings
- Workflow configurations
- Authentication tokens

**Key Features:**
- 256-bit AES-GCM encryption
- PBKDF2 key derivation (100,000 iterations)
- Random salt and IV for each encryption
- Browser fingerprint-based key generation

### Server-Side Encryption (Backend)

**Technology**: 
- Fernet encryption (Python cryptography library)
- PostgreSQL pgcrypto extension

**What's Encrypted:**
- Database credentials stored in `api_connections` table
- Secrets and environment variables
- Backup files

---

## Implementation Details

### Frontend Encryption

```typescript
// Using the encryption utility
import { encrypt, decrypt } from '@/utils/encryption';

// Encrypt sensitive data
const encrypted = await encrypt("sensitive data");

// Decrypt when needed
const decrypted = await decrypt(encrypted);
```

```typescript
// Using the encryption service
import { encryptionService } from '@/services/encryptionService';

// Store encrypted data
await encryptionService.secureStore('myKey', { apiKey: 'secret' });

// Retrieve encrypted data
const data = await encryptionService.secureRetrieve('myKey');
```

### Database Encryption

```sql
-- Encrypt credentials before storage
SELECT encrypt_credentials(
  '{"api_key": "sk-..."}'::jsonb, 
  'encryption-key'
);

-- Decrypt credentials when needed
SELECT decrypt_credentials(
  encrypted_data, 
  'encryption-key'
);
```

---

## Security Best Practices

### ✅ DO:

1. **Always encrypt before storage**
   ```typescript
   // ✅ Good
   const encrypted = await encrypt(apiKey);
   localStorage.setItem('key', encrypted);
   
   // ❌ Bad
   localStorage.setItem('key', apiKey);
   ```

2. **Use the encryption service for consistency**
   ```typescript
   // ✅ Good
   await encryptionService.secureStore('config', data);
   
   // ❌ Bad
   localStorage.setItem('config', JSON.stringify(data));
   ```

3. **Rotate encryption keys regularly**
   ```typescript
   if (shouldRotateKey(lastRotation)) {
     // Re-encrypt with new key
     await rotateEncryptionKeys();
   }
   ```

4. **Never log decrypted data**
   ```typescript
   // ✅ Good
   console.log('API key configured');
   
   // ❌ Bad
   console.log('API key:', decryptedKey);
   ```

### ❌ DON'T:

1. **Never hardcode encryption keys**
   ```typescript
   // ❌ NEVER do this
   const KEY = "hardcoded-key-123";
   ```

2. **Never store sensitive data unencrypted**
   ```typescript
   // ❌ NEVER do this
   localStorage.setItem('password', plainPassword);
   ```

3. **Never send decrypted data over insecure channels**
   ```typescript
   // ❌ NEVER do this
   fetch('http://api.example.com', { 
     body: JSON.stringify({ apiKey: decryptedKey })
   });
   ```

4. **Never reuse IVs (Initialization Vectors)**
   - The encryption utility automatically generates random IVs
   - Never implement custom IV generation unless you know what you're doing

---

## Data Flow

### Encryption Flow

```
User Input → Frontend Encryption → Encrypted Storage → Backend (if needed) → Database Encryption → Secure Storage
```

### Decryption Flow

```
Secure Storage → Database Decryption → Backend Processing → Frontend Decryption → User Display
```

---

## Key Management

### Frontend Keys

- **Master Password**: Derived from browser fingerprint
- **Encryption Key**: Derived using PBKDF2 with random salt
- **Rotation**: Every 30 days (automatic prompt)

### Backend Keys

- **Stored in**: Environment variables (never committed)
- **Format**: Base64-encoded Fernet key
- **Rotation**: Manual, with migration script

---

## API Key Protection

### Storage

1. **Client-Side**:
   - Encrypted with AES-GCM before localStorage
   - Decrypted only when needed for API calls
   - Never exposed in logs or console

2. **Server-Side**:
   - Stored in `api_connections` table with `credentials` column
   - Encrypted using pgcrypto extension
   - Decrypted only in memory during API calls

### Transmission

- Always use HTTPS/TLS for API communication
- Never send unencrypted credentials
- Use JWT tokens for authentication (short-lived)

---

## Chat Message Encryption

### Implementation

```typescript
// Messages are encrypted before sending to backend
const encryptedMessage = await encryptionService.encryptMessage(userMessage);

// Store encrypted in database
await supabase.from('chat_messages').insert({
  content: encryptedMessage.encrypted,
  metadata: { encrypted: true, version: encryptedMessage.version }
});

// Decrypt when displaying
const decrypted = await encryptionService.decryptMessage(encryptedMessage);
```

---

## Compliance

### Standards

- **GDPR**: User data encrypted at rest and in transit
- **HIPAA**: PHI protection through E2E encryption
- **SOC 2**: Encryption key management and rotation
- **PCI DSS**: Payment data encryption (if applicable)

### Audit Trail

- Log all encryption/decryption events (without exposing data)
- Track key rotation events
- Monitor failed decryption attempts
- Alert on suspicious patterns

---

## Performance Considerations

### Optimization

1. **Encrypt only sensitive data**
   - Not all data needs encryption
   - Balance security with performance

2. **Batch operations**
   ```typescript
   // ✅ Good
   const encrypted = await Promise.all(
     items.map(item => encrypt(item))
   );
   
   // ❌ Slow
   for (const item of items) {
     await encrypt(item); // Blocks each iteration
   }
   ```

3. **Cache decrypted keys in memory**
   - Don't decrypt the same key repeatedly
   - Clear cache on logout

4. **Use Web Workers for heavy encryption**
   - Offload encryption to background threads
   - Prevents UI blocking

---

## Testing Encryption

### Unit Tests

```typescript
describe('Encryption Service', () => {
  it('should encrypt and decrypt data correctly', async () => {
    const original = 'sensitive data';
    const encrypted = await encrypt(original);
    const decrypted = await decrypt(encrypted);
    expect(decrypted).toBe(original);
  });

  it('should produce different outputs for same input', async () => {
    const data = 'test';
    const encrypted1 = await encrypt(data);
    const encrypted2 = await encrypt(data);
    expect(encrypted1).not.toBe(encrypted2); // Due to random IV
  });

  it('should fail gracefully on invalid data', async () => {
    const decrypted = await decrypt('invalid-encrypted-data');
    expect(decrypted).toBe('');
  });
});
```

---

## Troubleshooting

### Common Issues

1. **Decryption fails after browser update**
   - Browser fingerprint changed
   - Solution: Implement backup key derivation method

2. **Data loss after key rotation**
   - Re-encryption failed
   - Solution: Keep old key for 48 hours during rotation

3. **Performance degradation**
   - Too much data being encrypted
   - Solution: Encrypt only sensitive fields, not entire objects

---

## Migration Guide

### Upgrading from Old Encryption

```typescript
// Check if data uses old encryption format
if (!data.version || data.version < '1.0.0') {
  // Decrypt with old method
  const decrypted = oldDecrypt(data);
  
  // Re-encrypt with new method
  const newEncrypted = await encrypt(decrypted);
  
  // Update storage
  await updateStorage(newEncrypted);
}
```

---

## Future Enhancements

- [ ] Hardware-backed key storage (WebAuthn)
- [ ] Multi-party computation for shared secrets
- [ ] Homomorphic encryption for computation on encrypted data
- [ ] Quantum-resistant algorithms (post-quantum cryptography)

---

**Last Updated**: 2025-01-10  
**Version**: 1.0.0  
**Review Date**: 2025-04-10
