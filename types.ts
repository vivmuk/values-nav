
export enum Domain {
  WORK_EDUCATION = 'Work & Education',
  RELATIONSHIPS = 'Relationships',
  PERSONAL_GROWTH_HEALTH = 'Personal Growth & Health',
  LEISURE = 'Leisure'
}

export interface ValuePoint {
  id: string;
  label: string;
  domain: Domain;
  score: number; // 0 to 10 (stored as integer)
  layer?: number; // 1 to 5 (1 = center, 5 = edge)
}

export interface Entry {
  id: string;
  timestamp: number;
  valuePoints: ValuePoint[];
}

export interface HistoryPoint {
  date: string;
  [Domain.WORK_EDUCATION]: number;
  [Domain.RELATIONSHIPS]: number;
  [Domain.PERSONAL_GROWTH_HEALTH]: number;
  [Domain.LEISURE]: number;
}
