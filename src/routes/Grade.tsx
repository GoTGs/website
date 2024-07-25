import { useEffect, useState } from "react"

import { useNavigate, useSearchParams } from "react-router-dom"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"

import { classroomAPI } from "@/apis/classroomAPI"
import { assignmentAPI, GradeSubmissionDataType } from "@/apis/assignmentAPI"
import { userAPI } from "@/apis/userAPI"

import FileEntry from "@/components/FileEntry"

import { ClockIcon, GraduationCap } from "lucide-react"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Bars } from "react-loader-spinner"

export default function Grade() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient()
    const {toast} = useToast()

    const [isViewDialogOpen, setIsViewDialogOpen] = useState<boolean>(false)
    const [selectedUserSubmission, setSelectedUserSubmission] = useState<string | null>(null)
    const [selectedSubmissions, setSelectedSubmissions] = useState<{submission: GradeSubmissionDataType}[]>([])
    const [searchUserEmail, setSearchUserEmail] = useState<string | null>('')
    const [grade, setGrade] = useState<number>(0)
    const [feedbackText, setFeedbackText] = useState<string>('')
    const [userId, setUserId] = useState<string>('')
    const [deleteGradeId, setDeleteGradeId] = useState<string>('')
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

    const [editedGrade, setEditedGrade] = useState<{feedback: string, grade: number} | null>(null)

    const {data: classsroom, isLoading: isLoadingClassroom} = useQuery({
        queryKey: ['classroom', searchParams.get('assignmentId')],
        queryFn: () => classroomAPI.getClassroom(searchParams.get('roomId')),
    })

    const {data: assignment, isLoading: isLoadingAssignment} = useQuery({
        queryKey: ['assignment', searchParams.get('assignmentId')],
        queryFn: () => assignmentAPI.getAssignment(searchParams.get('assignmentId')),
    })

    const {data: user } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })

    const {data: allSubmissions, isLoading: isLoadingSubmissions} = useQuery({
        queryKey: ['submissions', searchParams.get('assignmentId')],
        queryFn: () => assignmentAPI.getAllSubmissions(searchParams.get('assignmentId')),
    })

    const gradeMutation = useMutation({
        mutationFn: assignmentAPI.addGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['submissions', searchParams.get('assignmentId')]})
            toast({
                title: 'Grade added',
                description: 'The grade has been added successfully',
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

    const deleteGradeMutation = useMutation({
        mutationFn: assignmentAPI.deleteGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['submissions', searchParams.get('assignmentId')]})
            toast({
                title: 'Grade deleted',
                description: 'The grade has been deleted successfully',
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

    const editMutation = useMutation({
        mutationFn: assignmentAPI.editGrade,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['submissions', searchParams.get('assignmentId')]})
            toast({
                title: 'Grade edited',
                description: 'The grade has been edited successfully',
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

    // setInterval(() => {
    //     queryClient.invalidateQueries({queryKey: ['submissions', searchParams.get('assignmentId')]})
    // }, 15000)

    let seen = new Set()
    const userSubmissions = allSubmissions?.filter(submission => {
        if(seen.has(submission.email)) {
            return false
        }

        seen.add(submission.email)
        return true
    })

    const filteredSubmissions = userSubmissions?.filter(submission => {
        return submission.email.includes(searchUserEmail || '')
    })

    useEffect(() => {
        if (!searchParams.has('assignmentId') || !searchParams.has('roomId')) {
            navigate('/dashboard')
        }
    }, [])

    useEffect(() => {
        if(user?.role === 'student') {
            navigate('/dashboard')
        }
    }, [user])

    useEffect(() => {
        if(!isViewDialogOpen) {
            setSelectedSubmissions([])
            setSelectedUserSubmission('')
        }
    }, [isViewDialogOpen])

    useEffect(() => {
        setSelectedSubmissions([])
        allSubmissions?.filter(submission => {
            if(submission.email === selectedUserSubmission) {
                // @ts-ignore
                setSelectedSubmissions(prev => [...prev, submission])
            }
        })

    }, [selectedUserSubmission, allSubmissions])

    const handleGradeOnSubmit = () => {
        gradeMutation.mutate({assignmentId: searchParams.get('assignmentId'), userId, grade, feedback: feedbackText})

        setGrade(0)
        setIsViewDialogOpen(false)
    }

    const deleteGrade = () => {
        deleteGradeMutation.mutate(deleteGradeId)
        setIsDeleteDialogOpen(false)
        setDeleteGradeId('')
    }

    const handleEdit = () => {
        // @ts-ignore
        editMutation.mutate({gradeId: selectedSubmissions[0].grade.id, grade: editedGrade?.grade, feedback: editedGrade?.feedback})
        // setIsViewDialogOpen(false)
    }

    return (
        <>
            {
                gradeMutation.isPending || deleteGradeMutation.isPending || editMutation.isPending?
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
                                    <BreadcrumbLink onClick={() => navigate(`/assignment?roomId=${searchParams.get('roomId')}&assignmentId=${searchParams.get('assignmentId')}`)} className="text-lg">{assignment?.title}</BreadcrumbLink>:
                                    <Skeleton className="w-[100px] h-6 bg-[#88888850] rounded-lg" />
                                }
                            </BreadcrumbItem>
                            <BreadcrumbSeparator><p className="text-2xl -translate-y-1 text-text-50">/</p></BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">Grade</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="relative flex w-full text-text-50">
                        <Input onChange={(e: any) => setSearchUserEmail(e.target.value)} placeholder="Search for a member. Enter email" className="w-1/4"/>
                    </div>

                    <div className="text-text-50 flex flex-col">
                            <div className="gap-10 flex text-text-300 border-text-300 border px-3 py-1 rounded-t-md font-semibold">
                                <h1 className="w-[1%] grow"></h1>
                                <h1 className="w-[1%] grow">First Name</h1>
                                <h1 className="w-[1%] grow">Last Name</h1>
                                <h1 className="w-[1%] grow">Email</h1>
                                <h1 className="w-[1%] grow">View Submission</h1>
                            </div>

                            {
                                !isLoadingSubmissions?
                                // @ts-ignore
                                filteredSubmissions?.map((submission) => (
                                    <div key={submission.submission.id} className="gap-10 flex p-3 text-text-50 border-text-300 border-x border-b items-center duration-100 transition-colors">
                                        <img className="h-[48px] w-[1%] grow" src={`https://ui-avatars.com/api/?name=${submission.firstName + ' ' + submission.lastName}&size=64&background=60494d&color=fff&bold=true&rounded=true`}/>
                                        <h1 className="w-[1%] grow">{submission.firstName}</h1>
                                        <h1 className="w-[1%] grow">{submission.lastName}</h1>
                                        <h1 className="w-[1%] grow">{submission.email}</h1>
                                        <div className="w-[1%] grow">
                                            <Button onClick={() => {
                                                setIsViewDialogOpen(true); 
                                                setSelectedUserSubmission(submission.email); 
                                                setUserId(submission.userId); 
                                                // @ts-ignore
                                                submission.grade && setEditedGrade({feedback: submission.grade.feedback, grade: submission.grade.grade})}} className="bg-primary-700 hover:bg-primary-800 transition-colors font-bold text-text-50 duration-150">View</Button>
                                        </div>
                                    </div>
                                )):
                                <Skeleton className="w-full h-10 bg-[#88888850]"/>
                            }
                        </div>
                </div>
            </div>

            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="bg-background-950 text-text-50 max-w-[80%] h-[80%] flex justify-start items-start flex-col gap-20 overflow-scroll">
                    <DialogHeader>
                        {
                            selectedUserSubmission && 
                            <DialogTitle className="text-2xl font-normal">
                                <span className="font-bold">{selectedUserSubmission}</span> submissions
                            </DialogTitle>
                        }
                    </DialogHeader>

                    <div className="flex flex-col justify-start items-start w-full">
                        {
                            selectedSubmissions.map((submission, index) => {
                                return (
                                    <>
                                        <div key={index} className="flex flex-col gap-5 text-text-50 mt-3 w-full">
                                            {submission.submission.text !== '' && <p className="text-justify">{submission.submission.text}</p>}

                                            <span className="flex gap-5">
                                                <ClockIcon/> 
                                                <p>{submission.submission.submission_time}</p>
                                            </span>

                                            <div  className="flex flex-col gap-1">
                                                {
                                                    submission.submission.files &&
                                                    submission.submission.files.map((file, index) => {
                                                        let fileName = file.split('/').at(-1)

                                                        if(file.includes('-')) {
                                                            fileName = fileName?.split('-').slice(1).join('-').replaceAll('%20', ' ')
                                                        } else {
                                                            fileName = fileName?.replaceAll("%20", " ")
                                                        }

                                                        return (
                                                            <FileEntry key={index} fileName={fileName} fileLink={file}/>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                        <span className="w-full mt-5 h-[1px] bg-text-300"></span>
                                    </>
                                )
                            })
                        }

                        {
                            // @ts-ignore
                            selectedSubmissions && selectedSubmissions[0] && !selectedSubmissions[0].grade &&
                            <span className="w-full mt-5 h-[1px] bg-text-300"></span>
                        }

                        {

                            // @ts-ignore
                            selectedSubmissions && selectedSubmissions[0] && !selectedSubmissions[0].grade &&
                            <div className="w-full flex flex-col gap-3">
                                <Textarea onChange={(e) => setFeedbackText(e.target.value)} placeholder="Enter feedback (optional)" className="resize-none text-text-50 text-lg bg-background-900" rows={5}/>
                                <Input onChange={(e) => {setGrade(e.target.valueAsNumber)}} value={grade} type="number" min={0} max={100} placeholder="*Enter percentage 0% - 100%" className="w-full"/>
                                <Button onClick={handleGradeOnSubmit} className="text-text-50 px-6 py-4 bg-primary-700 hover:bg-primary-800">Grade</Button>
                            </div>
                        }

                        {
                            // @ts-ignore
                            selectedSubmissions && selectedSubmissions[0] && selectedSubmissions[0].grade &&
                            <div className="w-full flex flex-col gap-3 mt-5">
                                <div className="flex gap-3">
                                    <GraduationCap />
                                    <p>Grade: {
                                            // @ts-ignore
                                            selectedSubmissions[0].grade.grade
                                        } 
                                    </p> 
                                </div>

                                <div className="flex gap-3">
                                    <GraduationCap />
                                    <p>Feedback: {
                                            // @ts-ignore
                                            selectedSubmissions[0].grade.feedback
                                        } 
                                    </p>
                                </div>

                                {
                                    <>
                                        <div className="w-full flex flex-col gap-3">
                                            <Textarea onChange={(e) => setEditedGrade(prev => ({...prev!, feedback: e.target.value}))} value={editedGrade?.feedback} placeholder="Enter feedback (optional)" className="resize-none text-text-50 text-lg bg-background-900" rows={5}/>
                                            <Input onChange={(e) => {setEditedGrade(prev => ({...prev!, grade: e.target.valueAsNumber}))}} value={editedGrade?.grade} type="number" min={0} max={100} placeholder="*Enter percentage 0% - 100%" className="w-full"/>
                                        </div>

                                        <div className="gap-2 flex flex-col">
                                            <Button onClick={handleEdit} className="text-text-50 w-full bg-primary-700 hover:bg-primary-800">Edit Grade</Button>
                                            {
                                                // @ts-ignore
                                                <Button onClick={() => {setDeleteGradeId(selectedSubmissions[0].grade.id); setIsDeleteDialogOpen(true)}} className="bg-[#e74c4c] w-full transition-colors font-bold text-text-50 hover:bg-[#b43c3c] duration-150">Delete grade</Button>
                                            }
                                        </div>
                                    </>
                                }
                            </div>
                        }
                    </div>

                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="bg-background-950 text-text-50">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">Confirm</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-5 justify-center items-center">
                        <p>Are you sure you want to delete assignment: <span className="font-bold">{assignment?.title}</span></p>
                        <div className="flex flex-col gap-2 w-[80%]">
                            <Button onClick={deleteGrade} className="bg-[#e74c4c] w-full transition-colors font-bold text-text-50 hover:bg-[#b43c3c] duration-150">YES</Button>
                            <Button onClick={() => {setIsDeleteDialogOpen(false)}} className="bg-secondary-700 w-full transition-colors font-bold text-text-50 hover:bg-secondary-800 duration-150">NO</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}