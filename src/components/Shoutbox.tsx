import React, { useState } from 'react';
import { format } from 'date-fns';
import { mockForumService } from '../lib/supabase';
import { Button } from './ui/button';

export function Shoutbox() {
  const [message, setMessage] = useState('');
  const [shouts, setShouts] = useState(mockForumService.shouts);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (!message.trim()) return;

      const newShout = {
        id: Date.now().toString(),
        message: message.trim(),
        author: {
          username: 'Guest',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest'
        },
        created_at: new Date().toISOString()
      };

      setShouts([newShout, ...shouts].slice(0, 50)); // Keep last 50 shouts
      setMessage('');
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Shoutbox error:', err);
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Shoutbox</h2>
      </div>
      
      {/* Shouts Display */}
      <div className="h-48 overflow-y-auto p-4 space-y-2">
        {error && (
          <div className="bg-destructive/10 text-destructive p-2 rounded-md text-sm mb-2">
            {error}
          </div>
        )}
        {shouts.map(shout => (
          <div key={shout.id} className="flex items-start gap-2">
            <img
              src={shout.author.avatar_url}
              alt={shout.author.username}
              className="w-6 h-6 rounded"
              onError={(e) => {
                e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback';
              }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-medium text-primary">{shout.author.username}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(shout.created_at), 'HH:mm')}
                </span>
              </div>
              <p className="text-sm break-words">{shout.message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={200}
            placeholder="Type your message..."
            className="flex-1 rounded-md border shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
          />
          <Button type="submit">
            Send
          </Button>
        </div>
        <div className="mt-1 text-xs text-muted-foreground text-right">
          {message.length}/200 characters
        </div>
      </form>
    </div>
  );
}