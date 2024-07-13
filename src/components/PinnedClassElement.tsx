
export default function PinnedClassElement({title, onClick}: { title: string, onClick: () => void }) {
    return (
        <div onClick={onClick} className={`w-[95%] duration-100 rounded-lg h-14 flex items-center gap-4 cursor-pointer hover:bg-primary-700`}>
            <h1 className="text-text-100 font-bold ml-5 text-lg">{title}</h1>
        </div>
    )
}