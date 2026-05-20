# Vue Order Package

Admin felület a rendelések kezeléséhez.

## Installation

```bash
npm install
```

## Features

- Rendelések listázása és keresése
- Új rendelés létrehozása
- Rendelés szerkesztése
- Rendelés megtekintése
- Rendelés törlése
- Szűrés és rendezés

## Components

- `Orders.vue` - Rendelések listája
- `OrderCreate.vue` - Új rendelés létrehozása
- `OrderEdit.vue` - Rendelés szerkesztése
- `OrderShow.vue` - Rendelés megtekintése

## Services

- `orderService.ts` - API service a rendelések kezeléséhez

## Router

Automatikusan beilleszthető a Vue Router-be az `index.ts` exportjából.

```typescript
import orderRoutes from '@order/router'

const routes = [
  ...orderRoutes,
  // ... other routes
]
```

