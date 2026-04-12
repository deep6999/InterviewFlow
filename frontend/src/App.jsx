import { useUser } from "@clerk/react";
import HomePage from "./pages/HomePage";
import { Routes, Route, Navigate } from "react-router";
import DashboardPage from "./pages/DashboardPage";
import PromblemsPage from "./pages/PromblemsPage"
function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />}
        />
        <Route
          path="/dashboard"
          element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problems"
          element={isSignedIn ? <PromblemsPage /> : <Navigate to={"/"} />}
        />
      </Routes>
    </>
  );
}

export default App;
