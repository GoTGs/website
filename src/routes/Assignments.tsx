import { useEffect, useState, useCallback } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import moment from "moment"

import AssignmentsTable from "@/components/AssignmentsTable"
import FileEntry from "@/components/FileEntry"

import { classroomAPI } from "@/apis/classroomAPI"
import { userAPI } from "@/apis/userAPI"
import { assignmentAPI, AssignmentCreateDataType } from "@/apis/assignmentAPI"
import { useDropzone } from 'react-dropzone'

import { CalendarIcon } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"

export default function Assignments() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const [isNewAssignmentDialogOpen, setIsNewAssignmentDialogOpen] = useState<boolean>(false)
    const [filter, setFilter] = useState<string>('all')

    const [newAssignment, setNewAssignment] = useState<{title: string, description: string}>( {title: '', description: '' })
    const [newAssignmentDate, setNewAssignmentDate] = useState<Date | undefined>(undefined)

    const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
    
    const {data: classsroom, isLoading: isLoadingClassroom} = useQuery({
        queryKey: ['classroom', searchParams.get('id')],
        queryFn: () => classroomAPI.getClassroom(searchParams.get('id')),
    })
    
    const {data: user, isLoading: isLoadingUser} = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })
    
    const {data: assignments, isLoading: isLoadingAssignments} = useQuery({
        queryKey: ['assignments', searchParams.get('id')],
        queryFn: () => assignmentAPI.getAssignments(searchParams.get('id')),
    })
    
    const createAssignmentMutataion = useMutation({
        mutationFn: assignmentAPI.createAssignment,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['assignments', searchParams.get('id')]})
            toast({
                title: 'Assignment created',
                description: 'The assignment has been created',
            })
        },
        onError: (error) => {
            toast({
                // @ts-ignore
                title: error.response.data.data,
                variant: 'destructive',
            })
        }
    })

    const onDrop  = useCallback((file: any) => {
        for (let i = 0; i < file.length; i++) {
            const element = file[i]; 

            setUploadedFiles(prev => { return [...prev, element] })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({onDrop})

    useEffect(() => {
        if (!searchParams.has('id')) {
            navigate('/dashboard')
        }
    }, [])

    const handleFilterSelect = (e: any) => {
        setFilter(e.target.value)
    }

    const handleNewAssignmentOnChange = (e: any) => {
        setNewAssignment({...newAssignment, [e.target.name]: e.target.value})
    }

    const handleNewAssignmentSubmit = (e: any) => {
        e.preventDefault()

        if (newAssignment.title === '' || newAssignmentDate === undefined) {
            return
        }

        const newAssignmentData: AssignmentCreateDataType = {
            title: newAssignment.title,
            description: newAssignment.description,
            dueDate: moment(newAssignmentDate).format('DD-MM-YYYY')
        }

        createAssignmentMutataion.mutate({classroomId: searchParams.get('id'), data: newAssignmentData})

        setNewAssignment({title: '', description: ''})
        setNewAssignmentDate(undefined)

        setIsNewAssignmentDialogOpen(false)
    }

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative flex-col items-center">
                <div className="flex flex-col w-[90%] gap-8">
                    <div>
                        <Breadcrumb className="mt-16 ml-[-10px]">
                            <BreadcrumbList className="text-text-50">
                                <BreadcrumbItem>
                                    <BreadcrumbLink onClick={() => navigate('/dashboard')} className="text-lg">Dashboard</BreadcrumbLink> 
                                </BreadcrumbItem>
                                <BreadcrumbSeparator><p className="text-2xl -translate-y-1 text-text-50">/</p></BreadcrumbSeparator>
                                <BreadcrumbItem>
                                    {!isLoadingClassroom? 
                                    <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">{classsroom?.name}</BreadcrumbPage>: 
                                    <Skeleton className="w-[100px] h-6 bg-[#88888850] rounded-lg" />
                                    }
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>


                        <h1 className="text-text-300 text-lg mt-2">Your assignments</h1>
                    </div>

                    <div className="relative flex w-full text-text-50">
                        <div className="flex">
                                <Label htmlFor="all" className="cursor-pointer border-y border-l border-text-300 rounded-l-md">
                                    <input onChange={handleFilterSelect} type="radio" value="all" id="all" className="hidden" name="filter" checked={filter === 'all'} />
                                    <div className="label-checked:bg-background-800 hover:bg-background-700 p-3 rounded-l-md">All</div>
                                </Label>

                                <Label htmlFor="completed" className="cursor-pointer border-y border-text-300">
                                    <input onChange={handleFilterSelect} type="radio" value="completed" id="completed" name="filter" className="hidden" checked={filter === 'completed'} />
                                    <div className="label-checked:bg-background-800 hover:bg-background-700 p-3">Completed</div>
                                </Label>

                                <Label htmlFor="todo" className="cursor-pointer border-y border-r border-text-300 rounded-r-md">
                                    <input onChange={handleFilterSelect} type="radio" value="todo" id="todo" name="filter" className="hidden" checked={filter === 'todo'} />
                                    <div className="label-checked:bg-background-800 p-3 rounded-r-md hover:bg-background-700">Todo</div>
                                </Label>
                        </div>

                        {
                            !isLoadingUser && 
                            user?.role === 'admin' || user?.role === 'teacher'?
                            <div className="absolute right-0 flex gap-3 max-sm:flex-col">
                                <Button onClick={() => {setIsNewAssignmentDialogOpen(true)}} className="text-text-50 px-6 py-4 bg-primary-700 hover:bg-primary-800">New Assignment</Button>
                                <Button onClick={() => navigate(`/members?roomId=${searchParams.get('id')}`)} className="text-text-50 px-6 py-4 bg-primary-700 hover:bg-primary-800">Members</Button>
                            </div>: null
                        }
                    </div>

                    {
                        !isLoadingAssignments &&
                        <AssignmentsTable assignments={assignments} className="pb-5 max-sm:mt-6"/>
                    }
                </div>
            </div>

            <Dialog open={isNewAssignmentDialogOpen} onOpenChange={setIsNewAssignmentDialogOpen} >                        
                <DialogContent className="bg-background-950 text-text-50 min-w-[60%] min-h-[60%]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Create new assignment</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleNewAssignmentSubmit} className="mt-4 flex w-full justify-center">
                        <div className="w-[90%] flex flex-col gap-5">
                            <div className="w-full flex flex-col gap-3">
                                <Input onChange={handleNewAssignmentOnChange} placeholder="Enter assignment title" name="title" className="text-text-50" />

                                <div>
                                    <Textarea onChange={handleNewAssignmentOnChange} name="description" placeholder="Enter assignment discription" className="resize-none text-text-50 text-md border-b-none rounded-b-none" rows={12}/>

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

                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="relative flex justify-center w-1/3">
                                                {
                                                newAssignmentDate? 
                                                <span className="absolute left-2 text-text-50 font-semibold">{newAssignmentDate.toDateString()}</span>:
                                                <span className="absolute left-2 text-text-500 font-semibold">Pick a due date</span>
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
                            </div>
                            <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-full">New Assignment</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}