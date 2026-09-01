export interface TaskItem {
  id?: number;
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  createdAt?: string;
  isOverdue?: boolean;
  projectId?: number;
  projectName?: string;
  projectColor?: string;
  projectTag?: string;
  assignedToUserId?: number | null;
  assignedToName?: string;
  assignedToRole?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId?: number;
  assignedToUserId?: number | null;
  assignedToName?: string;
  assignedToRole?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description?: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId?: number;
  assignedToUserId?: number | null;
  assignedToName?: string;
  assignedToRole?: string;
}
