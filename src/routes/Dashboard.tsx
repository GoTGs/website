import { useState, useEffect } from "react"

import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import { userAPI } from "@/apis/userAPI"
import { classroomAPI } from "@/apis/classroomAPI"

import RoomCard from "@/components/RoomCard"
import ProfileAvatar from "@/components/ProfileAvatar"
import Nav from "@/components/Nav"

import { Menu, Plus } from "lucide-react"

import RoomAnimation from "@/components/animations/RoomAnimation"

export default function Dashboard() {
    const navigate = useNavigate()
    const [menuOpen, setMenuOpen] = useState(false)

    const {data: user, isLoading: isLoadingUser, error: errorUser } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })

    const {data: classrooms, isLoading: isLoadingClassrooms } = useQuery({
        queryKey: ['classrooms'],
        queryFn: classroomAPI.getUserClassrooms,
    })

    useEffect(() => {
        if (errorUser) {
            // @ts-ignore
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/')
            }
        }
    }, [errorUser])

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative">
                {
                    !isLoadingUser? 
                    <ProfileAvatar className="right-5 top-5 absolute" name={`${user?.first_name} ${user?.last_name}`} role={user?.role}/>:
                    <ProfileAvatar className="right-5 top-5 absolute" isLoading={true} />
                }

                <Menu onClick={() => {setMenuOpen(true)}} className="lg:hidden absolute w-12 h-12 top-3 text-text-50 hover:scale-105 active:scale-100 cursor-pointer left-4"/>
                {menuOpen && <Plus onClick={() => {setMenuOpen(false)}} className="lg:hidden rotate-45 absolute w-12 h-12 top-5 text-text-50 hover:scale-105 active:scale-100 cursor-pointer right-5 z-30"/>}
                <Nav className={`${!menuOpen? "max-lg:hidden": ""}`}/>
                
                <div className="w-5/6 flex flex-col items-center gap-8 overflow-x-hidden">

                    <div className="w-[70%] h-[200px] bg-secondary-900 rounded-md mt-28 overflow-hidden max-lg:absolute max-lg:left-[-1000px]">
                        <RoomAnimation />
                    </div>

                    <div className="w-[80%] pt-10 max-lg:mt-16">
                        <h1 className="text-text-100 font-bold text-3xl">Welcome back, {user && user?.first_name}</h1>
                        <p className="text-text-300 text-lg">Your classrooms</p>
                    </div>

                    <div className="w-[80%] gap-8 grid [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))] mb-24">
                        {
                            isLoadingClassrooms?
                            <RoomCard isLoading={isLoadingClassrooms}/>:
                            classrooms?.map((classroom) => {
                                return <RoomCard key={classroom.id} title={classroom.name} id={classroom.id}/>
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}