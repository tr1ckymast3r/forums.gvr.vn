import { createClient } from '@supabase/supabase-js';

// Fallback to empty string if env vars are not defined
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function seedData() {
  console.log('Seeding database...');

  // Insert categories
  const { data: categories, error: categoriesError } = await supabase
    .from('categories')
    .insert([
      {
        name: 'General Discussion',
        description: 'General discussions about any topic',
        icon: '💬'
      },
      {
        name: 'Technical Support',
        description: 'Get help with technical issues',
        icon: '🔧'
      },
      {
        name: 'News & Announcements',
        description: 'Latest updates and announcements',
        icon: '📢'
      }
    ])
    .select();

  if (categoriesError) {
    console.error('Error inserting categories:', categoriesError);
    return;
  }

  console.log('Categories created:', categories);

  // Create a test user
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email: 'test@example.com',
    password: 'test123456',
    options: {
      data: {
        username: 'TestUser',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TestUser'
      }
    }
  });

  if (signUpError) {
    console.error('Error creating test user:', signUpError);
    return;
  }

  // Wait for the trigger to create the profile
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Insert topics
  for (const category of categories) {
    const { error: topicsError } = await supabase
      .from('topics')
      .insert([
        {
          title: `Welcome to ${category.name}!`,
          category_id: category.id,
          author_id: user.id
        },
        {
          title: `Guidelines for ${category.name}`,
          category_id: category.id,
          author_id: user.id
        }
      ]);

    if (topicsError) {
      console.error('Error inserting topics:', topicsError);
      return;
    }
  }

  // Get all topics to add posts
  const { data: topics, error: topicsQueryError } = await supabase
    .from('topics')
    .select('*');

  if (topicsQueryError) {
    console.error('Error fetching topics:', topicsQueryError);
    return;
  }

  // Insert posts
  for (const topic of topics) {
    const { error: postsError } = await supabase
      .from('posts')
      .insert([
        {
          content: `Welcome to this topic about ${topic.title}! Let's have a great discussion.`,
          topic_id: topic.id,
          author_id: user.id
        },
        {
          content: 'Thanks for starting this topic. Looking forward to the discussions!',
          topic_id: topic.id,
          author_id: user.id
        }
      ]);

    if (postsError) {
      console.error('Error inserting posts:', postsError);
      return;
    }
  }

  console.log('Database seeded successfully!');
}

seedData().catch(console.error);