import {
    Trash2,
    FileIcon,
    FileAudioIcon,
    FileVideoIcon,
    ImageIcon,
    FileArchiveIcon,
    FileTextIcon,
} from 'lucide-react';
import { Button } from "./ui/button"
import mime from 'mime'


export default function FileEntry({ fileName, ondelete, fileLink } : {fileName: string | undefined, ondelete?: (e?: any) => void, fileLink?: string}) {
    const handleFileDownload = () => {
        if (fileLink) {
            window.open(fileLink, '_blank')
        }
    }

    const commonMimeTypes = {
        'audio/*': <FileAudioIcon className="left-0" />,
        'video/*': <FileVideoIcon className="left-0" />,
        'image/*': <ImageIcon className="left-0" />,
        'application/zip': <FileArchiveIcon className="left-0" />,
        'application/x-rar-compressed': <FileArchiveIcon className="left-0" />,
        'text/plain': <FileTextIcon className="left-0" />,
    };

    const getFileIcon = (mimeType: any) => {
        // @ts-ignore
        const specificIcon = commonMimeTypes[mimeType];
        if (specificIcon) {
            return specificIcon;
        }

        const [type] = mimeType.split('/');
        switch (type) {
            case 'audio':
            return <FileAudioIcon className="left-0" />;
            case 'video':
            return <FileVideoIcon className="left-0" />;
            case 'image':
            return <ImageIcon className="left-0" />;
            default:
            return <FileIcon className="left-0" />; // Default icon
        }
    };

    return (
        <>
            <div onClick={handleFileDownload} className={`bg-background-700 flex text-text-50 font-semibold p-2 gap-5 items-center rounded-md relative ${fileLink? 'hover:bg-background-800 cursor-pointer': ''}`}>
                {
                    getFileIcon(mime.getType(fileName || ''))
                }

                <p className="grow">{ fileName }</p>

                {ondelete && <Button onClick={ondelete} size="icon" variant="destructive" className="z-20 bg-[#e74c4c] transition-colors hover:bg-[#b43c3c] duration-150 absolute right-0 top-0 h-full">
                    <Trash2  className="duration-150 transition-colors"/>
                </Button>}
            </div>
        </>
    )
}