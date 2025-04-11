import React, { Suspense } from "react";
import Loader from "../components/Loader";

const withSuspense = (Component: React.LazyExoticComponent<React.FC<any>>) => (
  <Suspense fallback={<Loader open={true} />}>
    <Component />
  </Suspense>
);

export default withSuspense;
