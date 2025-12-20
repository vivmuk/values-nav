
import React from 'react';
import { Domain } from './types';

export const PREDEFINED_VALUES: Record<Domain, string[]> = {
  [Domain.WORK_EDUCATION]: [
    'Service', 'Competence', 'Responsibility', 'Innovation', 
    'Leadership', 'Mastery', 'Work-Life Balance', 'Contribution',
    'Mentorship', 'Creativity', 'Focus', 'Professionalism'
  ],
  [Domain.RELATIONSHIPS]: [
    'Intimacy', 'Support', 'Honesty', 'Compassion', 
    'Loyalty', 'Boundaries', 'Vulnerability', 'Humor',
    'Active Listening', 'Patience', 'Trust', 'Reliability'
  ],
  [Domain.PERSONAL_GROWTH_HEALTH]: [
    'Vitality', 'Mindfulness', 'Persistence', 'Self-Awareness',
    'Fitness', 'Nutritional Health', 'Bravery', 'Knowledge',
    'Resilience', 'Spirituality', 'Authenticity', 'Self-Care'
  ],
  [Domain.LEISURE]: [
    'Creativity', 'Playfulness', 'Relaxation', 'Adventure',
    'Curiosity', 'Connection with Nature', 'Skill Development',
    'Spontaneity', 'Rest', 'Cultural Immersion', 'Aesthetics', 'Joy'
  ]
};

export const DOMAIN_METADATA = {
  [Domain.WORK_EDUCATION]: {
    color: '#002395', // French Blue
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Professional life, learning, and skill acquisition.'
  },
  [Domain.RELATIONSHIPS]: {
    color: '#ED2939', // French Red
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    description: 'Connections with family, friends, and community.'
  },
  [Domain.PERSONAL_GROWTH_HEALTH]: {
    color: '#1a1a1a',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    description: 'Mental and physical well-being, and soul searching.'
  },
  [Domain.LEISURE]: {
    color: '#6b7280',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    description: 'Recreation, artistic expression, and hobbies.'
  }
};
