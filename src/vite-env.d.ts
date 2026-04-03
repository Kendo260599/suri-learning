/// <reference types="vite/client" />

declare module 'react-dom/client' {
  import { RDRCTRoot } from 'react-dom';
  export function createRoot(container: Element | null): { render(element: React.ReactNode): void };
}
