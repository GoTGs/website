import { useLocation } from "react-router-dom"

import NavElement from "./NavElement"
import PinnedClassElement from "./PinnedClassElement"

import { Home, CircleUser } from "lucide-react"

export default function Nav({ className }: { className?: string}) {
    const location = useLocation()

    return (
        <>
            <div className={`w-1/6 min-h-full bg-background-950 border-text-200 border-r-[1px] relative text-text-50 max-lg:absolute max-lg:w-full max-lg:z-20 ${className}`}>
                <h1 className="font-bold text-lg mt-16 ml-5">Menu</h1> 
                <div className="flex flex-col items-center mt-5 gap-1">
                    <NavElement title="Home" icon={<Home/>} active={location.pathname === '/dashboard'} onClick={() => {}}/>
                    <NavElement title="Account" icon={<CircleUser/>} active={location.pathname === '/account'} onClick={() => {}}/>
                </div>
                <h1 className="font-bold text-lg mt-10 ml-5">Pinned</h1> 
                <div className="flex flex-col items-center mt-5 gap-1">
                    <PinnedClassElement title="Methematics" onClick={() => {}}/>
                    <PinnedClassElement title="Art" onClick={() => {}}/>
                </div>
            </div>
        </>
    )
}