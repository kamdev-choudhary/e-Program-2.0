import { lazy, ComponentType, LazyExoticComponent } from "react";

/**
 * Utility function to lazily load components with TypeScript support.
 * @param importFn - Function that dynamically imports a module
 * @returns Lazy-loaded component wrapped in React.lazy
 */
const lazyLoad = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): LazyExoticComponent<T> => lazy(importFn);

export default lazyLoad;
