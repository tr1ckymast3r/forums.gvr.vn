import React from 'react';
import { Badge } from './ui/badge';

type BadgeType = 'admin' | 'moderator' | 'member' | 'new';

interface UserBadgeProps {
  type: BadgeType;
}

const badgeStyles = {
  admin: 'bg-red-500 hover:bg-red-600',
  moderator: 'bg-purple-500 hover:bg-purple-600',
  member: 'bg-blue-500 hover:bg-blue-600',
  new: 'bg-green-500 hover:bg-green-600'
};

export function UserBadge({ type }: UserBadgeProps) {
  return (
    <Badge className={badgeStyles[type]}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </Badge>
  );
}