
export default function PinnedClassElement({title, onClick}: { title: string, onClick: () => void }) {
    return (
        <div onClick={onClick} className={`w-[95%] duration-100 rounded-md h-10 flex items-center gap-4 cursor-pointer hover:bg-secondary-800`}>
            <h1 className="text-text-100 font-bold ml-5">{title}</h1>
        </div>
    )
}