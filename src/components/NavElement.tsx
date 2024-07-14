

export default function NavElement({title, icon, active, onClick}: { title: string, icon: JSX.Element, active: boolean, onClick: () => void }) {
    return (
        <div onClick={onClick} className={`w-[95%] duration-100 rounded-md h-10 flex items-center gap-4 cursor-pointer ${active ? "bg-secondary-800" : "hover:bg-secondary-800"}`}>
            <div className="w-10 h-10 flex items-center justify-center ml-3">
                {icon}
            </div>
            <p className="text-text-100 font-bold">{title}</p>
        </div>
    )
}