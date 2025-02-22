import React from 'react';
import { Badge } from './ui/badge';

interface ReputationBadgeProps {
  points: number;
  level: string;
}

const levelColors = {
  'Legend': 'bg-purple-500 text-white',
  'Master': 'bg-red-500 text-white',
  'Expert': 'bg-yellow-500 text-black',
  'Advanced': 'bg-blue-500 text-white',
  'Intermediate': 'bg-green-500 text-white',
  'Beginner': 'bg-gray-500 text-white',
  'Newcomer': 'bg-gray-300 text-gray-700'
};

export function ReputationBadge({ points, level }: ReputationBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge className={levelColors[level] || levelColors['Newcomer']}>
        {level}
      </Badge>
      <span className="text-sm text-muted-foreground">
        {points.toLocaleString()} rep
      </span>
    </div>
  );
}