import RoomAnimation from "@/components/animations/RoomAnimation"

export default function Dashboard() {
    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex">
                <div className="w-1/6 bg-background-900 border-text-200 border-r-[1px]"></div>
                <div className="w-full flex flex-col items-center">
                    <div className=" w-[70%] h-[200px] bg-accent-800 rounded-md mt-20 overflow-hidden max-lg:hidden">
                        <RoomAnimation />
                    </div>

                    <div className="w-[80%] pt-16">
                        <h1 className="text-text-100 font-bold text-3xl">Welcome back, Pesho</h1>
                        <p className="text-text-300 text-lg">Your classrooms</p>
                    </div>
                </div>
            </div>
        </>
    )
}