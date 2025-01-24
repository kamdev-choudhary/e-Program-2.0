import React, { Suspense } from "react";
import Loader from "../components/Loader";

/**
 * A higher-order function to wrap a component with Suspense.
 * @param Component - The component to be lazy-loaded.
 * @returns A Suspense-wrapped component with a fallback loader.
 */
const withSuspense = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  return (props: P) => (
    <Suspense fallback={<Loader />}>
      <Component {...props} />
    </Suspense>
  );
};

export default withSuspense;
