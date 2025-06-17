'use client';

import { useEffect, useState } from 'react';
import { AppState } from '@/types';
import { loadAppState, saveAppState } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SystemsPage() {
  const [appState, setAppState] = useState<AppState>({
    categories: [],
    goals: [],
    actions: []
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [systemDescriptionInput, setSystemDescriptionInput] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const state = loadAppState();
    setAppState(state);
    setIsLoaded(true);

    // Initialize systemDescriptionInput from loaded state
    const initialDescriptions: { [key: string]: string } = {};
    state.actions.forEach(action => {
      if (action.systemDescription) {
        initialDescriptions[action.id] = action.systemDescription;
      }
    });
    setSystemDescriptionInput(initialDescriptions);

  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveAppState(appState);
    }
  }, [appState, isLoaded]);

  const handleSetSystem = (actionId: string, system: 'environmental_changes' | 'systems_of_accountability' | null) => {
    setAppState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { ...action, system, systemDescription: system === null ? undefined : (systemDescriptionInput[action.id] || '') }
          : action
      )
    }));
  };

  const handleSystemDescriptionChange = (actionId: string, value: string) => {
    setSystemDescriptionInput(prev => ({
      ...prev,
      [actionId]: value
    }));
    setAppState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { ...action, systemDescription: value }
          : action
      )
    }));
  };

  const handleToggleCutting = (actionId: string) => {
    setAppState(prev => ({
      ...prev,
      actions: prev.actions.map(action =>
        action.id === actionId
          ? { ...action, isCutting: !action.isCutting }
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
              Sistemas e Cutting
            </h1>
            <p className="text-gray-600 mb-8">
              Você ainda não elegeu nenhuma ação. Volte para a página de ações e eleja algumas para definir sistemas.
            </p>
            <Link href="/actions">
              <Button>Ver Ações Agrupadas</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const environmentalActions = electedActions.filter(action => action.system === 'environmental_changes');
  const accountabilityActions = electedActions.filter(action => action.system === 'systems_of_accountability');
  // const noSystemActions = electedActions.filter(action => !action.system);
  const cuttingActions = electedActions.filter(action => action.isCutting);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sistemas e Cutting
          </h1>
          <p className="text-gray-600 mb-6">
            Defina sistemas para suas ações e identifique o que pode ser cortado.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/projects">
              <Button variant="outline">← Projetos</Button>
            </Link>
            <Link href="/actions">
              <Button variant="outline">← Ações Agrupadas</Button>
            </Link>
            <Link href="/">
              <Button variant="outline">← Voltar para Metas</Button>
            </Link>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-600">{electedActions.length}</div>
            <div className="text-sm text-gray-600">Ações Eleitas</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-green-600">{environmentalActions.length}</div>
            <div className="text-sm text-gray-600">Mudanças Ambientais</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-purple-600">{accountabilityActions.length}</div>
            <div className="text-sm text-gray-600">Sistemas de Accountability</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <div className="text-2xl font-bold text-red-600">{cuttingActions.length}</div>
            <div className="text-sm text-gray-600">Para Cortar</div>
          </div>
        </div>

        {/* Definir Sistemas */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Definir Sistemas para Ações</CardTitle>
            <CardDescription>
              Escolha o tipo de sistema que melhor suporta cada ação eleita.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {electedActions.map(action => (
              <div key={action.id} className={`p-4 border rounded-lg transition-all ${
                action.isCutting ? 'bg-red-50 border-red-200' : 'bg-white'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className={`font-medium mb-1 ${action.isCutting ? 'text-red-700 line-through' : 'text-gray-900'}`}>
                      {action.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {action.type === 'project' ? 'Projeto' : 'Ação Simples'}
                      {action.count > 1 && ` • Aparece ${action.count}x`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={action.isCutting ? "destructive" : "outline"}
                    onClick={() => handleToggleCutting(action.id)}
                  >
                    {action.isCutting ? "Cortado ✓" : "Cortar"}
                  </Button>
                </div>

                {!action.isCutting && (
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={action.system === 'environmental_changes' ? 'selected' : 'outline'}
                        onClick={() => handleSetSystem(action.id, 
                          action.system === 'environmental_changes' ? null : 'environmental_changes'
                        )}
                        className="text-xs bg-orange-500 hover:bg-orange-600 text-white border-orange-600"
                        style={{
                          backgroundColor: action.system === 'environmental_changes' ? '#ea580c' : '',
                          borderColor: action.system === 'environmental_changes' ? '#c2410c' : '',
                          color: action.system === 'environmental_changes' ? 'white' : '',
                          boxShadow: action.system === 'environmental_changes' ? '0 0 0 2px rgba(234, 88, 12, 0.3)' : ''
                        }}
                      >
                        Mudanças Ambientais
                      </Button>
                      <Button
                        size="sm"
                        variant={action.system === 'systems_of_accountability' ? 'selected' : 'outline'}
                        onClick={() => handleSetSystem(action.id, 
                          action.system === 'systems_of_accountability' ? null : 'systems_of_accountability'
                        )}
                        className="text-xs bg-green-500 hover:bg-green-600 text-white border-green-600"
                        style={{
                          backgroundColor: action.system === 'systems_of_accountability' ? '#16a34a' : '',
                          borderColor: action.system === 'systems_of_accountability' ? '#15803d' : '',
                          color: action.system === 'systems_of_accountability' ? 'white' : '',
                          boxShadow: action.system === 'systems_of_accountability' ? '0 0 0 2px rgba(22, 163, 74, 0.3)' : ''
                        }}
                      >
                        Sistemas de Accountability
                      </Button>
                    </div>
                    {(action.system === 'environmental_changes' || action.system === 'systems_of_accountability') && (
                      <Input
                        type="text"
                        placeholder={`Descreva o sistema para ${action.description.toLowerCase()}...`}
                        value={systemDescriptionInput[action.id] || ''}
                        onChange={(e) => handleSystemDescriptionChange(action.id, e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mudanças Ambientais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-green-700">Mudanças Ambientais</CardTitle>
              <CardDescription>
                Ações que requerem mudanças no ambiente físico ou digital ({environmentalActions.length} ações)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {environmentalActions.length > 0 ? (
                environmentalActions.map(action => (
                  <div key={action.id} className="p-4 border rounded-lg bg-green-50">
                    <div className="font-medium text-green-900 mb-1">{action.description}</div>
                    {action.systemDescription && (
                      <div className="text-sm text-green-800 mb-1 font-medium">Sistema: {action.systemDescription}</div>
                    )}
                    <div className="text-sm text-green-700">
                      {action.type === 'project' ? 'Projeto' : 'Ação Simples'}
                      {action.count > 1 && ` • ${action.count}x`}
                    </div>
                    {action.type === 'project' && action.nextActions.length > 0 && (
                      <div className="mt-2 text-xs text-green-600">
                        Próximas ações: {action.nextActions.length}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma mudança ambiental definida.</p>
                  <p className="text-sm mt-1">
                    Selecione ações que precisam de mudanças no ambiente.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sistemas de Accountability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-purple-700">Sistemas de Accountability</CardTitle>
              <CardDescription>
                Ações que precisam de acompanhamento e responsabilização ({accountabilityActions.length} ações)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {accountabilityActions.length > 0 ? (
                accountabilityActions.map(action => (
                  <div key={action.id} className="p-4 border rounded-lg bg-purple-50">
                    <div className="font-medium text-purple-900 mb-1">{action.description}</div>
                    {action.systemDescription && (
                      <div className="text-sm text-purple-800 mb-1 font-medium">Sistema: {action.systemDescription}</div>
                    )}
                    <div className="text-sm text-purple-700">
                      {action.type === 'project' ? 'Projeto' : 'Ação Simples'}
                      {action.count > 1 && ` • ${action.count}x`}
                    </div>
                    {action.type === 'project' && action.nextActions.length > 0 && (
                      <div className="mt-2 text-xs text-purple-600">
                        Próximas ações: {action.nextActions.length}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum sistema de accountability definido.</p>
                  <p className="text-sm mt-1">
                    Selecione ações que precisam de acompanhamento.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Cutting */}
        {cuttingActions.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl text-red-700">Cutting - Ações para Cortar</CardTitle>
              <CardDescription>
                Ações que você decidiu remover para focar no essencial ({cuttingActions.length} ações)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cuttingActions.map(action => (
                <div key={action.id} className="p-4 border rounded-lg bg-red-50 border-red-200">
                  <div className="font-medium text-red-900 line-through mb-1">{action.description}</div>
                  <div className="text-sm text-red-700">
                    {action.type === 'project' ? 'Projeto' : 'Ação Simples'}
                    {action.count > 1 && ` • Aparecia ${action.count}x`}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Resumo Final */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Resumo Final do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <h3 className="font-medium text-green-700 mb-2">
                Mudanças Ambientais ({environmentalActions.length})
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {environmentalActions.map(action => (
                  <li key={action.id}>• {action.description} {action.systemDescription && `(${action.systemDescription})`}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-purple-700 mb-2">
                Sistemas de Accountability ({accountabilityActions.length})
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {accountabilityActions.map(action => (
                  <li key={action.id}>• {action.description} {action.systemDescription && `(${action.systemDescription})`}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-red-700 mb-2">
                Cortadas ({cuttingActions.length})
              </h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {cuttingActions.map(action => (
                  <li key={action.id} className="line-through">• {action.description}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-blue-800 text-sm">
              🎉 <strong>Parabéns!</strong> Você completou todo o processo de organização das suas metas e ações. 
              Agora você tem um sistema claro para conseguir tudo o que quer!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

