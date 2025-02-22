import React, { useState } from 'react';
import { Button } from './ui/button';
import { ThumbsUp, ThumbsDown, Heart, Star, Coffee } from 'lucide-react';

interface Reaction {
  id: string;
  icon: React.ReactNode;
  label: string;
  count: number;
}

interface PostReactionsProps {
  postId: string;
  initialReactions?: Reaction[];
}

export function PostReactions({ postId, initialReactions = [] }: PostReactionsProps) {
  const [reactions, setReactions] = useState<Reaction[]>(initialReactions.length ? initialReactions : [
    { id: 'like', icon: <ThumbsUp className="w-4 h-4" />, label: 'Like', count: 0 },
    { id: 'dislike', icon: <ThumbsDown className="w-4 h-4" />, label: 'Dislike', count: 0 },
    { id: 'heart', icon: <Heart className="w-4 h-4" />, label: 'Love', count: 0 },
    { id: 'star', icon: <Star className="w-4 h-4" />, label: 'Star', count: 0 },
    { id: 'coffee', icon: <Coffee className="w-4 h-4" />, label: 'Coffee', count: 0 },
  ]);

  const handleReaction = (reactionId: string) => {
    setReactions(prev => 
      prev.map(reaction => 
        reaction.id === reactionId 
          ? { ...reaction, count: reaction.count + 1 }
          : reaction
      )
    );
  };

  return (
    <div className="flex flex-wrap gap-2">
      {reactions.map(reaction => (
        <Button
          key={reaction.id}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleReaction(reaction.id)}
        >
          {reaction.icon}
          <span>{reaction.count}</span>
        </Button>
      ))}
    </div>
  );
}