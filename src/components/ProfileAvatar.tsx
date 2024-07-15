import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Skeleton } from "./ui/skeleton"

export default function ProfileAvatar({ name, role, className, isLoading }: { name?: string, role?: string, className?: string, isLoading?: boolean }) {
    return (
        <>
            {isLoading?
                <div className={`text-text-50 flex gap-5 justify-center items-center ${className}`}>
                    <div className="flex justify-center items-center flex-col gap-1">
                        <Skeleton className="w-[130px] h-[10px] bg-[#88888850]"/>
                        <Skeleton className="w-[65px] h-[10px] bg-[#88888850]"/>
                    </div>
                    <Skeleton className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#88888850]"/>
                </div>

                :<div className={`text-text-50 flex gap-5 justify-center items-center cursor-pointer hover:scale-105 active:scale-100 ${className}`}>
                    <div className="flex justify-center items-center flex-col">
                        <h1 className="font-bold text-lg">{name}</h1>
                        <Badge className="bg-accent-400 hover:bg-accent-400">{role?.toUpperCase()}</Badge>
                    </div>
                    <Avatar>
                        <AvatarImage src={`https://ui-avatars.com/api/?name=${name}&size=128&background=60494d&color=fff&bold=true`}/>
                    </Avatar>
                </div>
            }
        </>
    )
}