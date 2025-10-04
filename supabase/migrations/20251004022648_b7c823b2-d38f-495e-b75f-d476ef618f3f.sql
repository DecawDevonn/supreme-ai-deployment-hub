-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create encryption helper functions
CREATE OR REPLACE FUNCTION encrypt_credentials(credentials_json jsonb, encryption_key text)
RETURNS bytea
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN pgp_sym_encrypt(credentials_json::text, encryption_key);
END;
$$;

CREATE OR REPLACE FUNCTION decrypt_credentials(encrypted_data bytea, encryption_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key)::jsonb;
EXCEPTION
  WHEN OTHERS THEN
    RETURN '{}'::jsonb;
END;
$$;

-- Alter the credentials column to use bytea for encrypted storage
ALTER TABLE public.api_connections 
ALTER COLUMN credentials TYPE bytea 
USING pgp_sym_encrypt(credentials::text, current_setting('app.encryption_key', true));

-- Add comment to document the encryption
COMMENT ON COLUMN public.api_connections.credentials IS 'Encrypted credentials using pgp_sym_encrypt';
