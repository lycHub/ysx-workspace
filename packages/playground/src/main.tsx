import React, { lazy, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { ErrorPage } from "./pages/error";

const Chat = lazy(() => import('./pages/Chat'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "chat",
        element: <Chat />
      },
    ]
  },

]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<span>Loading....</span>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
)
