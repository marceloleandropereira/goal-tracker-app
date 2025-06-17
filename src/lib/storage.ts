import { AppState, Goal, Action, CATEGORIES, CategoryId } from '@/types';

// Funções para gerenciar o Local Storage
const STORAGE_KEY = 'goal-tracker-data';

export const loadAppState = (): AppState => {
  if (typeof window === 'undefined') {
    return {
      categories: CATEGORIES,
      goals: [],
      actions: []
    };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        categories: CATEGORIES,
        goals: parsed.goals?.map((goal: Goal) => ({
          ...goal,
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt)
        })) || [],
        actions: parsed.actions?.map((action: Action) => ({
          ...action,
          createdAt: new Date(action.createdAt),
          updatedAt: new Date(action.updatedAt)
        })) || []
      };
    }
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
  }

  return {
    categories: CATEGORIES,
    goals: [],
    actions: []
  };
};

export const saveAppState = (state: AppState): void => {
  if (typeof window === 'undefined') return;

  try {
    const toSave = {
      goals: state.goals,
      actions: state.actions
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
  }
};

// Funções utilitárias para manipulação de dados
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createGoal = (categoryId: CategoryId, title: string): Goal => {
  const now = new Date();
  return {
    id: generateId(),
    categoryId,
    title,
    createdAt: now,
    updatedAt: now
  };
};

export const createAction = (goalId: string, description: string): Action => {
  const now = new Date();
  return {
    id: generateId(),
    goalId,
    description,
    count: 1,
    isElected: false,
    type: 'other',
    nextActions: [],
    system: null,
    isCutting: false,
    createdAt: now,
    updatedAt: now
  };
};

// Função para agrupar ações similares
export const groupSimilarActions = (actions: Action[]): Action[] => {
  const grouped = new Map<string, Action>();

  actions.forEach(action => {
    const key = action.description.toLowerCase().trim();
    if (grouped.has(key)) {
      const existing = grouped.get(key)!;
      existing.count += 1;
    } else {
      grouped.set(key, { ...action });
    }
  });

  return Array.from(grouped.values()).sort((a, b) => b.count - a.count);
};

