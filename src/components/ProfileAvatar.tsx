import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"

export default function ProfileAvatar({ name, role, className }: { name: string, role: string, className?: string }) {
    return (
        <>
            <div className={`text-text-50 flex gap-5 justify-center items-center cursor-pointer hover:scale-105 active:scale-100 ${className}`}>
                <div className="flex justify-center items-center flex-col">
                    <h1 className="font-bold text-lg">{name}</h1>
                    <Badge className="bg-accent-400 hover:bg-accent-400">{role.toUpperCase()}</Badge>
                </div>
                <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${name}&size=128&background=60494d&color=fff&bold=true`}/>
                </Avatar>
            </div> 
        </>
    )
}