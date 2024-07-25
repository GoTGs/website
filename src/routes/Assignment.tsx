import { useEffect, useState, useCallback } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"
import { useDropzone } from 'react-dropzone'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

import { classroomAPI } from "@/apis/classroomAPI"
import { assignmentAPI, AssignmentEditDataType } from "@/apis/assignmentAPI"
import { userAPI } from "@/apis/userAPI"
import moment from "moment"

import FileEntry from "@/components/FileEntry"

import { CalendarIcon, GraduationCap } from "lucide-react"

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
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { TimePicker } from "@/components/ui/datetime"

import { Bars } from 'react-loader-spinner'

export default function Assignment() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { toast } = useToast()
    const queryClient = useQueryClient()

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    const [text, setText] = useState<string>('')
    const [isConfirmDeleteAssignmentDialogOpen, setIsConfirmDeleteAssignmentDialogOpen] = useState<boolean>(false)

    const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)

    const [newAssignmentDate, setNewAssignmentDate] = useState<Date | undefined>(undefined)
    const [editAssignmentTime, setEditAssignmentTime] = useState<Date | undefined>(undefined)
    const [editedAssignment, setEditedAssignment] = useState<AssignmentEditDataType | null>(null)

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

    const onDropEdit  = useCallback((file: any) => {
        for (let i = 0; i < file.length; i++) {
            const element = file[i]; 

            // @ts-ignore
            setEditedAssignment(prev => { return {...prev, files: [...prev.files, element] } })
        }
    }, [])

    const { getRootProps: getRootPropsEdit, getInputProps: getInputPropsEdit, isDragActive: isDragActiveEdit } = useDropzone({onDrop: onDropEdit})

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

    const editAssignmentMutation = useMutation({
        mutationFn: assignmentAPI.editAssignment,
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

    useEffect(() => {
        if (!searchParams.has('assignmentId') || !searchParams.has('roomId')) {
            navigate('/dashboard')
        }
    }, [])

    useEffect(() => {
        setEditedAssignment({
            title: assignment?.title,
            description: assignment?.description,
            dueDate: assignment?.dueDate,
            files: [],
            stringFiles: assignment?.files
        })

        setNewAssignmentDate(moment(assignment?.dueDate, 'DD-MM-YYYY').toDate())
        setEditAssignmentTime(moment(moment(assignment?.dueDate, 'DD-MM-YYYY HH:mm:ss').format('HH:mm:ss'), 'HH:mm:ss').toDate())
    }, [assignment])

    useEffect(() => {
        if (editedAssignment) {
            setEditedAssignment(prev => ({...prev, dueDate: moment(newAssignmentDate).format('DD-MM-YYYY')}))
        }
    }, [newAssignmentDate])

    useEffect(() => {
        if (editAssignmentTime) {
            setEditedAssignment(prev => ({...prev, dueDate: moment(newAssignmentDate).format('DD-MM-YYYY') + ' ' + moment(editAssignmentTime).format('HH:mm:ss')}))
        }
    }, [editAssignmentTime])

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
        setText('')
    }

    const deleteAssignment = () => {
        deleteAssignmentMutation.mutate(searchParams.get('assignmentId'))
    }

    const handleEditAssignment = (e: any) => {
        e.preventDefault()

        if (editedAssignment?.files?.length == 0 && editedAssignment?.stringFiles?.length == 0 && editedAssignment.title?.length == 0) {
            toast({
                title: 'Please upload a file or enter a title',
                variant: 'destructive',
            })
            return
        }
 
        if (!newAssignmentDate) {
            toast({
                title: 'Please pick a due date',
                variant: 'destructive',
            })
            return
        }

        editAssignmentMutation.mutate({assignmentId: searchParams.get('assignmentId'), data: editedAssignment})

        setIsEditDialogOpen(false)
    }

    return (
        <>        
            {
                addSubmissionMutation.isPending || editAssignmentMutation.isPending || deleteAssignmentMutation.isPending?
                <div className="absolute top-0 left-0 right-0 bottom-0 z-30 bg-[#ffffff20] flex justify-center items-center">
                    <Bars
                        height="80"
                        width="80"
                        color="#ff7a33"
                        ariaLabel="bars-loading"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        />
                </div>: null
            }

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
                                {!isLoadingAssignment?
                                    <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">{assignment?.title}</BreadcrumbPage>:
                                    <Skeleton className="w-[100px] h-6 bg-[#88888850] rounded-lg" />
                                }
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="right-0 flex items-center absolute top-16 gap-3 max-md:flex-col">
                        {
                            user?.role === 'admin' || user?.role === 'teacher'?
                            <Button onClick={() => {setIsEditDialogOpen(true)}} className="text-text-50 px-6 py-4 bg-primary-700 hover:bg-primary-800">Edit</Button>: null
                        }
                        {
                            user?.role === 'admin' || user?.role === 'teacher'?
                            <Button onClick={() => {navigate(`/grade?roomId=${searchParams.get('roomId')}&assignmentId=${searchParams.get('assignmentId')}`)}} className="text-text-50 px-6 py-4 bg-primary-700 hover:bg-primary-800">Grade</Button>: null
                        }
                        {
                            !isLoadingUser && user?.role === 'admin' || user?.role === 'teacher'? 
                            <Button onClick={() => {setIsConfirmDeleteAssignmentDialogOpen(true)}} className="bg-[#e74c4c] transition-colors font-bold text-text-50 hover:bg-[#b43c3c] duration-150">Delete</Button>: null
                        }

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
                        <div className="flex flex-col text-text-50 w-full leading-8 gap-5 max-md:mt-20">
                            {
                                !isLoadingAssignment?
                                <p className="text-justify">{assignment?.description}</p>:
                                <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                            }

                            <div className="flex flex-col gap-1">
                                {
                                    !isLoadingAssignment?
                                    assignment?.files.map((item: string, index: number) => {
                                        let fileName = item.split('/').at(-1)

                                        if(item.includes('-')) {
                                            fileName = fileName?.split('-').slice(1).join('-').replaceAll('%20', ' ')
                                        } else {
                                            fileName = fileName?.replaceAll("%20", " ")
                                        }
                                        
                                        return <FileEntry key={index} fileName={fileName} fileLink={item}/>
                                    }):
                                    <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                                }
                            </div>

                            {
                                !isLoadingAssignment?
                                <span className="flex gap-3">
                                    <CalendarIcon /> 
                                    <p className="text-justify">{assignment?.dueDate}</p>
                                </span>:
                                <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                            }

                            <span className="w-full h-[1px] bg-text-300 mt-3 mb-3"></span>

                            {
                                !isLoadingAssignment?
                                    // @ts-ignore
                                    assignment?.grade?
                                        <div className="flex flex-col gap-1">
                                            <p className="text-2xl">Grade</p>
                                            <span className="flex gap-2">
                                                <GraduationCap />  
                                                <p className="text-justify">{
                                                    // @ts-ignore
                                                    assignment?.grade.grade
                                                }%</p>
                                            </span>
                                        </div>:
                                    null:
                                <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                            }

                            {
                                !isLoadingAssignment?
                                    // @ts-ignore
                                    assignment?.grade?
                                        <span className="flex flex-col gap-1">
                                            <p className="text-2xl">Feedback</p>
                                            <p className="text-justify">{
                                                // @ts-ignore
                                                assignment?.grade.feedback
                                            }</p>
                                        </span>:
                                    null:
                                <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                            }
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
                                moment(assignment?.dueDate, 'DD-MM-YYYY').isAfter(moment()) &&
                                <Button className="bg-primary-700 hover:bg-primary-800 text-text-50 font-bold text-xl">Submit</Button>
                            }

                            <div className="flex flex-col gap-5 mt-3">
                                {
                                    !isLoadingAssignment?
                                    // @ts-ignore
                                    assignment?.submissions?.map(submission => {
                                        return (
                                            <div key={submission.id} className="flex flex-col gap-3">
                                                <p className="text-text-50 max-w-[90ch]">{submission.text}</p>
                                                {
                                                    submission?.file_links.length > 0 &&
                                                    <div className="flex flex-col gap-1">
                                                        {
                                                            submission?.file_links.map((item: string, index: number) => {
                                                                let fileName = item.split('/').at(-1)

                                                                if(item.includes('-')) {
                                                                    fileName = fileName?.split('-').slice(1).join('-').replaceAll('%20', ' ')
                                                                } else {
                                                                    fileName = fileName?.replaceAll("%20", " ")
                                                                }

                                                                return <FileEntry key={index} fileName={fileName} fileLink={item}/>
                                                            })
                                                        }
                                                    </div>
                                                }
                                                <span className="w-full h-[1px] bg-text-300"></span>
                                            </div>
                                        )
                                    }):
                                    <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                                }
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} >                        
                <DialogContent className="bg-background-950 text-text-50 min-w-[60%] min-h-[60%]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Edit Assignment: <span className="font-bold">{assignment?.title}</span></DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleEditAssignment} className="mt-4 flex w-full justify-center">
                        <div className="w-[90%] flex flex-col gap-5">
                            <div className="w-full flex flex-col gap-3">
                                <Input onChange={(e) => {setEditedAssignment(prev => ({...prev, title: e.target.value}))}} value={editedAssignment?.title} placeholder="*Enter assignment title" name="title" className="text-text-50" />

                                <div>
                                    <Textarea onChange={(e) => {setEditedAssignment(prev => ({...prev, description: e.target.value}))}} name="description" value={editedAssignment?.description} placeholder="Enter assignment discription (optional)" className="resize-none text-text-50 text-md border-b-none rounded-b-none" rows={12}/>

                                    <div className={`bg-background-800 border-white border-l border-r border-b rounded-b-md relative text-text-50 p-4 ${isDragActiveEdit? 'bg-background-700' : ''}`} {...getRootPropsEdit()}>
                                        <input {...getInputPropsEdit()} />
                                        {
                                            isDragActiveEdit ?
                                            <div className="flex justify-center items-center">
                                                <p className="text-text-200 font-bold">Drop the files here ...</p>
                                            </div> :
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        }
                                    </div>
                                </div>

                                {
                                    editedAssignment?.stringFiles &&
                                    <div className="flex flex-col gap-1">
                                        {
                                            editedAssignment?.stringFiles.map((item, index) => {
                                                let fileName: string | undefined = item.split('/').at(-1)

                                                if(item.includes('-')) {
                                                    fileName = fileName?.split('-').slice(1).join('-').replaceAll('%20', ' ')
                                                } else {
                                                    fileName = fileName?.replaceAll("%20", " ")
                                                }

                                                return <FileEntry key={index} fileName={fileName} ondelete={(e: any) => {e.preventDefault(); setEditedAssignment(prev => ({...prev, stringFiles: prev?.stringFiles?.filter((_, i) => i !== index) })) }}/>
                                            })
                                        }
                                    </div>
                                }
                                {
                                    editedAssignment?.files &&
                                    <div className="flex flex-col gap-1">
                                        {
                                            editedAssignment?.files.map((item, index) => {
                                                return <FileEntry key={index} fileName={item.name} ondelete={(e: any) => {e.preventDefault(); setEditedAssignment(prev => ({...prev, files: prev?.files?.filter((_, i) => i !== index) })) }}/>
                                            })
                                        }
                                    </div>
                                }

                                <div className="flex flex-col gap-5 justify-center items-start mt-3">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant="outline" className="relative flex justify-center w-1/3">
                                                    {
                                                    newAssignmentDate? 
                                                    <span className="absolute left-2 text-text-50 font-semibold">{newAssignmentDate.toDateString()}</span>:
                                                    <span className="absolute left-2 text-text-500 font-semibold">*Pick a due date</span>
                                                }

                                                <CalendarIcon className="absolute right-2 m-auto text-text-500"/>
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={newAssignmentDate}
                                                onSelect={setNewAssignmentDate}
                                                className="rounded-md bg-background-950 text-text-50"
                                            />
                                        </PopoverContent>
                                    </Popover>

                                    <div className="flex flex-col gap-2">
                                        <p className="font-bold text-sm">Due hour (optional)</p>
                                        <TimePicker date={editAssignmentTime} onChange={setEditAssignmentTime} />
                                    </div>
                                </div>
                            </div>

                            {
                                editedAssignment?.title && newAssignmentDate &&
                                <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-full">Edit Assignment</Button>
                            }
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}