import React, { lazy, Suspense } from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.scss';
import { BrowserRouter, createHashRouter, RouterProvider } from "react-router-dom";
import { Home } from "./pages/Home";
import { ErrorPage } from "./pages/error";
import { ErrorBoundary } from "react-error-boundary";
import Grid from "./pages/Grid";

const Chat = lazy(() => import('./pages/Chat'));
const Animate = lazy(() => import('./pages/Animate'));

const router = createHashRouter([
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
      {
        path: "animate",
        element: <Animate />
      },
      {
        path: "grid",
        element: <Grid />
      },
    ]
  },

]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<span>Loading....</span>}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <RouterProvider router={router} fallbackElement={<span>Init....</span>} />
      </ErrorBoundary>
    </Suspense>
    {/*<BrowserRouter>
      <App />
    </BrowserRouter>*/}
  </React.StrictMode>
)
