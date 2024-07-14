import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { AnimationProvider } from "./context/AnimationContext"

import { Toaster } from "@/components/ui/toaster"

import Home from "./routes/Home"
import RegisterEmail from "./routes/RegisterEmail"
import RegisterFinish from "./routes/RegisterFinish"
import Login from "./routes/Login"
import Dashboard from "./routes/Dashboard"

const queryClient = new QueryClient()

function App() {
  const BrowserRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/register', element: <RegisterEmail /> },
    { path: '/register/finish', element: <RegisterFinish /> },
    { path: '/login', element: <Login /> },
    { path: '/dashboard', element: <Dashboard /> },
  ])

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AnimationProvider>
          <RouterProvider router={BrowserRouter}/>
        </AnimationProvider>
      </QueryClientProvider>
      <Toaster />
    </>
  )
}

export default App
