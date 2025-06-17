'use client';

import { useEffect, useState } from 'react';
import { AppState, Goal, Action } from '@/types';
import { loadAppState, saveAppState } from '@/lib/storage';
import { CategoryCard } from '@/components/CategoryCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [appState, setAppState] = useState<AppState>({
    categories: [],
    goals: [],
    actions: []
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const state = loadAppState();
    setAppState(state);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveAppState(appState);
    }
  }, [appState, isLoaded]);

  const handleAddGoal = (goal: Goal) => {
    setAppState(prev => ({
      ...prev,
      goals: [...prev.goals, goal]
    }));
  };

  const handleAddAction = (action: Action) => {
    setAppState(prev => ({
      ...prev,
      actions: [...prev.actions, action]
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Como Conseguir Tudo o Que Você Quer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comece respondendo à pergunta fundamental: <strong>&quot;O que eu quero?&quot;</strong>
          </p>
          <p className="text-lg text-gray-500 mt-2">
            Organize suas metas em categorias e descubra como alcançá-las.
          </p>
        </div>

        {/* Navegação */}
        {appState.actions.length > 0 && (
          <div className="text-center mb-8">
            <Link href="/actions">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Ver Ações Agrupadas →
              </Button>
            </Link>
          </div>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-blue-600">{appState.goals.length}</div>
            <div className="text-gray-600">Metas Criadas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-green-600">{appState.actions.length}</div>
            <div className="text-gray-600">Ações Definidas</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="text-3xl font-bold text-purple-600">
              {appState.categories.filter(cat => 
                appState.goals.some(goal => goal.categoryId === cat.id)
              ).length}
            </div>
            <div className="text-gray-600">Categorias Ativas</div>
          </div>
        </div>

        {/* Grid de Categorias */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appState.categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              goals={appState.goals}
              actions={appState.actions}
              onAddGoal={handleAddGoal}
              onAddAction={handleAddAction}
            />
          ))}
        </div>

        {/* Próximos Passos */}
        {appState.goals.length > 0 && (
          <div className="mt-12 bg-white p-8 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Próximos Passos
            </h2>
            {appState.actions.length === 0 ? (
              <div>
                <p className="text-gray-600 mb-4">
                  Agora que você definiu suas metas, é hora de descobrir como alcançá-las.
                  Para cada meta, responda: <strong>&quot;Como eu consigo isso?&quot;</strong>
                </p>
                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Dica:</strong> Seja específico nas suas ações. Quanto mais detalhado, 
                    melhor será o plano para alcançar seus objetivos.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-600 mb-4">
                  Ótimo! Você já tem {appState.actions.length} ações definidas. 
                  Agora você pode agrupar ações similares e eleger as mais importantes.
                </p>
                <div className="flex gap-4">
                  <Link href="/actions">
                    <Button>Ver Ações Agrupadas</Button>
                  </Link>
                </div>
                <div className="bg-green-50 p-4 rounded-md mt-4">
                  <p className="text-green-800 text-sm">
                    🎯 <strong>Próximo passo:</strong> Visite a página de ações para agrupar ações similares, 
                    eleger as mais importantes e criar projetos estruturados.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

