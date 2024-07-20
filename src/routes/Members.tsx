import { useEffect, useState } from "react"

import { useQuery } from "@tanstack/react-query"
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

export default function Members() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [addMemberDialogOpen, setAddMemberDialogOpen] = useState<boolean>(false)
    const [addMemberEmail, setAddMemberEmail] = useState<string>('')

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

    const {data: allUsers, isLoading: isLoadingUsers} = useQuery({
        queryKey: ['allUsers'],
        queryFn: userAPI.getUsers,
    })

    const filteredUsers = !isLoadingUsers && allUsers?.filter((user) => user.email.toLowerCase().includes(addMemberEmail.toLowerCase()))
    console.log(filteredUsers)
 
    useEffect(() => {
        if (!searchParams.has('roomId')) {
            navigate('/dashboard')
        }

        if(user?.role === 'student') {
            navigate('/dashboard')
        }
    }, [user])
    
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
                        <Input placeholder="Search for a member. Enter email" className="w-1/4"/>

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
                            members?.map(member => (
                                member?.role !== 'admin') && 
                                <MemberEntry key={member?.id} firstName={member?.first_name} lastName={member.last_name} email={member.email} role={member.role} id={member.id} isAdmin={user?.role === 'admin'}/>
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

                    <form className="mt-4 flex w-full justify-center items-center">
                        <div className="flex flex-col gap-3 w-[80%]">
                            <Input onChange={(e) => setAddMemberEmail(e.target.value)} placeholder="Enter member email" /> 
                            <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-full">Confirm</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}