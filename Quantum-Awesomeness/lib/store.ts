import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Project {
  id: string;
  name: string;
  code: string;
  framework: string;
  createdAt: string;
  deployedUrls: Record<string, string>;
}

interface AppState {
  projects: Project[];
  currentProject: Project | null;
  deployments: any[];
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setCurrentProject: (project: Project | null) => void;
  addDeployment: (deployment: any) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      deployments: [],

      addProject: (project) => set((state) => ({
        projects: [project, ...state.projects]
      })),

      updateProject: (id, updates) => set((state) => ({
        projects: state.projects.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ),
        currentProject: state.currentProject?.id === id 
          ? { ...state.currentProject, ...updates } 
          : state.currentProject
      })),

      setCurrentProject: (project) => set({ currentProject: project }),

      addDeployment: (deployment) => set((state) => ({
        deployments: [deployment, ...state.deployments]
      }))
    }),
    {
      name: 'appforge-storage',
      version: 1
    }
  )
);
