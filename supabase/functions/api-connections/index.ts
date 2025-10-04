import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple validation tests for different API types
async function validateCredentials(serviceName: string, authType: string, credentials: any): Promise<boolean> {
  try {
    switch (serviceName.toLowerCase()) {
      case 'github':
        if (authType === 'bearer_token' && credentials.token) {
          const response = await fetch('https://api.github.com/user', {
            headers: { 'Authorization': `Bearer ${credentials.token}` }
          });
          return response.ok;
        }
        break;
      
      case 'slack':
        if (authType === 'bearer_token' && credentials.token) {
          const response = await fetch('https://slack.com/api/auth.test', {
            headers: { 'Authorization': `Bearer ${credentials.token}` }
          });
          return response.ok;
        }
        break;
      
      case 'openai':
        if (authType === 'bearer_token' && credentials.token) {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${credentials.token}` }
          });
          return response.ok;
        }
        break;
      
      default:
        // For unknown services, assume valid if credentials exist
        return Object.keys(credentials).length > 0;
    }
  } catch (error) {
    console.error('Validation error:', error);
    return false;
  }
  return false;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization')!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('Auth error:', authError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(req.url);
    const method = req.method;

    // GET /api-connections - List all connections
    if (method === 'GET' && url.pathname.endsWith('/api-connections')) {
      const { data, error } = await supabase
        .from('api_connections')
        .select('id, service_name, auth_type, is_valid, last_validated_at, created_at, updated_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /api-connections - Create new connection
    if (method === 'POST' && url.pathname.endsWith('/api-connections')) {
      const body = await req.json();
      const { service_name, auth_type, credentials } = body;

      if (!service_name || !auth_type || !credentials) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: service_name, auth_type, credentials' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log(`Creating connection for ${service_name} with auth type ${auth_type}`);

      // Validate credentials
      const isValid = await validateCredentials(service_name, auth_type, credentials);
      console.log(`Validation result: ${isValid}`);

      // Encrypt credentials before storing
      const encryptionKey = Deno.env.get('API_CREDENTIALS_ENCRYPTION_KEY');
      if (!encryptionKey) {
        console.error('Encryption key not configured');
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: encryptedData, error: encryptError } = await supabase.rpc('encrypt_credentials', {
        credentials_json: credentials,
        encryption_key: encryptionKey
      });

      if (encryptError) {
        console.error('Encryption error:', encryptError);
        return new Response(
          JSON.stringify({ error: 'Failed to encrypt credentials' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data, error } = await supabase
        .from('api_connections')
        .insert({
          user_id: user.id,
          service_name,
          auth_type,
          credentials: encryptedData,
          is_valid: isValid,
          last_validated_at: isValid ? new Date().toISOString() : null,
        })
        .select('id, service_name, auth_type, is_valid, last_validated_at, created_at, updated_at')
        .single();

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data, validated: isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // DELETE /api-connections/:id - Delete connection
    if (method === 'DELETE' && url.pathname.includes('/api-connections/')) {
      const connectionId = url.pathname.split('/').pop();

      if (!connectionId) {
        return new Response(
          JSON.stringify({ error: 'Missing connection ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error } = await supabase
        .from('api_connections')
        .delete()
        .eq('id', connectionId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Database error:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // POST /api-connections/:id/validate - Re-validate connection
    if (method === 'POST' && url.pathname.includes('/validate')) {
      const connectionId = url.pathname.split('/')[url.pathname.split('/').length - 2];

      const { data: connection, error: fetchError } = await supabase
        .from('api_connections')
        .select('*')
        .eq('id', connectionId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !connection) {
        return new Response(
          JSON.stringify({ error: 'Connection not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Decrypt credentials before validating
      const encryptionKey = Deno.env.get('API_CREDENTIALS_ENCRYPTION_KEY');
      if (!encryptionKey) {
        console.error('Encryption key not configured');
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: decryptedCredentials, error: decryptError } = await supabase.rpc('decrypt_credentials', {
        encrypted_data: connection.credentials,
        encryption_key: encryptionKey
      });

      if (decryptError) {
        console.error('Decryption error:', decryptError);
        return new Response(
          JSON.stringify({ error: 'Failed to decrypt credentials' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const isValid = await validateCredentials(
        connection.service_name,
        connection.auth_type,
        decryptedCredentials
      );

      const { error: updateError } = await supabase
        .from('api_connections')
        .update({
          is_valid: isValid,
          last_validated_at: new Date().toISOString(),
        })
        .eq('id', connectionId);

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, is_valid: isValid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in api-connections function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
