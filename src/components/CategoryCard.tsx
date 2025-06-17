'use client';

import { useState } from 'react';
import { Category, Goal, Action } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createGoal, createAction } from '@/lib/storage';

interface CategoryCardProps {
  category: Category;
  goals: Goal[];
  actions: Action[];
  onAddGoal: (goal: Goal) => void;
  onAddAction: (action: Action) => void;
}

export function CategoryCard({ category, goals, actions, onAddGoal, onAddAction }: CategoryCardProps) {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [addingActionForGoal, setAddingActionForGoal] = useState<string | null>(null);
  const [newActionDescription, setNewActionDescription] = useState('');

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      const goal = createGoal(category.id, newGoalTitle.trim());
      onAddGoal(goal);
      setNewGoalTitle('');
      setIsAddingGoal(false);
    }
  };

  const handleAddAction = (goalId: string) => {
    if (newActionDescription.trim()) {
      const action = createAction(goalId, newActionDescription.trim());
      onAddAction(action);
      setNewActionDescription('');
      setAddingActionForGoal(null);
    }
  };

  const categoryGoals = goals.filter(goal => goal.categoryId === category.id);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg">{category.name}</CardTitle>
        <CardDescription>{category.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Lista de metas existentes */}
        {categoryGoals.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-gray-600">Suas metas:</h4>
            {categoryGoals.map(goal => {
              const goalActions = actions.filter(action => action.goalId === goal.id);
              return (
                <div key={goal.id} className="border rounded-md p-3 bg-gray-50">
                  <div className="font-medium text-sm mb-2">{goal.title}</div>
                  
                  {/* Ações para esta meta */}
                  {goalActions.length > 0 && (
                    <div className="space-y-1 mb-2">
                      <div className="text-xs text-gray-500 font-medium">Como conseguir:</div>
                      {goalActions.map(action => (
                        <div key={action.id} className="text-xs bg-white p-2 rounded border-l-2 border-blue-200">
                          {action.description}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário para adicionar ação */}
                  {addingActionForGoal === goal.id ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Como eu consigo isso?"
                        value={newActionDescription}
                        onChange={(e) => setNewActionDescription(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddAction(goal.id)}
                        className="text-sm"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddAction(goal.id)}>
                          Adicionar
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => {
                          setAddingActionForGoal(null);
                          setNewActionDescription('');
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
                      onClick={() => setAddingActionForGoal(goal.id)}
                    >
                      + Como conseguir isso?
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Formulário para adicionar nova meta */}
        {isAddingGoal ? (
          <div className="space-y-2">
            <Input
              placeholder="O que você quer?"
              value={newGoalTitle}
              onChange={(e) => setNewGoalTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddGoal}>
                Adicionar
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsAddingGoal(false);
                setNewGoalTitle('');
              }}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setIsAddingGoal(true)}
          >
            + Adicionar Meta
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

