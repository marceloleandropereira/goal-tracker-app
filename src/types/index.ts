// Tipos para as categorias de metas
export type CategoryId = 
  | 'personal-growth'
  | 'business-career-finance'
  | 'leadership-community'
  | 'health'
  | 'relationships'
  | 'fun-daily-experiences';

export interface Category {
  id: CategoryId;
  name: string;
  description?: string;
}

// Tipo para uma meta
export interface Goal {
  id: string;
  categoryId: CategoryId;
  title: string; // Resposta para "What do I Want?"
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para ações
export type ActionType = 'common' | 'project' | 'other';
export type SystemType = 'environmental_changes' | 'systems_of_accountability' | null;

export interface Action {
  id: string;
  goalId: string;
  description: string; // Resposta para "How Do I Get It?"
  count: number; // Quantas vezes a ação apareceu
  isElected: boolean; // Se a ação foi eleita
  type: ActionType; // Tipo de ação
  nextActions: string[]; // Para ações do tipo 'project'
  system: SystemType; // Sistema associado
  systemDescription?: string; // Nova propriedade para a descrição do sistema
  isCutting: boolean; // Se a ação é para ser cortada
  createdAt: Date;
  updatedAt: Date;
}

// Interface para o estado global da aplicação
export interface AppState {
  categories: Category[];
  goals: Goal[];
  actions: Action[];
}

// Constantes para as categorias
export const CATEGORIES: Category[] = [
  {
    id: 'personal-growth',
    name: 'Personal Growth',
    description: 'Desenvolvimento pessoal e autoconhecimento'
  },
  {
    id: 'business-career-finance',
    name: 'Business, Career and Finance',
    description: 'Negócios, carreira e finanças'
  },
  {
    id: 'leadership-community',
    name: 'Leadership and Community',
    description: 'Liderança e comunidade'
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Saúde física e mental'
  },
  {
    id: 'relationships',
    name: 'Relationships',
    description: 'Relacionamentos pessoais e profissionais'
  },
  {
    id: 'fun-daily-experiences',
    name: 'Fun and Daily Experiences',
    description: 'Diversão e experiências do dia a dia'
  }
];


