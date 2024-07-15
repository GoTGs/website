import { CircleCheck, Circle, Calendar, GraduationCap } from "lucide-react"

export default function Assignment({title, dueDate, status, score} : {title: string, dueDate: string, status: string, score: string}) {
    return (
        <>
            <div className="gap-10 flex p-3 text-text-50 border-text-300 border-x border-b items-center duration-100 transition-colors cursor-pointer hover:bg-background-800">
                <h1 className="w-[1%] grow-[3]">{title}</h1>

                <div className="w-[1%] grow flex gap-2"> 
                    <Calendar />
                    <h1>{dueDate}</h1>
                </div>

                <div className="w-[1%] grow flex gap-2">
                    {
                        status == "Completed"? <CircleCheck /> : <Circle />
                    }
                    <h1>{status}</h1>
                </div>

                <div className="w-[1%] grow flex gap-2">
                    <GraduationCap />
                    {score}
                </div>
            </div> 
        </>
    )
}