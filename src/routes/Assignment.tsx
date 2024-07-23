import { useEffect, useState, useCallback } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"
import { useDropzone } from 'react-dropzone'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { classroomAPI } from "@/apis/classroomAPI"
import { assignmentAPI } from "@/apis/assignmentAPI"
import { userAPI } from "@/apis/userAPI"

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
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function Assignment() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [text, setText] = useState<string>('')
    const [isConfirmDeleteAssignmentDialogOpen, setIsConfirmDeleteAssignmentDialogOpen] = useState<boolean>(false)

    const {data: classsroom, isLoading: isLoadingClassroom} = useQuery({
        queryKey: ['classroom', searchParams.get('assignmentId')],
        queryFn: () => classroomAPI.getClassroom(searchParams.get('roomId')),
    })

    const {data: assignment, isLoading: isLoadingAssignment} = useQuery({
        queryKey: ['assignment', searchParams.get('assignmentId')],
        queryFn: () => assignmentAPI.getAssignment(searchParams.get('assignmentId')),
    })

    const {data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })

    const onDrop  = useCallback((file: any) => {
        for (let i = 0; i < file.length; i++) {
            const element = file[i]; 

            setUploadedFiles(prev => { return [...prev, element] })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    const addSubmissionMutation = useMutation({
        mutationFn: assignmentAPI.addSubmission,
        onError: (error) => {
            toast({
                // @ts-ignore
                title: error.response.data.data,
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['assignment', searchParams.get('assignmentId')]})
        }
    })

    const deleteAssignmentMutation = useMutation({
        mutationFn: assignmentAPI.deleteAssignment,
        onError: (error) => {
            toast({
                // @ts-ignore
                title: error.response.data.data,
                variant: 'destructive',
            })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['assignment', searchParams.get('assignmentId')]})

            navigate(`/assignments?id=${searchParams.get('roomId')}`)
        }
    })

    useEffect(() => {
        if (!searchParams.has('assignmentId')) {
            navigate('/dashboard')
        }
    }, [])

    const handleAddSubmission = (e: any) => {
        e.preventDefault()

        if (uploadedFiles.length == 0 && text == '') {
            toast({
                title: 'Please enter a text or upload a file',
                variant: 'destructive',
            })
            return
        }

        addSubmissionMutation.mutate({assignmentId: searchParams.get('assignmentId'), data: {text, files: uploadedFiles}})
        setUploadedFiles([])
    }

    const deleteAssignment = () => {
        deleteAssignmentMutation.mutate(searchParams.get('assignmentId'))
    }

    return (
        <>        
            <div className="bg-background-950 min-h-screen min-w-screen flex relative flex-col items-center">
                <div className="flex flex-col w-[90%] gap-8 relative">
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
                                {!isLoadingClassroom?
                                    <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">{assignment?.title}</BreadcrumbPage>:
                                    <Skeleton className="w-[100px] h-6 bg-[#88888850] rounded-lg" />
                                }
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="right-0 flex items-center absolute top-16">
                        {!isLoadingUser && user?.role === 'admin' && <Button onClick={() => {setIsConfirmDeleteAssignmentDialogOpen(true)}} className="bg-[#e74c4c] transition-colors font-bold text-text-50 hover:bg-[#b43c3c] duration-150">Delete</Button>}

                        <Dialog open={isConfirmDeleteAssignmentDialogOpen} onOpenChange={setIsConfirmDeleteAssignmentDialogOpen}>
                            <DialogContent className="bg-background-950 text-text-50">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl">Confirm</DialogTitle>
                                </DialogHeader>
                                <div className="flex flex-col gap-5 justify-center items-center">
                                    <p>Are you sure you want to delete assignment: <span className="font-bold">{assignment?.title}</span></p>
                                    <div className="flex flex-col gap-2 w-[80%]">
                                        <Button onClick={deleteAssignment} className="bg-[#e74c4c] w-full transition-colors font-bold text-text-50 hover:bg-[#b43c3c] duration-150">YES</Button>
                                        <Button onClick={() => {setIsConfirmDeleteAssignmentDialogOpen(false)}} className="bg-secondary-700 w-full transition-colors font-bold text-text-50 hover:bg-secondary-800 duration-150">NO</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="flex gap-10 max-lg:flex-col">
                        <div className="flex flex-col text-text-50 w-full leading-8 gap-5">
                            {
                                !isLoadingAssignment?
                                <p className="text-justify">{assignment?.description}</p>:
                                <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                            }

                            <div className="flex flex-col gap-1">
                                {
                                    assignment?.files.map((item: string, index: number) => {
                                        let baseName = item.split('/').at(-1)

                                        if(item.includes('-')) {
                                            return <FileEntry key={index} fileName={baseName?.split('-').slice(1).join('-').replaceAll('%20', ' ')} fileLink={item}/>
                                        }

                                        return <FileEntry key={index} fileName={baseName?.replaceAll("%20", " ")} fileLink={item}/>
                                    })
                                }
                            </div>
                        </div>

                        <form onSubmit={handleAddSubmission} className="flex flex-col w-full gap-2 mb-5">
                            <div className="flex flex-col w-full">
                                <div className="flex flex-col w-full">
                                    <Textarea onChange={(e) => setText(e.target.value)} placeholder="Enter your text" className="resize-none text-text-50 text-lg bg-background-900 rounded-b-none" rows={5}/>
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

                            {   
                                uploadedFiles &&
                                <div className="flex flex-col gap-1">
                                    {
                                        uploadedFiles.map((item, index) => {
                                            return <FileEntry fileName={item.name} ondelete={() => {setUploadedFiles(prev => prev.filter((_, i) => i !== index))}}/>
                                        })
                                    }
                                </div>
                            }

                            {
                                // @ts-ignore
                                assignment?.submissions?.map(submission => {
                                    return (
                                        <div key={submission.id} className="flex flex-col gap-3">
                                            <p className="text-text-50 max-w-[90ch]">{submission.text}</p>
                                            <div className="flex flex-col gap-1">
                                                {
                                                    submission?.file_links.map((item: string, index: number) => {
                                                        let baseName = item.split('/').at(-1)

                                                        if(item.includes('-')) {
                                                            return <FileEntry key={index} fileName={baseName?.split('-').slice(1).join('-').replaceAll('%20', ' ')} fileLink={item}/>
                                                        }

                                                        return <FileEntry key={index} fileName={baseName?.replaceAll("%20", " ")} fileLink={item}/>
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                })
                            }

                            {
                                // @ts-ignore
                                assignment?.submissions?.length == 0 &&
                                <Button className="bg-primary-700 hover:bg-primary-800 text-text-50 font-bold text-xl">Submit</Button>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}