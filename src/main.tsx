import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Routes from "./routes/Routes.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import Videos from "./pages/Videos.tsx";
import VideoUpload from "./pages/VideoUpload.tsx";
import { SidebarProvider } from "./contexts/SidebarContext.tsx";
import { ThemeContext } from "./contexts/ThemeContext.tsx";
import UserProfile from "./pages/UserProfile.tsx";
import EditProfile from "./pages/EditProfile.tsx";
import VideoWatch from "./pages/VideoWatch.tsx";
const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<Routes />}>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/videos" element={<Videos />} />
      <Route path="/videos/upload" element={<VideoUpload />} />
      <Route path="/@/:username" element={<UserProfile />} />
      <Route
        path="/channel/:userId/editing/profile"
        element={<EditProfile />}
      />
      <Route path="/video/watch/v=:videoId" element={<VideoWatch />} />
    </Route>,
  ])
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <SidebarProvider> */}
    <ThemeContext defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}>{/* <App /> */}</RouterProvider>
    </ThemeContext>
    {/* </SidebarProvider> */}
  </React.StrictMode>
);
