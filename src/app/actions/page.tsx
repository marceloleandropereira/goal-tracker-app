'use client';

import { useEffect, useState } from 'react';
import { AppState, Action } from '@/types';
import { loadAppState, saveAppState, groupSimilarActions } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ActionsPage() {
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

  const handleElectAction = (actionId: string) => {
    setAppState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { ...action, isElected: !action.isElected }
          : action
      )
    }));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (appState.actions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Ações Comuns
            </h1>
            <p className="text-gray-600 mb-8">
              Você ainda não criou nenhuma ação. Volte para a página inicial e adicione algumas ações às suas metas.
            </p>
            <Link href="/">
              <Button>Voltar para Metas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const groupedActions = groupSimilarActions(appState.actions);
  const commonActions = groupedActions.filter(action => action.count > 1);
  const otherActions = groupedActions.filter(action => action.count === 1);
  const electedActions = groupedActions.filter(action => action.isElected);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ações Agrupadas
          </h1>
          <p className="text-gray-600 mb-6">
            Aqui estão suas ações agrupadas por similaridade. Eleja as mais importantes para criar projetos.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">← Voltar para Metas</Button>
            </Link>
            {electedActions.length > 0 && (
              <Link href="/projects">
                <Button>Organizar em Projetos →</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{appState.actions.length}</div>
            <div className="text-sm text-gray-600">Total de Ações</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{commonActions.length}</div>
            <div className="text-sm text-gray-600">Ações Comuns</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">{otherActions.length}</div>
            <div className="text-sm text-gray-600">Outras Ações</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-orange-600">{electedActions.length}</div>
            <div className="text-sm text-gray-600">Ações Eleitas</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ações Comuns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-700">Ações Comuns</CardTitle>
              <CardDescription>
                Ações que aparecem em múltiplas metas ({commonActions.length} ações)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {commonActions.length > 0 ? (
                commonActions.map(action => (
                  <div
                    key={action.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      action.isElected
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {action.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          Aparece {action.count}x nas suas metas
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={action.isElected ? "default" : "outline"}
                        onClick={() => handleElectAction(action.id)}
                      >
                        {action.isElected ? "Eleita ✓" : "Eleger"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma ação comum encontrada.</p>
                  <p className="text-sm mt-1">
                    Adicione mais ações às suas metas para ver padrões.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outras Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">Outras Ações</CardTitle>
              <CardDescription>
                Ações únicas ou específicas ({otherActions.length} ações)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {otherActions.length > 0 ? (
                otherActions.map(action => (
                  <div
                    key={action.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      action.isElected
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 mb-1">
                          {action.description}
                        </div>
                        <div className="text-sm text-gray-500">
                          Ação específica
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={action.isElected ? "default" : "outline"}
                        onClick={() => handleElectAction(action.id)}
                      >
                        {action.isElected ? "Eleita ✓" : "Eleger"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Todas as suas ações são comuns!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Ações Eleitas */}
        {electedActions.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ações Eleitas ({electedActions.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {electedActions.map(action => (
                <div key={action.id} className="p-3 bg-orange-50 rounded-md border border-orange-200">
                  <div className="font-medium text-orange-900">{action.description}</div>
                  {action.count > 1 && (
                    <div className="text-sm text-orange-700">Aparece {action.count}x</div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-4 mb-4">
              <Link href="/projects">
                <Button>Organizar em Projetos</Button>
              </Link>
            </div>
            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-blue-800 text-sm">
                🎯 <strong>Próximo passo:</strong> Agora você pode organizar essas ações eleitas em projetos 
                e definir próximas ações específicas para cada uma.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

