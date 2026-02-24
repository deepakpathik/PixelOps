import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Leaderboard } from "./pages/Leaderboard";
import { Tournaments } from "./pages/Tournaments";
import { Wallet } from "./pages/Wallet";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "leaderboard", Component: Leaderboard },
      { path: "tournaments", Component: Tournaments },
      { path: "wallet", Component: Wallet },
      { path: "admin", Component: Admin },
    ],
  },
]);
