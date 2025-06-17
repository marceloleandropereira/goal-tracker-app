# Goal Tracker - Como Conseguir Tudo o Que Você Quer

Um aplicativo completo em Next.js, React e Tailwind CSS para gerenciamento de metas e ações, seguindo uma metodologia estruturada para alcançar objetivos.

## 🎯 Sobre o Projeto

Este aplicativo implementa um sistema completo baseado na metodologia "How to Get Everything You Want", permitindo aos usuários:

1. **Definir metas** em 6 categorias específicas
2. **Descobrir ações** para alcançar cada meta
3. **Agrupar ações similares** e identificar padrões
4. **Eleger ações prioritárias** para foco
5. **Organizar em projetos** e próximas ações
6. **Definir sistemas** de suporte e accountability
7. **Identificar o que cortar** para manter o foco

## 🏗️ Arquitetura

### Tecnologias Utilizadas
- **Next.js 14** - Framework React com App Router
- **React 18** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework de estilos utilitários
- **localStorage** - Persistência de dados local

### Estrutura do Projeto
```
goal-tracker-app/
├── src/
│   ├── app/                    # Páginas do App Router
│   │   ├── page.tsx           # Página principal (What do I Want?)
│   │   ├── actions/           # Ações agrupadas
│   │   ├── projects/          # Projetos e próximas ações
│   │   ├── systems/           # Sistemas e cutting
│   │   ├── layout.tsx         # Layout principal
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes reutilizáveis
│   │   ├── ui/               # Componentes base (Button, Input, Card)
│   │   └── CategoryCard.tsx   # Componente principal de categoria
│   ├── lib/                   # Utilitários e lógica de negócios
│   │   ├── storage.ts         # Gerenciamento de dados
│   │   └── utils.ts          # Funções utilitárias
│   └── types/                 # Definições de tipos TypeScript
│       └── index.ts          # Tipos principais
```

## 🚀 Funcionalidades

### 1. Categorias de Metas
- **Personal Growth** - Desenvolvimento pessoal e autoconhecimento
- **Business, Career and Finance** - Negócios, carreira e finanças
- **Leadership and Community** - Liderança e comunidade
- **Health** - Saúde física e mental
- **Relationships** - Relacionamentos pessoais e profissionais
- **Fun and Daily Experiences** - Diversão e experiências do dia a dia

### 2. Fluxo Principal
1. **"What do I Want?"** - Criação de metas por categoria
2. **"How Do I Get It?"** - Definição de ações para cada meta
3. **Agrupamento** - Identificação de ações comuns e específicas
4. **Eleição** - Seleção das ações mais importantes
5. **Projetos** - Organização em projetos e ações simples
6. **Sistemas** - Definição de mudanças ambientais e accountability
7. **Cutting** - Identificação do que pode ser removido

### 3. Recursos Avançados
- **Contagem automática** de ações repetidas
- **Navegação fluida** entre as etapas
- **Persistência local** de todos os dados
- **Interface responsiva** para desktop e mobile
- **Estatísticas em tempo real** do progresso
- **Sistema de próximas ações** para projetos

## 📱 Como Usar

### Passo 1: Definir Metas
1. Acesse a página principal
2. Clique em "Adicionar Meta" em qualquer categoria
3. Digite sua meta e clique em "Adicionar"

### Passo 2: Definir Ações
1. Para cada meta criada, clique em "Como conseguir isso?"
2. Digite uma ação específica
3. Repita para todas as metas

### Passo 3: Agrupar e Eleger
1. Clique em "Ver Ações Agrupadas"
2. Visualize ações comuns (que aparecem múltiplas vezes)
3. Eleja as ações mais importantes clicando em "Eleger"

### Passo 4: Organizar em Projetos
1. Clique em "Organizar em Projetos"
2. Classifique cada ação como "Projeto" ou "Ação Simples"
3. Para projetos, defina próximas ações específicas

### Passo 5: Definir Sistemas
1. Clique em "Definir Sistemas"
2. Escolha entre "Mudanças Ambientais" ou "Sistemas de Accountability"
3. Use "Cortar" para remover ações desnecessárias

## 🎨 Design e UX

### Princípios de Design
- **Clareza** - Interface limpa e intuitiva
- **Progressão** - Fluxo linear e lógico
- **Feedback** - Estatísticas e indicadores visuais
- **Flexibilidade** - Navegação livre entre seções

### Cores e Identidade
- **Azul** - Informações e navegação
- **Verde** - Ações positivas e progresso
- **Laranja** - Ações eleitas e importantes
- **Roxo** - Sistemas e organização
- **Vermelho** - Cutting e remoção

## 🔧 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre no diretório
cd goal-tracker-app

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 📊 Estrutura de Dados

### Tipos Principais
```typescript
interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Goal {
  id: string;
  categoryId: string;
  description: string;
  createdAt: Date;
}

interface Action {
  id: string;
  goalId: string;
  description: string;
  isElected: boolean;
  type: 'project' | 'other';
  system: 'environmental_changes' | 'systems_of_accountability' | null;
  isCutting: boolean;
  nextActions: string[];
  count: number;
  createdAt: Date;
}
```

## 🚀 Deploy

O aplicativo está pronto para deploy em qualquer plataforma que suporte Next.js:

- **Vercel** (recomendado)
- **Netlify**
- **AWS Amplify**
- **Railway**

### Build para Produção
```bash
npm run build
npm run start
```

## 🤝 Contribuição

Este projeto foi desenvolvido como uma implementação completa da metodologia "How to Get Everything You Want". Sugestões e melhorias são bem-vindas!

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

---

**Desenvolvido com ❤️ usando Next.js, React e Tailwind CSS**

