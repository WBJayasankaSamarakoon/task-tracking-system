import { Component, signal, computed, effect, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskItem, CreateTaskRequest, UpdateTaskRequest } from './models/task.model';
import { Project, CreateProjectRequest } from './models/project.model';
import { User, UserRole, USER_ROLES, RegisterRequest, LoginRequest } from './models/user.model';
import { TaskService } from './services/task.service';
import { ProjectService } from './services/project.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  // Service Injections
  private platformId = inject(PLATFORM_ID);
  private taskService = inject(TaskService);
  private projectService = inject(ProjectService);
  public authService = inject(AuthService);

  // Theme State
  isDarkMode = signal<boolean>(false);

  // Authentication State
  isAuthModalOpen = signal<boolean>(false);
  authMode = signal<'register' | 'login'>('login');
  authError = signal<string>('');
  isSubmittingAuth = signal<boolean>(false);
  roleOptions: UserRole[] = USER_ROLES;

  registerForm: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    role: 'Developer'
  };
  confirmPassword = signal<string>('');

  loginForm: LoginRequest = {
    email: '',
    password: ''
  };

  // Dashboard Filters and Active View
  selectedTab = signal<'all' | 'in-progress' | 'completed' | 'backlog' | 'overdue'>('all');
  selectedProjectId = signal<number | null>(null);
  selectedPriority = signal<string>('all');
  searchQuery = signal<string>('');
  activeView = signal<'list' | 'board'>('board');

  // Modal Visibility Signals
  isCreateModalOpen = signal<boolean>(false);
  isCreateProjectModalOpen = signal<boolean>(false);

  // Data Signals
  tasks = signal<TaskItem[]>([]);
  projects = signal<Project[]>([]);
  teamUsers = signal<User[]>([]);
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
    assignedToUserId?: number | null;
    assignedToName?: string;
    assignedToRole?: string;
  } = {
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    projectId: null,
    assignedToUserId: null,
    assignedToName: '',
    assignedToRole: ''
  };

  newProject: CreateProjectRequest = {
    name: '',
    description: '',
    colorHex: '#5e6ad2'
  };

  constructor() {
    // Synchronize Dark Theme class with Document root in browser
    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        if (this.isDarkMode()) {
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
    // Always load dashboard data on initial render
    this.loadDashboardData();
  }

  // Auth Modal Handlers
  openAuthModal(mode: 'login' | 'register' = 'login') {
    this.authMode.set(mode);
    this.authError.set('');
    this.isAuthModalOpen.set(true);
  }

  closeAuthModal() {
    this.isAuthModalOpen.set(false);
    this.authError.set('');
  }

  switchAuth(mode: 'register' | 'login') {
    this.authMode.set(mode);
    this.authError.set('');
  }

  onRegister() {
    this.authError.set('');
    
    if (!this.registerForm.fullName.trim()) {
      this.authError.set('Please enter your full name.');
      return;
    }
    if (!this.registerForm.email.trim() || !this.registerForm.email.includes('@')) {
      this.authError.set('Please enter a valid email address.');
      return;
    }
    if (!this.registerForm.password || this.registerForm.password.length < 4) {
      this.authError.set('Password must be at least 4 characters.');
      return;
    }
    if (this.confirmPassword() && this.confirmPassword() !== this.registerForm.password) {
      this.authError.set('Passwords do not match.');
      return;
    }

    this.isSubmittingAuth.set(true);
    this.authService.register(this.registerForm).subscribe({
      next: () => {
        this.isSubmittingAuth.set(false);
        this.closeAuthModal();
        this.loadDashboardData();
      },
      error: (err) => {
        this.isSubmittingAuth.set(false);
        this.authError.set(err.error?.message || 'Registration failed. Please check backend connection.');
      }
    });
  }

  onLogin() {
    this.authError.set('');
    
    if (!this.loginForm.email.trim()) {
      this.authError.set('Please enter your email.');
      return;
    }
    if (!this.loginForm.password) {
      this.authError.set('Please enter your password.');
      return;
    }

    this.isSubmittingAuth.set(true);
    this.authService.login(this.loginForm).subscribe({
      next: () => {
        this.isSubmittingAuth.set(false);
        this.closeAuthModal();
        this.loadDashboardData();
      },
      error: (err) => {
        this.isSubmittingAuth.set(false);
        this.authError.set(err.error?.message || 'Invalid email or password.');
      }
    });
  }

  onLogout() {
    this.authService.logout();
    this.loadDashboardData();
  }

  // Dashboard Data Loading
  loadDashboardData() {
    this.loadProjects();
    this.loadTasks();
    this.loadUsers();
  }

  loadData() {
    this.loadDashboardData();
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
        console.error('Task API Error:', err);
        this.errorMessage.set('Could not connect to Backend API. Please ensure your .NET Web API is running.');
        this.isLoading.set(false);
      }
    });
  }

  loadUsers() {
    this.authService.getUsers().subscribe({
      next: (data) => this.teamUsers.set(data),
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  // UI Filter Helpers
  toggleTheme() {
    this.isDarkMode.update((dark) => !dark);
  }

  selectProjectFilter(projectId: number | null) {
    this.selectedProjectId.set(this.selectedProjectId() === projectId ? null : projectId);
  }

  // Computed Reactive Properties
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

      // Search query filter
      const q = this.searchQuery().toLowerCase().trim();
      const matchesSearch =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q)) ||
        (task.projectName && task.projectName.toLowerCase().includes(q)) ||
        (task.assignedToName && task.assignedToName.toLowerCase().includes(q));

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

  // Task Modal Handlers
  openCreateModal() {
    this.modalError.set('');
    const user = this.authService.currentUser();
    this.newTask = {
      title: '',
      description: '',
      status: 'Pending',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      projectId: this.selectedProjectId() || (this.projects().length > 0 ? this.projects()[0].id : null),
      assignedToUserId: user ? user.id : null,
      assignedToName: user ? user.fullName : '',
      assignedToRole: user ? user.role : ''
    };
    this.isCreateModalOpen.set(true);
  }

  closeCreateModal() {
    this.isCreateModalOpen.set(false);
    this.modalError.set('');
  }

  openTaskModal() {
    this.openCreateModal();
  }

  closeTaskModal() {
    this.closeCreateModal();
  }

  onAssigneeSelect(userIdVal: any) {
    if (!userIdVal || userIdVal === 'null' || userIdVal === null) {
      this.newTask.assignedToUserId = null;
      this.newTask.assignedToName = '';
      this.newTask.assignedToRole = '';
      return;
    }
    const id = Number(userIdVal);
    const current = this.authService.currentUser();
    if (current && current.id === id) {
      this.newTask.assignedToUserId = current.id;
      this.newTask.assignedToName = current.fullName;
      this.newTask.assignedToRole = current.role;
      return;
    }
    const u = this.teamUsers().find((x) => x.id === id);
    if (u) {
      this.newTask.assignedToUserId = u.id;
      this.newTask.assignedToName = u.fullName;
      this.newTask.assignedToRole = u.role;
    }
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
      projectId: this.newTask.projectId ? Number(this.newTask.projectId) : undefined,
      assignedToUserId: this.newTask.assignedToUserId ? Number(this.newTask.assignedToUserId) : undefined,
      assignedToName: this.newTask.assignedToName || undefined,
      assignedToRole: this.newTask.assignedToRole || undefined
    };

    this.taskService.createTask(payload).subscribe({
      next: (created) => {
        const item: TaskItem = {
          ...created,
          assignedToName: created.assignedToName || this.newTask.assignedToName,
          assignedToRole: created.assignedToRole || this.newTask.assignedToRole
        };
        this.tasks.update((prev) => [item, ...prev]);
        this.isSaving.set(false);
        this.closeCreateModal();
        this.loadProjects();
      },
      error: (err) => {
        console.error('Create Task Error:', err);
        this.isSaving.set(false);
        this.modalError.set(
          err.error?.message || err.message || 'Failed to save issue. Please check backend connection.'
        );
      }
    });
  }

  moveTaskStatus(task: TaskItem, newStatus: TaskItem['status']) {
    if (!task.id || task.status === newStatus) return;

    const updatePayload: UpdateTaskRequest = {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      assignedToUserId: task.assignedToUserId,
      assignedToName: task.assignedToName,
      assignedToRole: task.assignedToRole
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
      error: (err) => console.error('Move Task Status Error:', err)
    });
  }

  toggleTaskStatus(task: TaskItem) {
    if (!task.id) return;

    const nextStatusMap: Record<TaskItem['status'], TaskItem['status']> = {
      Pending: 'In Progress',
      'In Progress': 'Completed',
      Completed: 'Pending'
    };

    this.moveTaskStatus(task, nextStatusMap[task.status]);
  }

  deleteTask(idOrTask?: number | TaskItem) {
    if (!idOrTask) return;
    
    const task = typeof idOrTask === 'number' 
      ? this.tasks().find((t) => t.id === idOrTask)
      : idOrTask;

    if (!task || !task.id) return;
    if (!confirm(`Are you sure you want to delete issue TASK-${task.id}?`)) return;

    const id = task.id;
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update((prev) => prev.filter((t) => t.id !== id));
        this.loadProjects();
      },
      error: (err) => console.error('Delete Task Error:', err)
    });
  }

  // Project Modal Handlers
  openCreateProjectModal() {
    this.projectModalError.set('');
    this.newProject = { name: '', description: '', colorHex: '#5e6ad2' };
    this.isCreateProjectModalOpen.set(true);
  }

  closeCreateProjectModal() {
    this.isCreateProjectModalOpen.set(false);
    this.projectModalError.set('');
  }

  openProjectModal() {
    this.openCreateProjectModal();
  }

  closeProjectModal() {
    this.closeCreateProjectModal();
  }

  saveProject() {
    if (!this.newProject.name.trim()) {
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

  deleteProject(projectId?: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (!projectId) return;
    if (!confirm('Are you sure you want to delete this project?')) return;

    this.projectService.deleteProject(projectId).subscribe({
      next: () => {
        if (this.selectedProjectId() === projectId) {
          this.selectedProjectId.set(null);
        }
        this.loadProjects();
        this.loadTasks();
      },
      error: (err) => {
        console.error('Delete Project Error:', err);
        alert(err.error?.message || 'Failed to delete project.');
      }
    });
  }

  // Style and Display Helpers
  getRoleBadgeClass(role?: string): string {
    switch (role) {
      case 'Project Manager':
        return 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/40';
      case 'QA Engineer':
        return 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40';
      case 'Admin':
        return 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/40';
      default:
        return 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/40';
    }
  }

  getUserInitials(name?: string): string {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
