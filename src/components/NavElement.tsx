

export default function NavElement({title, icon, active, onClick}: { title: string, icon: JSX.Element, active: boolean, onClick: () => void }) {
    return (
        <div onClick={onClick} className={`w-[95%] duration-100 rounded-lg h-14 flex items-center gap-4 cursor-pointer ${active ? "bg-primary-700" : "hover:bg-primary-700"}`}>
            <div className="w-14 h-14 flex items-center justify-center">
                {icon}
            </div>
            <p className="text-text-100 font-bold">{title}</p>
        </div>
    )
}