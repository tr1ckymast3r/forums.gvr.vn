import { createClient } from '@supabase/supabase-js';

// Fallback to empty string if env vars are not defined
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createAdminUser() {
  console.log('Creating admin user...');

  // Create admin user
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: 'admin@example.com',
    password: 'admin123456',
    options: {
      data: {
        username: 'Admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        role: 'admin'
      }
    }
  });

  if (signUpError) {
    console.error('Error creating admin user:', signUpError);
    return;
  }

  console.log('Admin user created successfully!');
  console.log('Email:', 'admin@example.com');
  console.log('Password:', 'admin123456');
}

createAdminUser().catch(console.error);