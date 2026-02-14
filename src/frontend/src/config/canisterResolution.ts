/**
 * Canister resolution utility for production and local environments
 */

interface CanisterConfig {
  host: string;
  canisterId: string;
}

/**
 * Determines if the current environment is production based on the hostname
 */
export function isProduction(): boolean {
  const hostname = window.location.hostname;
  return hostname.endsWith('.icp0.io') || hostname.endsWith('.ic0.app') || hostname.endsWith('.raw.icp0.io');
}

/**
 * Gets the appropriate backend canister configuration for the current environment
 */
export function getBackendCanisterConfig(): CanisterConfig {
  const isProd = isProduction();
  
  if (isProd) {
    // Production: use the IC mainnet host and deployed canister ID
    return {
      host: 'https://icp0.io',
      canisterId: getProductionCanisterId(),
    };
  } else {
    // Local development
    return {
      host: 'http://localhost:4943',
      canisterId: getLocalCanisterId(),
    };
  }
}

/**
 * Gets the production canister ID from the environment configuration
 */
function getProductionCanisterId(): string {
  // Try to get from env.json (injected at build time)
  try {
    const envJson = (window as any).__ENV__;
    if (envJson?.BACKEND_CANISTER_ID) {
      return envJson.BACKEND_CANISTER_ID;
    }
  } catch (e) {
    console.warn('Could not load env.json', e);
  }

  // Fallback: try to extract from the current URL or use a hardcoded value
  // This should be replaced with the actual production canister ID
  const hostname = window.location.hostname;
  const match = hostname.match(/^([a-z0-9-]+)\.icp0\.io$/);
  if (match) {
    return match[1];
  }

  throw new Error('Production canister ID not found. Please ensure env.json is properly configured.');
}

/**
 * Gets the local development canister ID
 */
function getLocalCanisterId(): string {
  try {
    const envJson = (window as any).__ENV__;
    if (envJson?.BACKEND_CANISTER_ID) {
      return envJson.BACKEND_CANISTER_ID;
    }
  } catch (e) {
    console.warn('Could not load local canister ID', e);
  }

  // Fallback for local development
  return 'bd3sg-teaaa-aaaaa-qaaba-cai';
}
