# raxa-mobile

Aplicativo mobile do Raxa, um app para organizar partidas de futebol amador entre amigos.

## Stack

- React Native + Expo
- TypeScript
- React Navigation
- TanStack React Query
- React Hook Form + Zod
- Expo Secure Store

## Como rodar

### Pre-requisitos

- Node.js 20+
- Backend `raxa-api` rodando quando as etapas com API forem implementadas

### Instalar dependencias

```bash
npm install
```

### Configurar ambiente

```bash
copy .env.example .env
```

Edite `EXPO_PUBLIC_API_URL` conforme o ambiente:

- Android emulator: `http://10.0.2.2:8080/api/v1`
- iOS simulator: `http://localhost:8080/api/v1`

### Rodar o app

```bash
npx expo start
```

## Etapas implementadas

- Etapa 1: setup Expo, estrutura base, tokens de tema e design system.
- Etapa 2: navegacao, login, cadastro, JWT persistido com SecureStore e logout.
- Etapa 3: listagem, criacao e detalhe de partidas com React Query.
- Etapa 4: participantes confirmados e acoes de entrar, sair e cancelar partida.
- Etapa 5: convites, deep linking, preview publico, copiar link e compartilhamento nativo.
- Etapa 6: perfil com visualizacao, edicao de nome/telefone, tratamento de 401 e README.

## Decisoes tecnicas

- Estado global e usado apenas para autenticacao, via Context + SecureStore.
- `App.tsx` envolve o app com `SafeAreaProvider`, `QueryClientProvider` e `AuthProvider`.
- Os tipos em `src/types/api.ts` espelham os DTOs documentados pelo backend.
- O `Input` usa `TextInputProps`, sem `any`.
- Compartilhamento de convites usa `Share` nativo do React Native para texto/link; `expo-sharing` nao foi instalado.
- Erros 401 limpam SecureStore e sessao em memoria para retornar ao fluxo de autenticacao.
