export type Status = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export interface Complaint {
  id?: number;
  name: string;
  email: string;
  title: string;
  category: string;
  description: string;
  status?: Status;
  createdAt?: string;
}
