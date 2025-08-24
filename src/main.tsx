import "./index.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";

import { DefaultErrorComponent } from "./components/defaults/error-component";
import { DefaultNotFoundComponent } from "./components/defaults/not-found-component";
import { DefaultPendingComponent } from "./components/defaults/pending-component";
import { createRoot } from "react-dom/client";
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient();

export const router = createRouter({
  routeTree,
  defaultPendingComponent: DefaultPendingComponent,
  defaultErrorComponent: DefaultErrorComponent,
  defaultNotFoundComponent: DefaultNotFoundComponent,
  context: {
    queryClient,
    
  },
  defaultPreload: "intent",
  defaultPreloadStaleTime: 0,
  scrollRestoration: true,
  /*** 
  Disable view transitions because it causes links and buttons to become unresponsive. 
  Check if fixed every now and then 
  ***/
  defaultViewTransition: false,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} defaultPreload="intent" />
    </QueryClientProvider>
  );
}
