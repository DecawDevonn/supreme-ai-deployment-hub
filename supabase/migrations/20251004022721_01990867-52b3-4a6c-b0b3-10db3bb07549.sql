-- Fix security warnings by setting search_path to empty string
-- This forces all object references to be fully qualified

CREATE OR REPLACE FUNCTION public.encrypt_credentials(credentials_json jsonb, encryption_key text)
RETURNS bytea
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN pgp_sym_encrypt(credentials_json::text, encryption_key);
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_credentials(encrypted_data bytea, encryption_key text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_data, encryption_key)::jsonb;
EXCEPTION
  WHEN OTHERS THEN
    RETURN '{}'::jsonb;
END;
$$;
