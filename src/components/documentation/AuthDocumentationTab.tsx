import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Key, Users, Settings, AlertTriangle, Code, Database } from 'lucide-react';

const AuthDocumentationTab: React.FC = () => {
  return (
    <div className="mt-6 space-y-6">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <CardTitle>Authentication & Security</CardTitle>
          </div>
          <CardDescription>
            Complete guide to implementing secure authentication in your Devonn.ai applications
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="flows">Auth Flows</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="management">User Management</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Architecture</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Lovable Cloud provides built-in authentication powered by Supabase Auth, offering enterprise-grade security
                without the complexity of managing your own auth infrastructure.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 border rounded-lg">
                  <Lock className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold">Secure by Default</h4>
                  <p className="text-sm text-muted-foreground">JWT tokens, bcrypt hashing, and RLS policies</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold">Multiple Providers</h4>
                  <p className="text-sm text-muted-foreground">Email, phone, OAuth, and enterprise SSO</p>
                </div>
                <div className="p-4 border rounded-lg">
                  <Key className="h-8 w-8 text-primary mb-2" />
                  <h4 className="font-semibold">User Management</h4>
                  <p className="text-sm text-muted-foreground">Built-in roles, permissions, and audit logs</p>
                </div>
              </div>

              <Separator className="my-6" />

              <h3 className="text-lg font-semibold">Core Concepts</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="users">
                  <AccordionTrigger>Users</AccordionTrigger>
                  <AccordionContent className="space-y-2">
                    <p>A user represents an authenticated identity in your application. Each user has:</p>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Unique ID (UUID)</li>
                      <li>Email or phone number</li>
                      <li>Authentication metadata</li>
                      <li>Optional user profile data</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="identities">
                  <AccordionTrigger>Identities</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Identities link users to authentication providers. A single user can have multiple identities
                      (e.g., email + Google OAuth), enabling identity linking and social login.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="sessions">
                  <AccordionTrigger>Sessions</AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Sessions manage authenticated user state using JWT tokens. They include access tokens
                      (short-lived) and refresh tokens (long-lived) for secure token rotation.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Getting Started Tab */}
        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
              <CardDescription>Implement authentication in your Devonn.ai project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">1. Framework Guides</h3>
                <div className="space-y-3">
                  <Card className="bg-secondary/50">
                    <CardHeader>
                      <CardTitle className="text-base">React / Next.js</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                        <code>{`import { supabase } from '@/integrations/supabase/client';

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
  options: {
    emailRedirectTo: \`\${window.location.origin}/dashboard\`
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password'
});

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') console.log('User signed in');
});`}</code>
                      </pre>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardHeader>
                      <CardTitle className="text-base">React Native</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Use the same Supabase client with additional configuration for deep linking and OAuth redirects.
                        See the full React Native guide for mobile-specific setup.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">2. Configure Auth Settings</h3>
                <div className="bg-muted/50 p-4 rounded-lg border">
                  <p className="mb-2">Access your auth configuration in Lovable Cloud dashboard:</p>
                  <ul className="list-disc pl-6 space-y-1 text-sm">
                    <li>Enable/disable authentication providers</li>
                    <li>Set redirect URLs for your deployed app</li>
                    <li>Configure email templates</li>
                    <li>Set password requirements</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">3. Implement Protected Routes</h3>
                <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" />;

  return <>{children}</>;
};`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Auth Flows Tab */}
        <TabsContent value="flows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Flows</CardTitle>
              <CardDescription>Implement different authentication methods</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="password">
                  <AccordionTrigger>Password-Based Authentication</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>Traditional email + password authentication with best practices:</p>
                    <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Sign up with email verification
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  options: {
    emailRedirectTo: \`\${window.location.origin}/verify\`,
    data: {
      display_name: 'John Doe'
    }
  }
});

// Password reset flow
const { error } = await supabase.auth.resetPasswordForEmail(
  'user@example.com',
  { redirectTo: \`\${window.location.origin}/reset-password\` }
);`}</code>
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="magic-link">
                  <AccordionTrigger>Email Login (Magic Link / OTP)</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>Passwordless authentication via email:</p>
                    <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Magic link
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: \`\${window.location.origin}/dashboard\`
  }
});

// Email OTP
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    shouldCreateUser: false
  }
});

// Verify OTP
const { error } = await supabase.auth.verifyOtp({
  email: 'user@example.com',
  token: '123456',
  type: 'email'
});`}</code>
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="oauth">
                  <AccordionTrigger>Social Login (OAuth)</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>Sign in with third-party providers:</p>
                    <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Google OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: \`\${window.location.origin}/auth/callback\`,
    queryParams: {
      access_type: 'offline',
      prompt: 'consent'
    }
  }
});

// GitHub OAuth
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'github',
  options: {
    scopes: 'user:email'
  }
});`}</code>
                    </pre>
                    <p className="text-sm text-muted-foreground mt-2">
                      Supported providers: Google, GitHub, GitLab, Bitbucket, Azure, Discord, Facebook, Twitter, and more.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="phone">
                  <AccordionTrigger>Phone Login</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Send SMS OTP
