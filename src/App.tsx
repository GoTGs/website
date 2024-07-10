import { createBrowserRouter, RouterProvider } from "react-router-dom"

import { AnimationProvider } from "./context/AnimationContext"

import Home from "./routes/Home"
import RegisterEmail from "./routes/RegisterEmail"
import RegisterFinish from "./routes/RegisterFinish"
import Login from "./routes/Login"

function App() {
  const BrowserRouter = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/register', element: <RegisterEmail /> },
    { path: '/register/finish', element: <RegisterFinish /> },
    { path: '/login', element: <Login /> },
  ])

  return (
    <AnimationProvider>
      <RouterProvider router={BrowserRouter}/>
    </AnimationProvider>
  )
}

export default App
