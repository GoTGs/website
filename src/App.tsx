import { createBrowserRouter, RouterProvider } from "react-router-dom"

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
    <RouterProvider router={BrowserRouter}/>
  )
}

export default App
