
export enum UserRole {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface Project {
  id?: string;
  student_username: string;
  title: string;
  description: string;
  status: 'draft' | 'submitted';
  created_at?: string;
}

export interface User {
  username: string;
  password?: string;
  role: UserRole;
  advisorUsername?: string;
  chatHistory?: ChatMessage[];
  messagesFromStudents?: { from: string; text: string; timestamp: number }[];
}

export interface AppState {
  users: User[];
  currentUser: User | null;
}
