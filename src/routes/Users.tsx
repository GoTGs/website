import { useEffect, useState } from "react"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import MemberEntry from "@/components/MemberEntry"
import Nav from "@/components/Nav"

import { User, userAPI } from "@/apis/userAPI"

import { Menu, Plus } from "lucide-react"

import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Users() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    
    const [serachUserEmail, setSearchUserEmail] = useState<string>('')

    const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState<boolean>(false)
    const [isChangePasswordSelected, setIsChangePasswordSelected] = useState<boolean>(false)
 
    const [editUserId, setEditUserId] = useState<number | null>(null)
    const [editedUserInformation, setEditedUserInformation] = useState<User | null>(null)
    
    const {data: user, isLoading: isLoadingUser } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })

    const { data: allUsers } = useQuery({
        queryKey: ['allUsers'],
        queryFn: userAPI.getUsers,
    })

    const filteredUsers = allUsers?.filter((user) => user.email.toLowerCase().includes(serachUserEmail.toLowerCase()))
    
    const updateUserMutation = useMutation({
        mutationFn: userAPI.updateUserAdmin,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['allUsers']})
        },
        onError: (error: Error) => {
            toast({
                variant: "destructive",
                // @ts-ignore
                title: error.response.data.data,
            }) 
        }
    })

    // @ts-ignore
    const selectedUser: User = editUserId !== null? allUsers?.find((user) => user.id === editUserId): null
 
    useEffect(() => {
        if(user?.role === 'student') {
            navigate('/dashboard')
        }

        setEditedUserInformation(selectedUser)
    }, [editUserId])

    const handleUserInformationOnChange = (e: any) => {
        setEditedUserInformation(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const onRoleChange = (role: string) => {
        setEditedUserInformation(prev => ({
            ...prev!,
            role
        }))
    }

    const handleUserEdinOnSubmit = (e: any) => {
        e.preventDefault()

        // @ts-ignore
        updateUserMutation.mutate({data: editedUserInformation, userId: editUserId as string})
        
        setIsEditMemberDialogOpen(false)
    }

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative justify-center">
                <Menu onClick={() => {setMenuOpen(true)}} className="lg:hidden absolute w-12 h-12 top-3 text-text-50 hover:scale-105 active:scale-100 cursor-pointer left-4"/>
                {menuOpen && <Plus onClick={() => {setMenuOpen(false)}} className="lg:hidden rotate-45 absolute w-12 h-12 top-5 text-text-50 hover:scale-105 active:scale-100 cursor-pointer right-5 z-30"/>}
                <Nav role={user?.role} className={`min-h-screen ${!menuOpen? "max-lg:hidden": ""}`}/>

                <div className="flex flex-col w-5/6 gap-8 mt-28 items-center">
                    <div className="w-[90%] flex flex-col gap-5">
                        <div className="relative flex w-full text-text-50">
                            <Input onChange={(e) => setSearchUserEmail(e.target.value)} placeholder="Search for a member. Enter email" className="w-1/4"/>
                        </div>

                        <div className="text-text-50 flex flex-col">
                            <div className="gap-10 flex text-text-300 border-text-300 border px-3 py-1 rounded-t-md font-semibold">
                                <h1 className="w-[1%] grow"></h1>
                                <h1 className="w-[1%] grow">First Name</h1>
                                <h1 className="w-[1%] grow">Last Name</h1>
                                <h1 className="w-[1%] grow">Email</h1>
                                <h1 className="w-[1%] grow">Role</h1>
                                {!isLoadingUser && user?.role === 'admin' && <h1 className="w-[1%] grow">Edit Member</h1> }
                            </div>

                            {
                                !isLoadingUser &&
                                // @ts-ignore
                                filteredUsers?.map(member => (
                                    member?.role !== 'admin') && 
                                    <MemberEntry key={member?.id} firstName={member?.first_name} lastName={member.last_name} email={member.email} role={member.role} onEdit={() => {setIsEditMemberDialogOpen(true); setEditUserId(member?.id)}} isAdmin={user?.role === 'admin'}/>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={isEditMemberDialogOpen} onOpenChange={setIsEditMemberDialogOpen}>
                <DialogContent className="bg-background-950 text-text-50">
                    <DialogHeader>
                        <DialogTitle>Edit member</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleUserEdinOnSubmit} className="mt-4 flex w-full justify-center items-center">
                        <div className="flex flex-col w-[80%] relative gap-3">
                            <div className="flex gap-3">
                                <div>
                                    <Label htmlFor="fname" className="text-text-50 font-bold">First Name</Label>
                                    <Input onChange={handleUserInformationOnChange} value={editedUserInformation?.first_name} placeholder="Enter new first name" name="first_name" id="fname" className="text-text-50"/>
                                </div>
                                <div>
                                    <Label htmlFor="last_name" className="text-text-50 font-bold">Last Name</Label>
                                    <Input onChange={handleUserInformationOnChange} value={editedUserInformation?.last_name} placeholder="Enter new last name" name="last_name" id="last_name" className="text-text-50"/>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="email" className="text-text-50 font-bold">Email</Label>
                                <Input onChange={handleUserInformationOnChange} value={editedUserInformation?.email} placeholder="Enter new email" name="email" id="email" className="text-text-50" />
                            </div>

                            <div>
                                <Label htmlFor="role" className="text-text-50 font-bold">Role</Label>
                                <Select onValueChange={onRoleChange} value={editedUserInformation?.role} defaultValue="student" name="role">
                                    <SelectTrigger className="w-full">
                                        <SelectValue defaultValue="student" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background-900 text-text-50">
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {isChangePasswordSelected && <div>
                                <Label htmlFor="password" className="text-text-50 font-bold">Password</Label>
                                <Input onChange={handleUserInformationOnChange} type="password" placeholder="Enter new password" name="password" id="password" className="text-text-50" />
                            </div>}
                            
                            <Button onClick={(e) => {e.preventDefault(); setIsChangePasswordSelected(prev => !prev)}} className="bg-[#e74c4c] hover:bg-[#b43c3c] text-text-50 font-semibold w-full">Change Password</Button>
                            <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-full">Apply</Button>

                        </div>
                    </form>
                </DialogContent>                            
            </Dialog>
        </>
    )
}