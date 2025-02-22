import React, { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function CreateTopic({ categoryId, onSuccess }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock creating a new topic
    const newTopic = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      categoryId,
      author: 'Current User',
      createdAt: new Date().toISOString()
    };

    console.log('New topic created:', newTopic);
    
    setTitle('');
    setContent('');
    setLoading(false);
    onSuccess();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Topic</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              required
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Topic'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}