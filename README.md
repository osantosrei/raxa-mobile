<div align="center">

# Raxa

App mobile do **Raxa** — organize peladas sem depender do caos de grupos de WhatsApp.

![React Native](https://img.shields.io/badge/React_Native-Expo_SDK_54-0ea5e9?style=flat-square&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Query](https://img.shields.io/badge/TanStack-React_Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validação-3E67B1?style=flat-square)

</div>

---

## Sobre o projeto

O Raxa resolve um problema cotidiano: confirmar presença em peladas pelo WhatsApp é caótico. Confirmações se perdem, ninguém sabe quantas vagas restam e o organizador conta na mão.

Este repositório é o app mobile que consome a [raxa-api](https://github.com/osantosrei/raxa-api). Cobre o fluxo completo do usuário — do cadastro ao compartilhamento de convites — com iOS e Android via Expo.

**O que o app faz**

- Cadastro e login com JWT persistido de forma segura
- Criação de partidas com data, local e limite de jogadores
- Listagem e detalhes de partidas com cache automático
- Entrada e saída de partidas com feedback visual em tempo real
- Convites compartilháveis via link ou código (`raxa://invite/{code}`)
- Preview público da partida sem exigir login
- Perfil do usuário com edição de nome e telefone

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | React Native + Expo SDK 54 |
| Linguagem | TypeScript |
| Navegação | React Navigation (Native Stack + Bottom Tabs) |
| Cache e requisições | TanStack React Query |
| Formulários | React Hook Form + Zod |
| Armazenamento seguro | Expo SecureStore |
| Deep linking | Expo Linking |
| Compartilhamento | Share API nativa do React Native |

---

## Rodando localmente

### Pré-requisitos

- Node.js 20+
- Expo Go instalado no dispositivo, ou Android/iOS emulator
- Backend [raxa-api](https://github.com/osantosrei/raxa-api) rodando

### 1. Clone o repositório

```bash
git clone https://github.com/osantosrei/raxa-mobile.git
cd raxa-mobile
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o ambiente

```bash
cp .env.example .env
```

Edite `EXPO_PUBLIC_API_URL` de acordo com o ambiente:

| Ambiente | URL |
|---|---|
| Android emulator | `http://10.0.2.2:8080/api/v1` |
| iOS simulator | `http://localhost:8080/api/v1` |
| Dispositivo físico | IP local da máquina — ex: `http://192.168.0.10:8080/api/v1` |

### 4. Inicie o app

```bash
npx expo start
```

### Testando deep links (desenvolvimento)

```bash
npx uri-scheme open "raxa://invite/abc123" --android
npx uri-scheme open "raxa://invite/abc123" --ios
```

---

## Fluxo principal

```
Cadastro / Login
  └─ JWT salvo no SecureStore

Home → lista de partidas do usuário
  └─ Criar partida → preenche título, local, data e limite
      └─ API retorna inviteCode → detalhe da partida abre

Detalhe da partida
  ├─ Criador: vê botão "Cancelar" e widget de compartilhamento do convite
  └─ Jogador: vê "Entrar" (se OPEN) ou "Sair" (se confirmado)

Fluxo de convite
  └─ raxa://invite/{code} abre InvitePreviewScreen (sem login)
      ├─ Logado    → "Confirmar presença" → entra na partida
      └─ Não logado → salva código → Login → retoma o convite
```

---

## Decisões técnicas

**Estado global restrito à autenticação.**
Só o contexto de auth usa estado global (`Context + SecureStore`). Todo o restante — partidas, participantes, convites — vive no cache do React Query, que gerencia loading, erro e invalidação de forma uniforme.

**Tipos espelham os DTOs do backend.**
`src/types/api.ts` define as interfaces `MatchResponse`, `InvitePreviewResponse`, `ApiError` e demais contratos diretamente a partir da documentação da `raxa-api`. Qualquer mudança no backend quebra o TypeScript antes de quebrar o app em runtime.

**Validação em duas camadas.**
Zod valida os formulários no cliente antes de qualquer chamada à API. Erros de negócio que passam pela validação local (partida cheia, usuário duplicado) chegam como `ApiError.message` e são exibidos diretamente na tela — sem tradução, porque o backend já responde em português.

**Compartilhamento via `Share` nativo.**
A API nativa do React Native foi suficiente para o caso de uso — compartilhar um link de texto. `expo-sharing` não foi instalado para não adicionar dependência sem necessidade.

**Tratamento de 401 centralizado.**
O interceptor do Axios limpa o `SecureStore` e o estado de memória ao receber 401, devolvendo o usuário ao fluxo de autenticação sem crash e sem estado corrompido.

**`Input` tipado com `TextInputProps`.**
O componente base de input herda as props nativas sem usar `any`, mantendo a segurança de tipos em todos os formulários do app.

---

## Estrutura do projeto

```
src/
├── api/           # Funções de chamada HTTP por domínio (auth, matches, invites...)
├── components/
│   ├── match/     # MatchCard, MatchActions, PlayerListItem, InviteShareButton
│   └── ui/        # Button, Input, Badge, Avatar, EmptyState, LoadingSpinner
├── hooks/         # Hooks React Query por recurso (useMatches, usePlayers, useInvite...)
├── navigation/    # RootNavigator, AuthStack, AppTabs, linking config
├── screens/       # Telas organizadas por domínio (auth/, match/, invite/, profile/)
├── store/         # AuthContext + AuthProvider
├── theme/         # Tokens de cor, tipografia e espaçamento
└── types/
    └── api.ts     # Contratos TypeScript com a raxa-api
```

---

<div align="center">
  <sub>raxa-mobile · React Native · Expo · TypeScript · MVP</sub>
</div>