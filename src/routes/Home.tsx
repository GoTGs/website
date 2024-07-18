import { useEffect } from "react"

import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/dashboard")
        }
    }, [])

    return (
        <>
            <div className="bg-background-900 min-h-screen min-w-screen"></div>
        </>
    )
}