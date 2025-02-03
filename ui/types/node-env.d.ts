// types/node-env.d.ts
declare namespace NodeJS {
    export interface ProcessEnv {
      KEYCLOAK_CLIENT_ID: string
      KEYCLOAK_CLIENT_SECRET: string
      KEYCLOAK_ISSUER: string
      REGISTRY_URL: string
      REGISTRY_AUDIENCE: string
    }
  }