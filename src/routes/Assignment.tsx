import { useEffect, useState, useCallback } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"
import { useDropzone } from 'react-dropzone'
import { useQuery } from "@tanstack/react-query"

import { classroomAPI } from "@/apis/classroomAPI"

import FileEntry from "@/components/FileEntry"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Assignment() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [assignmentFiles, setAssignmentFiles] = useState<File[]>([])

    const {data: classsroom, isLoading: isLoadingClassroom} = useQuery({
        queryKey: ['classroom', searchParams.get('assignmentId')],
        queryFn: () => classroomAPI.getClassroom(searchParams.get('roomId')),
    })

    const onDrop  = useCallback((file: any) => {
        for (let i = 0; i < file.length; i++) {
            const element = file[i]; 

            setUploadedFiles(prev => { return [...prev, element] })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    useEffect(() => {
        if (!searchParams.has('assignmentId')) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <>        
            <div className="bg-background-950 min-h-screen min-w-screen flex relative flex-col items-center">
                <div className="flex flex-col w-[90%] gap-8">
                    <Breadcrumb className="mt-16 ml-[-10px]">
                        <BreadcrumbList className="text-text-50">
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate('/dashboard')} className="text-lg">Dashboard</BreadcrumbLink> 
                            </BreadcrumbItem>
                            <BreadcrumbSeparator><p className="text-2xl -translate-y-1 text-text-50">/</p></BreadcrumbSeparator>
                            <BreadcrumbItem>
                                {!isLoadingClassroom?
                                    <BreadcrumbLink onClick={() => navigate(`/assignments?id=${searchParams.get('roomId')}`)} className="text-lg">{classsroom?.name}</BreadcrumbLink>:
                                    <Skeleton className="w-[100px] h-6 bg-[#88888850] rounded-lg" />
                                }
                            </BreadcrumbItem>
                            <BreadcrumbSeparator><p className="text-2xl -translate-y-1 text-text-50">/</p></BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">Revolutionizing Industries: The Power of Artificial Intelligence</BreadcrumbPage> 
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="flex gap-10 max-lg:flex-col">
                        <div className="flex flex-col text-text-50 w-full leading-8 gap-5">
                            <p className="text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo, voluptatum animi nobis, quae iste mollitia eveniet non quod consequatur corporis cum voluptatem. Iusto quia aperiam vitae, voluptate totam, assumenda expedita officiis tenetur enim optio sed, numquam cupiditate omnis praesentium corrupti fuga quas veritatis! Enim debitis asperiores fugit quisquam, reprehenderit aspernatur.</p>

                            <div className="flex flex-col gap-1">
                                {
                                    assignmentFiles.map((item) => {
                                        return <FileEntry fileName={item.name} />
                                    })
                                }
                            </div>
                        </div>

                        <form onSubmit={(e) => {e.preventDefault()}} className="flex flex-col w-full gap-2 mb-5">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col w-full">
                                    <Textarea placeholder="Enter your text" className="resize-none text-text-50 text-lg bg-background-900 rounded-b-none" rows={5}/>
                                </div>

                                <div className={`bg-background-800 border-white border-l border-r border-b rounded-b-md relative text-text-50 p-4 ${isDragActive? 'bg-background-700' : ''}`} {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                        <div className="flex justify-center items-center">
                                            <p className="text-text-200 font-bold">Drop the files here ...</p>
                                        </div> :
                                        <p>Drag 'n' drop some files here, or click to select files</p>
                                    }
                                </div>
                            </div>

                            {   uploadedFiles &&
                                <div className="flex flex-col gap-1">
                                    {
                                        uploadedFiles.map((item, index) => {
                                            return <FileEntry fileName={item.name} ondelete={() => {setUploadedFiles(prev => prev.filter((_, i) => i !== index))}}/>
                                        })
                                    }
                                </div>
                            }

                            <Button className="bg-primary-800 hover:bg-primary-700 text-text-50 font-bold text-xl">Submit</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}