const { error } = await supabase.auth.signInWithOtp({
  phone: '+1234567890'
});

// Verify phone OTP
const { error } = await supabase.auth.verifyOtp({
  phone: '+1234567890',
  token: '123456',
  type: 'sms'
});`}</code>
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="mfa">
                  <AccordionTrigger>Multi-Factor Authentication (MFA)</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>Add an extra layer of security with TOTP-based MFA:</p>
                    <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Enroll MFA
const { data, error } = await supabase.auth.mfa.enroll({
  factorType: 'totp',
  friendlyName: 'My Authenticator'
});

// Challenge MFA
const { data, error } = await supabase.auth.mfa.challenge({
  factorId: 'factor-id-here'
});

// Verify MFA
const { data, error } = await supabase.auth.mfa.verify({
  factorId: 'factor-id-here',
  challengeId: 'challenge-id-here',
  code: '123456'
});`}</code>
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="anonymous">
                  <AccordionTrigger>Anonymous Sign-Ins</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <p>Allow users to use your app without creating an account:</p>
                    <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                      <code>{`// Create anonymous user
const { data, error } = await supabase.auth.signInAnonymously();

// Later convert to permanent account
const { error } = await supabase.auth.updateUser({
  email: 'user@example.com',
  password: 'secure-password'
});`}</code>
                    </pre>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Tab */}
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Providers</CardTitle>
              <CardDescription>Third-party authentication integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">Clerk</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Drop-in authentication solution with pre-built UI components
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">Firebase Auth</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Google's authentication service with extensive provider support
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">Auth0</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Enterprise-grade authentication and authorization platform
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">AWS Cognito</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Amazon's managed authentication service with Amplify integration
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-secondary/50">
                  <CardHeader>
                    <CardTitle className="text-base">WorkOS</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm">
                    <p className="text-muted-foreground">
                      Enterprise SSO and directory sync for B2B applications
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <CardTitle>Security Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password Security
                </h3>
                <p className="text-muted-foreground mb-4">
                  Help your users protect their accounts with strong password requirements.
                </p>
                
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Password Strength Guidelines</h4>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Composition</th>
                        <th className="text-left py-2">Length</th>
                        <th className="text-left py-2">Estimated Guesses</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">Digits only</td>
                        <td>8</td>
                        <td>~ 2²⁷</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Digits + letters</td>
                        <td>8</td>
                        <td>~ 2⁴¹</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">Digits + lowercase + uppercase</td>
                        <td>8</td>
                        <td>~ 2⁴⁸</td>
                      </tr>
                      <tr>
                        <td className="py-2">Digits + lowercase + uppercase + symbols</td>
                        <td>8</td>
                        <td>~ 2⁵²</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold">Configure Password Rules</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Minimum length (8+ characters recommended)</li>
                      <li>Required character sets (uppercase, lowercase, digits, symbols)</li>
                      <li>Prevent leaked passwords (via HaveIBeenPwned API)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Password Storage
                </h3>
                <p className="text-muted-foreground">
                  All passwords are hashed using bcrypt with unique salts per user. They are stored in the 
                  <code className="bg-muted px-1 mx-1 rounded">auth.users</code> table in the 
                  <code className="bg-muted px-1 mx-1 rounded">encrypted_password</code> column.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Row-Level Security (RLS)
                </h3>
                <p className="text-muted-foreground mb-3">
                  Protect your data with PostgreSQL Row-Level Security policies:
                </p>
                <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`-- Enable RLS on table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = user_id);`}</code>
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Additional Security Features</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Rate Limits</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatic rate limiting on authentication endpoints to prevent brute force attacks
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Bot Detection (CAPTCHA)</h4>
                      <p className="text-sm text-muted-foreground">
                        Integrate CAPTCHA services to prevent automated attacks
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Audit Logs</h4>
                      <p className="text-sm text-muted-foreground">
                        Track authentication events and user actions for security monitoring
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">JWT Tokens</h4>
                      <p className="text-sm text-muted-foreground">
                        Secure JSON Web Tokens with configurable expiration and refresh
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* User Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage users, roles, and permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Manage Users</h3>
                <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Update user metadata
