import { useEffect, useState } from "react"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"

import MemberEntry from "@/components/MemberEntry"

import { userAPI } from "@/apis/userAPI"
import { classroomAPI } from "@/apis/classroomAPI"

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
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

export default function Members() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState<boolean>(false)
    const [addMemberEmail, setAddMemberEmail] = useState<string>('')

    const [serachUserEmail, setSearchUserEmail] = useState<string>('')
    
    const {data: classsroom, isLoading: isLoadingClassroom} = useQuery({
        queryKey: ['classroom', searchParams.get('assignmentId')],
        queryFn: () => classroomAPI.getClassroom(searchParams.get('roomId')),
    })
    
    const {data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })
    
    const {data: members, isLoading: isLoadingMembers} = useQuery({
        queryKey: ['members', searchParams.get('roomId')],
        queryFn: () => classroomAPI.getMembers(searchParams.get('roomId')),
    })

    const filteredMembers = !isLoadingMembers && members?.filter((member) => member.email.toLowerCase().includes(serachUserEmail.toLowerCase()))

    const {data: allUsers, isLoading: isLoadingUsers} = useQuery({
        queryKey: ['allUsers'],
        queryFn: userAPI.getUsers,
    })

    const addUserToClassroomMutation = useMutation({
        mutationFn: (email: string) => classroomAPI.addUserToClassroom(searchParams.get('roomId'), email),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', searchParams.get('roomId')] })
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                // @ts-ignore
                title: error.response.data.data,
            })
        }
    })

    const filteredUsers = !isLoadingUsers && allUsers?.filter((user) => user.email.toLowerCase().includes(addMemberEmail.toLowerCase()))
    
    const removeMemberFromClassroomMutation = useMutation({
        mutationFn: (userId: string) => classroomAPI.removeMemberFromClassroom(searchParams.get('roomId'), userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['members', searchParams.get('roomId')] })
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                // @ts-ignore
                title: error.response.data.data,
            })
        }
    })
 
    useEffect(() => {
        if (!searchParams.has('roomId')) {
            navigate('/dashboard')
        }

        if(user?.role === 'student') {
            navigate('/dashboard')
        }
    }, [user])

    const handleAddMember = (e: any) => {
        e.preventDefault()

        addUserToClassroomMutation.mutate(addMemberEmail)

        setAddMemberEmail('')
        setAddMemberDialogOpen(false)
    }
    
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
                                <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">Members</BreadcrumbPage> 
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="relative flex w-full text-text-50">
                        <Input onChange={(e) => setSearchUserEmail(e.target.value)} placeholder="Search for a member. Enter email" className="w-1/4"/>

                        {
                            !isLoadingUser && 
                            user?.role === 'admin' &&
                            <Button onClick={() => setAddMemberDialogOpen(true)} className="text-text-50 absolute right-0 px-6 py-4 bg-primary-700 hover:bg-primary-800">Add Member</Button>
                        }
                    </div>

                    <div className="text-text-50 flex flex-col">
                        <div className="gap-10 flex text-text-300 border-text-300 border px-3 py-1 rounded-t-md font-semibold">
                            <h1 className="w-[1%] grow"></h1>
                            <h1 className="w-[1%] grow">First Name</h1>
                            <h1 className="w-[1%] grow">Last Name</h1>
                            <h1 className="w-[1%] grow">Email</h1>
                            <h1 className="w-[1%] grow">Role</h1>
                            {!isLoadingUser && user?.role === 'admin' && <h1 className="w-[1%] grow">Remove Member</h1> }
                        </div>

                        {
                            !isLoadingMembers &&
                            // @ts-ignore
                            filteredMembers?.map(member => (
                                member?.role !== 'admin') && 
                                <MemberEntry key={member?.id} firstName={member?.first_name} lastName={member.last_name} email={member.email} role={member.role} onRemove={() => {removeMemberFromClassroomMutation.mutate(member?.id)}} isAdmin={user?.role === 'admin'}/>
                            )
                        }
                    </div>
                </div>
            </div>

            <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
                <DialogContent className="bg-background-950 text-text-50">
                    <DialogHeader>
                        <DialogTitle>Add member to classroom</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleAddMember} className="mt-4 flex w-full justify-center items-center">
                        <div className="flex flex-col w-[80%] relative">
                            <Input onChange={(e) => setAddMemberEmail(e.target.value)} value={addMemberEmail} placeholder="Enter member email" className={`${addMemberEmail.length > 0 && !addMemberEmail.includes('@') && 'border-b-0 rounded-b-none'}`} /> 

                            <div className="relative w-full mb-3">

                                { 
                                    addMemberEmail.length > 0 &&
                                    !addMemberEmail.includes('@') &&
                                    <div className="absolute flex flex-col w-full border-white border-[1px] border-t-0">
                                        {
                                            // @ts-ignore
                                            !isLoadingUsers && filteredUsers?.map((user: any) => {
                                                return (
                                                    <div onClick={() => setAddMemberEmail(user.email)} key={user?.id} className="bg-background-900 hover:bg-background-950 flex w-full cursor-pointer px-6 py-2">
                                                        <h1 className="grow">{user?.email}</h1>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                }

                            </div>

                            <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-full">Confirm</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}