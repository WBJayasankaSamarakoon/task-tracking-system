import { Component, signal, computed, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItem, CreateTaskRequest } from './models/task.model';
import { Project, CreateProjectRequest } from './models/project.model';
import { TaskService } from './services/task.service';
import { ProjectService } from './services/project.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);

  isDarkMode = signal<boolean>(false);

  // Filters & State
  selectedTab = signal<'all' | 'in-progress' | 'completed' | 'backlog' | 'overdue'>('all');
  selectedProjectId = signal<number | null>(null);
  selectedPriority = signal<string>('all');
  searchQuery = signal<string>('');
  activeView = signal<'list' | 'board'>('list');

  // Modals State
  isCreateModalOpen = signal<boolean>(false);
  isCreateProjectModalOpen = signal<boolean>(false);

  // Data Signals
  tasks = signal<TaskItem[]>([]);
  projects = signal<Project[]>([]);
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');
  modalError = signal<string>('');
  projectModalError = signal<string>('');

  // Form Models
  newTask: {
    title: string;
    description: string;
    status: 'Pending' | 'In Progress' | 'Completed';
    priority: 'Low' | 'Medium' | 'High';
    dueDate: string;
    projectId?: number | null;
  } = {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    projectId: null
  };

  newProject: CreateProjectRequest = {
    name: '',
    description: '',
    colorHex: '#5e6ad2'
  };

  constructor() {
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const isDark = this.isDarkMode();
        if (isDark) {
          document.documentElement.classList.add('dark');
          document.body.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.body.classList.remove('dark');
        }
      }
    });
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loadProjects();
    this.loadTasks();
  }

  loadProjects() {
    this.projectService.getProjects().subscribe({
      next: (data) => this.projects.set(data),
      error: (err) => console.error('Error fetching projects:', err)
    });
  }

  loadTasks() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasks.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('API Error:', err);
        this.errorMessage.set('Could not connect to Backend API. Please ensure your .NET Web API is running.');
        this.isLoading.set(false);
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update((dark) => !dark);
  }

  selectProjectFilter(projectId: number | null) {
    this.selectedProjectId.set(this.selectedProjectId() === projectId ? null : projectId);
  }

  filteredTasks = computed(() => {
    return this.tasks().filter((task) => {
      // Tab filter
      const matchesTab =
        this.selectedTab() === 'all'
          ? true
          : this.selectedTab() === 'in-progress'
          ? task.status === 'In Progress'
          : this.selectedTab() === 'completed'
          ? task.status === 'Completed'
          : this.selectedTab() === 'overdue'
          ? task.isOverdue === true
          : task.status === 'Pending';

      // Project filter
      const matchesProject =
        this.selectedProjectId() === null || task.projectId === this.selectedProjectId();

      // Priority filter
      const matchesPriority =
        this.selectedPriority() === 'all' || task.priority.toLowerCase() === this.selectedPriority().toLowerCase();

      // Search filter
      const q = this.searchQuery().toLowerCase();
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q)) ||
        (task.projectName && task.projectName.toLowerCase().includes(q));

      return matchesTab && matchesProject && matchesPriority && matchesSearch;
    });
  });

  totalCount = computed(() => this.tasks().length);
  inProgressCount = computed(() => this.tasks().filter((t) => t.status === 'In Progress').length);
  completedCount = computed(() => this.tasks().filter((t) => t.status === 'Completed').length);
  pendingCount = computed(() => this.tasks().filter((t) => t.status === 'Pending').length);
  overdueCount = computed(() => this.tasks().filter((t) => t.isOverdue).length);

  progressPercentage = computed(() => {
    if (this.totalCount() === 0) return 0;
    return Math.round((this.completedCount() / this.totalCount()) * 100);
  });

  // Task Modal Actions
  openCreateModal() {
    this.modalError.set('');
    this.newTask = {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      projectId: this.selectedProjectId() || (this.projects().length > 0 ? this.projects()[0].id : null)
    };
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
    this.modalError.set('');
  }

  saveTask() {
    if (!this.newTask.title || !this.newTask.title.trim()) {
      this.modalError.set('Issue Title is required.');
      return;
    }

    this.isSaving.set(true);
    this.modalError.set('');

    const payload: CreateTaskRequest = {
      title: this.newTask.title.trim(),
      description: this.newTask.description?.trim() ? this.newTask.description.trim() : undefined,
      status: this.newTask.status || 'Pending',
      priority: this.newTask.priority || 'Medium',
      dueDate: this.newTask.dueDate ? new Date(this.newTask.dueDate).toISOString() : undefined,
      projectId: this.newTask.projectId ? Number(this.newTask.projectId) : undefined
    };

    this.taskService.createTask(payload).subscribe({
      next: (created) => {
        this.tasks.update((prev) => [created, ...prev]);
        this.isSaving.set(false);
        this.closeCreateModal();
        this.loadProjects(); // Refresh project task counts
      },
      error: (err) => {
        console.error('Create Task Error:', err);
        this.isSaving.set(false);
        this.modalError.set(
          err.error?.message || err.message || 'Failed to save issue. Please check your backend connection.'
        );
      }
    });
  }

  toggleTaskStatus(task: TaskItem) {
    if (!task.id) return;

    const nextStatus: Record<TaskItem['status'], TaskItem['status']> = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Pending'
    };

    const newStatus = nextStatus[task.status];
    const updatePayload = {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId
    };

    this.taskService.updateTask(task.id, updatePayload).subscribe({
      next: () => {
        this.tasks.update((prev) =>
          prev.map((t) =>
            t.id === task.id
              ? { ...t, status: newStatus, isOverdue: newStatus === 'Completed' ? false : t.isOverdue }
              : t
          )
        );
      },
      error: (err) => console.error('Update Task Error:', err)
    });
  }

  deleteTask(id?: number) {
    if (!id) return;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update((prev) => prev.filter((t) => t.id !== id));
        this.loadProjects();
      },
      error: (err) => console.error('Delete Task Error:', err)
    });
  }

  // Project Modal Actions
  openCreateProjectModal() {
    this.projectModalError.set('');
    this.newProject = {
      name: '',
      description: '',
      colorHex: '#5e6ad2'
    };
    this.isCreateProjectModalOpen.set(true);
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen.set(false);
    this.projectModalError.set('');
  }

  saveProject() {
    if (!this.newProject.name || !this.newProject.name.trim()) {
      this.projectModalError.set('Project Name is required.');
      return;
    }

    this.projectService.createProject(this.newProject).subscribe({
      next: (created) => {
        this.projects.update((prev) => [...prev, created]);
        this.closeCreateProjectModal();
      },
      error: (err) => {
        console.error('Create Project Error:', err);
        this.projectModalError.set(err.error?.message || 'Failed to create project.');
      }
    });
  }
}
