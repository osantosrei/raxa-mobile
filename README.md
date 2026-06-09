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

## Etapa atual

Esta entrega implementa a Etapa 1: setup, estrutura base, contratos TypeScript da API, tokens de tema e componentes reutilizaveis do design system. O app ainda nao faz chamadas ao backend; a tela inicial e um preview tecnico dos componentes.

## Decisoes tecnicas

- O estado global ainda nao foi introduzido; autenticacao ficara para a Etapa 2.
- `App.tsx` ja envolve o app com `SafeAreaProvider` e `QueryClientProvider` para preparar as proximas etapas.
- Os tipos em `src/types/api.ts` espelham os DTOs documentados pelo backend.
- O `Input` usa `TextInputProps`, sem `any`.
- Compartilhamento de convites sera tratado na Etapa 5; `expo-sharing` nao foi instalado nesta base.
