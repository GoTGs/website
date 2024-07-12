import RoomCard from "@/components/RoomCard"
import ProfileAvatar from "@/components/ProfileAvatar"

import RoomAnimation from "@/components/animations/RoomAnimation"

export default function Dashboard() {
    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative">
                <ProfileAvatar className="right-5 top-5 absolute" name="Ivan Stoychev" role="student"/>

                <div className="w-1/6 min-h-full bg-background-900 border-text-200 border-r-[1px]"></div>
                <div className="w-full flex flex-col items-center gap-8">
                    <div className=" w-[70%] h-[200px] bg-secondary-800 rounded-md mt-28 overflow-hidden max-lg:hidden">
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