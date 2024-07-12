
export default function RoomCard({ title } : { title: string }) {
    return (
        <>
            <div className="text-text-50 flex items-center justify-center w-full overflow-hidden h-[200px] cursor-pointer bg-red-900 rounded-xl relative before:absolute before:w-full before:h-full before:bg-gradient-to-t before:from-[#000] before:to-[#00000000] before:rounded-xl hover:scale-105 duration-100">
                <img className="w-full" src={`https://api.dicebear.com/9.x/shapes/svg?seed=${title}`} alt="" />
                <h1 className="z-10 absolute bottom-5 left-5 font-bold text-2xl">{title}</h1>
            </div>
        </>
    )
}