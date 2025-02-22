// Mock data service with error handling
const mockData = {
  categories: [
    {
      id: '1',
      name: 'General Discussion',
      description: 'General discussions about any topic',
      icon: '💬'
    },
    {
      id: '2', 
      name: 'Technical Support',
      description: 'Get help with technical issues',
      icon: '🔧'
    },
    {
      id: '3',
      name: 'News & Announcements', 
      description: 'Latest updates and announcements',
      icon: '📢'
    }
  ],
  topics: [
    {
      id: '1',
      title: 'Welcome to our community!',
      category_id: '1',
      author: {
        username: 'Admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      },
      created_at: '2024-02-20T10:00:00Z',
      posts: [
        {
          id: '1',
          content: 'Welcome everyone to our community!',
          author: {
            username: 'Admin',
            avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
          },
          created_at: '2024-02-20T10:00:00Z'
        }
      ]
    }
  ],
  shouts: [
    {
      id: '1',
      message: 'Hello everyone! 👋',
      author: {
        username: 'Admin',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
      },
      created_at: '2024-02-21T15:30:00Z'
    },
    {
      id: '2',
      message: 'Welcome to our forums! 🎉',
      author: {
        username: 'Moderator',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Moderator'
      },
      created_at: '2024-02-21T15:35:00Z'
    }
  ]
};

export const mockForumService = {
  ...mockData,
  getCategories: () => {
    try {
      return Promise.resolve(mockData.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return Promise.reject(new Error('Failed to fetch categories'));
    }
  },
  getTopics: (categoryId: string) => {
    try {
      const topics = mockData.topics.filter(t => t.category_id === categoryId);
      return Promise.resolve(topics);
    } catch (error) {
      console.error('Error fetching topics:', error);
      return Promise.reject(new Error('Failed to fetch topics'));
    }
  }
};