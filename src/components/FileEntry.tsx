import { Trash2, File } from "lucide-react"
import { Button } from "./ui/button"

export default function FileEntry({ fileName, ondelete } : {fileName: string, ondelete?: () => void}) {
    return (
        <>
            <div className="bg-background-700 flex text-text-50 font-semibold p-2 gap-5 rounded-md relative">
                <File className="left-0"/>

                <p className="grow">{ fileName }</p>

                {ondelete && <Button onClick={ondelete} size="icon" variant="destructive" className="z-20 bg-[#e74c4c] transition-colors hover:bg-[#b43c3c] duration-150 absolute right-0 top-0 h-full">
                    <Trash2  className="duration-150 transition-colors"/>
                </Button>}
            </div>
        </>
    )
}