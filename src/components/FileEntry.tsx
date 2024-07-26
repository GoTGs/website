import { useState } from 'react';

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


export default function FileEntry({ fileName, ondelete, fileLink, file } : {fileName: string | undefined, ondelete?: (e?: any) => void, fileLink?: string, file?: File}) {
    const [isMouseOverFile, setIsMouseOverFile] = useState<boolean>(false)
    const [filePreview, setFilePreview] = useState<File>()

    const fileReader = new FileReader()

    fileReader.onload = (e) => {
        // @ts-ignore
        setFilePreview(e.target?.result as File)
    }

    if (file) {
        fileReader.readAsDataURL(file)
    }

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
            <div onMouseEnter={() => {setIsMouseOverFile(true)}} onMouseLeave={() => {setIsMouseOverFile(false)}} onClick={handleFileDownload} className={`bg-background-700 flex text-text-50 font-semibold p-2 gap-5 items-center rounded-md relative ${fileLink? 'hover:bg-background-800 cursor-pointer': ''}`}>
                {
                    getFileIcon(mime.getType(fileName || '') != null && mime.getType(fileName || ''))
                }

                <p className="grow">{ fileName }</p>

                {ondelete && <Button onClick={ondelete} size="icon" variant="destructive" className="z-20 bg-[#e74c4c] transition-colors hover:bg-[#b43c3c] duration-150 absolute right-0 top-0 h-full">
                    <Trash2  className="duration-150 transition-colors"/>
                </Button>}

                {
                    !file &&
                    isMouseOverFile &&
                    <div className='w-full absolute top-0 -translate-x-[10px] z-20 mb-5 translate-y-10'>
                        {
                            mime.getType(fileName || '') != null && mime.getType(fileName || '') === 'application/pdf' ? (
                                <object
                                    data={fileLink}
                                    width="100%"
                                    height="600px"
                                    className="border border-gray-300 rounded-md shadow-sm"
                                ></object>
                            ) :
                            // @ts-ignore
                            mime.getType(fileName || '') != null && mime.getType(fileName || '').startsWith('image/') ? (
                                <img
                                    src={fileLink}
                                    alt="File Preview"
                                    className="border border-gray-300 rounded-md shadow-sm"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            ) : null
                        }
                    </div>
                }

                {
                    file &&
                    isMouseOverFile &&
                    <div className='w-full absolute top-0 -translate-x-[10px] z-20 mb-5 translate-y-10'>
                        {
                            mime.getType(fileName || '') != null && mime.getType(fileName || '') === 'application/pdf' ? (
                                // @ts-ignore
                                <object data={filePreview}
                                    width="100%"
                                    height="600px"
                                    className="border border-gray-300 rounded-md shadow-sm"
                                ></object>
                            ) :
                            // @ts-ignore
                            mime.getType(fileName || '') != null && mime.getType(fileName || '').startsWith('image/') ? (
                                // @ts-ignore
                                <img src={filePreview}
                                    alt="File Preview"
                                    className="border border-gray-300 rounded-md shadow-sm"
                                    style={{ maxWidth: '100%', height: 'auto' }}
                                />
                            ) : null
                        }
                    </div>
                }
            </div>
        </>
    )
}