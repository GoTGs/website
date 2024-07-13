import { useState } from "react"

import RoomCard from "@/components/RoomCard"
import ProfileAvatar from "@/components/ProfileAvatar"
import Nav from "@/components/Nav"

import { Menu, Plus } from "lucide-react"

import RoomAnimation from "@/components/animations/RoomAnimation"

export default function Dashboard() {
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative">
                <ProfileAvatar className="right-5 top-5 absolute" name="Ivan Stoychev" role="student"/>


                <Menu onClick={() => {setMenuOpen(true)}} className="lg:hidden absolute w-12 h-12 top-5 text-text-50 hover:scale-105 active:scale-100 cursor-pointer left-5"/>
                {menuOpen && <Plus onClick={() => {setMenuOpen(false)}} className="lg:hidden rotate-45 absolute w-12 h-12 top-5 text-text-50 hover:scale-105 active:scale-100 cursor-pointer right-5 z-30"/>}
                <Nav className={`${!menuOpen? "max-lg:hidden": ""}`}/>
                
                <div className="w-full flex flex-col items-center gap-8 overflow-x-hidden">
                    <div className="w-[70%] h-[200px] bg-secondary-800 rounded-md mt-28 overflow-hidden max-lg:absolute max-lg:left-[-1000px]">
                        <RoomAnimation />
                    </div>

                    <div className="w-[80%] pt-10 max-lg:mt-16">
                        <h1 className="text-text-100 font-bold text-3xl">Welcome back, Pesho</h1>
                        <p className="text-text-300 text-lg">Your classrooms</p>
                    </div>

                    <div className="w-[80%] gap-8 grid [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
                        <RoomCard title="Methematics"/>
                        <RoomCard title="Physics"/>
                        <RoomCard title="English"/>
                        <RoomCard title="Biology"/>
                        <RoomCard title="Chemistry"/>
                        <RoomCard title="History"/>
                        <RoomCard title="Art"/>
                    </div>
                </div>
            </div>
        </>
    )
}