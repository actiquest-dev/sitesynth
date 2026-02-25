/**
 * Global type definitions for Google Sign-In SDK
 */

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: any) => void
          renderButton: (container: HTMLElement, options: any) => void
          prompt: (callback?: (notification: any) => void) => void
          cancel: () => void
          storeCredential: (credential: any, callback?: () => void) => void
          disableAutoSelect: () => void
        }
      }
    }
  }
}

export {}
