'use client';

import { useEffect, useState } from 'react';
import { AppState, Action } from '@/types';
import { loadAppState, saveAppState } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function ProjectsPage() {
  const [appState, setAppState] = useState<AppState>({
    categories: [],
    goals: [],
    actions: []
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [addingNextActionFor, setAddingNextActionFor] = useState<string | null>(null);
  const [newNextAction, setNewNextAction] = useState('');

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

  const handleSetActionType = (actionId: string, type: 'project' | 'other') => {
    setAppState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { ...action, type }
          : action
      )
    }));
  };

  const handleAddNextAction = (actionId: string) => {
    if (newNextAction.trim()) {
      setAppState(prev => ({
        ...prev,
        actions: prev.actions.map(action =>
          action.id === actionId
            ? { ...action, nextActions: [...action.nextActions, newNextAction.trim()] }
            : action
        )
      }));
      setNewNextAction('');
      setAddingNextActionFor(null);
    }
  };

  const handleRemoveNextAction = (actionId: string, nextActionIndex: number) => {
    setAppState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { 
              ...action, 
              nextActions: action.nextActions.filter((_, index) => index !== nextActionIndex)
            }
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

  const electedActions = appState.actions.filter(action => action.isElected);

  if (electedActions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Projetos e Próximas Ações
            </h1>
            <p className="text-gray-600 mb-8">
              Você ainda não elegeu nenhuma ação. Volte para a página de ações e eleja algumas para criar projetos.
            </p>
            <Link href="/actions">
              <Button>Ver Ações Agrupadas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const projectActions = electedActions.filter(action => action.type === 'project');
  const otherActions = electedActions.filter(action => action.type === 'other');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Projetos e Próximas Ações
          </h1>
          <p className="text-gray-600 mb-6">
            Organize suas ações eleitas em projetos e defina próximas ações específicas.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/actions">
              <Button variant="outline">← Ações Agrupadas</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">← Voltar para Metas</Button>
            </Link>
            {(projectActions.length > 0 || otherActions.length > 0) && (
              <Link href="/systems">
                <Button>Definir Sistemas →</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{electedActions.length}</div>
            <div className="text-sm text-gray-600">Ações Eleitas</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{projectActions.length}</div>
            <div className="text-sm text-gray-600">Projetos</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">{otherActions.length}</div>
            <div className="text-sm text-gray-600">Outras Ações</div>
          </div>
        </div>

        {/* Ações Eleitas para Classificar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Classificar Ações Eleitas</CardTitle>
            <CardDescription>
              Defina quais ações são projetos (requerem múltiplas etapas) ou ações simples.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {electedActions.map(action => (
              <div key={action.id} className="p-4 border rounded-lg bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{action.description}</div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={action.type === 'project' ? 'default' : 'outline'}
                      onClick={() => handleSetActionType(action.id, 'project')}
                    >
                      Projeto
                    </Button>
                    <Button
                      size="sm"
                      variant={action.type === 'other' ? 'default' : 'outline'}
                      onClick={() => handleSetActionType(action.id, 'other')}
                    >
                      Ação Simples
                    </Button>
                  </div>
                </div>
                {action.count > 1 && (
                  <div className="text-sm text-gray-500">Aparece {action.count}x nas suas metas</div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Projetos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-700">Projetos</CardTitle>
              <CardDescription>
                Ações que requerem múltiplas etapas ({projectActions.length} projetos)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {projectActions.length > 0 ? (
                projectActions.map(action => (
                  <div key={action.id} className="p-4 border rounded-lg bg-green-50">
                    <div className="font-medium text-green-900 mb-2">{action.description}</div>
                    
                    {/* Próximas Ações */}
                    {action.nextActions.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm font-medium text-green-800 mb-1">Próximas ações:</div>
                        {action.nextActions.map((nextAction, index) => (
                          <div key={index} className="flex items-center justify-between bg-white p-2 rounded border mb-1">
                            <span className="text-sm">{nextAction}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveNextAction(action.id, index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Adicionar Próxima Ação */}
                    {addingNextActionFor === action.id ? (
                      <div className="space-y-2">
                        <Input
                          placeholder="Próxima ação específica..."
                          value={newNextAction}
                          onChange={(e) => setNewNextAction(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddNextAction(action.id)}
                          className="text-sm"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleAddNextAction(action.id)}>
                            Adicionar
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => {
                            setAddingNextActionFor(null);
                            setNewNextAction('');
                          }}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs"
                        onClick={() => setAddingNextActionFor(action.id)}
                      >
                        + Definir próxima ação
                      </Button>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum projeto definido ainda.</p>
                  <p className="text-sm mt-1">
                    Classifique algumas ações como "Projeto" acima.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outras Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-blue-700">Ações Simples</CardTitle>
              <CardDescription>
                Ações que podem ser executadas diretamente ({otherActions.length} ações)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {otherActions.length > 0 ? (
                otherActions.map(action => (
                  <div key={action.id} className="p-4 border rounded-lg bg-blue-50">
                    <div className="font-medium text-blue-900">{action.description}</div>
                    {action.count > 1 && (
                      <div className="text-sm text-blue-700">Aparece {action.count}x</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma ação simples definida ainda.</p>
                  <p className="text-sm mt-1">
                    Classifique algumas ações como "Ação Simples" acima.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Próximos Passos */}
        {(projectActions.length > 0 || otherActions.length > 0) && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Resumo da Organização
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-medium text-green-700 mb-2">Projetos ({projectActions.length})</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {projectActions.map(action => (
                    <li key={action.id}>• {action.description}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-blue-700 mb-2">Ações Simples ({otherActions.length})</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {otherActions.map(action => (
                    <li key={action.id}>• {action.description}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-4 mb-4">
              <Link href="/systems">
                <Button>Definir Sistemas</Button>
              </Link>
            </div>
            <div className="bg-purple-50 p-4 rounded-md">
              <p className="text-purple-800 text-sm">
                🎯 <strong>Próximo passo:</strong> Agora você pode definir sistemas de accountability 
                e identificar o que pode ser cortado para focar no essencial.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