const { error } = await supabase.auth.updateUser({
  data: { display_name: 'New Name' }
});

// Delete user (requires service role key)
const { error } = await supabase.auth.admin.deleteUser(userId);`}</code>
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Invite Users</h3>
                <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                  <code>{`// Send invitation email
const { data, error } = await supabase.auth.admin.inviteUserByEmail(
  'newuser@example.com',
  { redirectTo: \`\${window.location.origin}/onboarding\` }
);`}</code>
                </pre>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Roles and Permissions</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Implement role-based access control (RBAC) using a dedicated user_roles table:
                  </p>
                  <pre className="bg-background p-4 rounded-md overflow-x-auto text-sm">
                    <code>{`-- Create roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function
CREATE OR REPLACE FUNCTION public.has_role(
  _user_id UUID, 
  _role app_role
)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Use in RLS policies
CREATE POLICY "Admins can access all"
  ON some_table FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));`}</code>
                  </pre>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Configuration</h3>
                <div className="space-y-3">
                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">General Settings</h4>
                      <p className="text-sm text-muted-foreground">
                        Configure site URLs, JWT expiration, and session limits
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Email Templates</h4>
                      <p className="text-sm text-muted-foreground">
                        Customize email templates for confirmation, password reset, and invitations
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Redirect URLs</h4>
                      <p className="text-sm text-muted-foreground">
                        Manage allowed redirect URLs for OAuth and email confirmations
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-secondary/50">
                    <CardContent className="pt-6">
                      <h4 className="font-semibold mb-2">Custom SMTP</h4>
                      <p className="text-sm text-muted-foreground">
                        Use your own email provider for authentication emails
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-amber-500">Common Auth Issues</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Error: "requested path is invalid"</h4>
                <p className="text-sm text-muted-foreground">
                  This occurs when redirect URLs are not properly configured. Ensure your Site URL and Redirect URLs
                  are set correctly in your Lovable Cloud auth settings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Redirecting to localhost</h4>
                <p className="text-sm text-muted-foreground">
                  Update your auth settings to use your deployed domain instead of localhost. Lovable Cloud
                  automatically manages this, but you can add custom domains in the backend dashboard.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Email confirmation not working</h4>
                <p className="text-sm text-muted-foreground">
                  For development, enable "Auto-confirm email signups" in your auth settings. For production,
                  ensure your email provider is properly configured.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthDocumentationTab;
