import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.tsx";
import routes from "./routes";
import AppRouter from "./routes";

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <AppRouter />
      </>
    </Suspense>
  );
}

export default App;
