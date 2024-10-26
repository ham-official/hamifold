# HAMIFOLD with Nifty Boilerplate Starter

It uses Nuxt3, tailwind and netlify lambdas.

## Setup

Make sure to install the dependencies:

```bash
# bun
bun install
```

## Development Server (only FE)

Start the development server on `http://localhost:3000`:

```bash
# bun
bun dev
```

## Development Server (with lambdas)

Start the development server on `http://localhost:8888`:

```bash
# bun
bun nifty
```

## Production

Build the application for production:

```bash
# bun
bun build
```

Locally preview production build:

```bash
# bun
bun preview
```

## Environment variables

### Network

```
## Anvil (locally)
VITE_RPC_URL="http://localhost:8545"
VITE_CHAIN_ID=31337


## Base Sepolia (testnet)
VITE_RPC_URL="https://sepolia.base.org/"
VITE_CHAIN_ID=84532


## HAM
VITE_RPC_URL="https://rpc.ham.fun/"
VITE_CHAIN_ID=5112
```