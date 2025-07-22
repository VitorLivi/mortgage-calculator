import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/shared/components/Layout";
import { LoadingSpinner } from "@/shared/components/LoadingSpinner";

const MortgageCalculator = React.lazy(() =>
  import("@/features/mortgage-calculator/pages/MortgageCalculator").then(
    (module) => ({
      default: module.MortgageCalculator,
    })
  )
);

const NotFound = React.lazy(() =>
  import("@/shared/components/NotFound").then((module) => ({
    default: module.NotFound,
  }))
);

function App() {
  return (
    <div className="App">
      <Layout>
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<MortgageCalculator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </div>
  );
}

export default App;
