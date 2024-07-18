import { useEffect, useState } from "react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"

import Nav from "@/components/Nav"

import { userAPI } from "@/apis/userAPI"
import { authenticationAPI, SignUpData } from "@/apis/authenticationAPI"

import { Menu, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"


export default function Profile() {
    const queryClient = useQueryClient()    
    const { toast } = useToast()
    const navigate = useNavigate()

    const [menuOpen, setMenuOpen] = useState(false)

    const [newUser, setNewUser] = useState<{first_name?: string, last_name?: string, email?: string} | {first_name?: string, last_name?: string, email?: string, password?: string, confirmPassword?: string} | null>(null)

    const [isPasswordChangeDiologOpened, setIsPasswordChangeOpened] = useState<boolean>(false)
    const [isConfirmPasswordOppend, setIsConfirmPasswordOppend] = useState<boolean>(false)

    const [userCredentials, setUserCredentials] = useState<SignUpData | null>(null)


    const {data: user, isLoading, isSuccess, error } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })

    const updateUserMutation = useMutation({
        mutationFn: userAPI.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user'] })
        },
        onError: (error: any) => {
            // @ts-ignore
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/')
            }

            toast({
                variant: "destructive",
                title: error.response.data.data,
            })            
        }
    })

    const loginMutation = useMutation({
        mutationFn: authenticationAPI.signIn,
        onSuccess: (data) => { 
            localStorage.setItem('token', data.token)
            setIsPasswordChangeOpened(false)
            setIsConfirmPasswordOppend(true)
        },
        onError: (error: any) => {
            // @ts-ignore
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/')
            }

            toast({
                variant: "destructive",
                title: error.response.data.data,
            })            
        }
    })

    useEffect(() => {
        if (error) {
            // @ts-ignore
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                navigate('/')
            }
        }

        setNewUser({
            first_name: user?.first_name,
            last_name: user?.last_name,
            email: user?.email
        })
    }, [isSuccess])

    const onUserChange = (e: any) => {
        setNewUser(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = (e: any) => {
        e.preventDefault()

        updateUserMutation.mutate(newUser)
    }

    const onUserCredentalsChange = (e: any) => {
        setUserCredentials(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const onLoginSubmition = (e: any) => {
        e.preventDefault()

        if(!userCredentials) {
            toast({
                variant: "destructive",
                title: "Please enter email and password",
            })
            
            return
        }
 
        loginMutation.mutate(userCredentials)
    }

    const onPasswordChange = (e: any) => {
        e.preventDefault()

        // @ts-ignore
        if (!newUser?.password || !newUser?.confirmPassword) {
            toast({
                variant: "destructive",
                title: "Please enter password and confirm password",
            })
            
            return
        }

        // @ts-ignore
        if (newUser?.password !== newUser?.confirmPassword) { 
            toast({
                variant: "destructive",
                title: "Passwords do not match",
            })
            
            return
        }

        updateUserMutation.mutate(newUser)
        setIsConfirmPasswordOppend(false)
        localStorage.removeItem('token')
        navigate('/')
    }

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative">
                <Menu onClick={() => {setMenuOpen(true)}} className="lg:hidden absolute w-12 h-12 top-3 text-text-50 hover:scale-105 active:scale-100 cursor-pointer left-4 z-10"/>
                {menuOpen && <Plus onClick={() => {setMenuOpen(false)}} className="lg:hidden rotate-45 absolute w-12 h-12 top-5 text-text-50 hover:scale-105 active:scale-100 cursor-pointer right-5 z-30"/>}
                <Nav className={`${!menuOpen? "max-lg:hidden": ""}`}/>

                <div className="w-5/6 flex flex-col items-center gap-8 overflow-x-hidden">
                    <div className="w-[80%] pt-10 mt-16">
                        <h1 className="text-text-100 font-bold text-3xl">Profile</h1>

                        {!isLoading && <form onSubmit={onSubmit} className="mt-16 flex w-full gap-10">
                            <div className="flex flex-col gap-5 w-1/2">
                                <div className="flex gap-2 w-full">
                                    <div className="w-full">
                                        <Label htmlFor="fname" className="text-text-50 font-bold">First Name</Label>
                                        <Input onChange={onUserChange} placeholder="Enter new first name" name="first_name" id="fname" className="text-text-50" value={newUser?.first_name}/>
                                    </div>
                                    <div className="w-full">
                                        <Label htmlFor="last_name" className="text-text-50 font-bold">Last Name</Label>
                                        <Input onChange={onUserChange} placeholder="Enter new last name" name="last_name" id="last_name" className="text-text-50" value={newUser?.last_name}/>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-text-50 font-bold">Email</Label>
                                    <Input onChange={onUserChange} placeholder="Enter new email" name="email" id="email" className="text-text-50" value={newUser?.email}/>
                                </div>

                                <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold">Update Profile</Button>
                                <Button onClick={() => {setIsPasswordChangeOpened(true)}} variant="destructive" className="w-full bg-[#e74c4c] hover:bg-[#b43c3c] text-text-50 font-bold" >Change Password</Button>
                                <Button onClick={() => {localStorage.removeItem('token'); navigate('/')}} variant="destructive" className="w-full bg-[#e74c4c] hover:bg-[#b43c3c] text-text-50 font-bold" >Log out</Button>
                            </div>

                            <div className="w-1/2 flex justify-center items-center flex-col">
                                <img className="w-1/2 rounded-full" src={`https://ui-avatars.com/api/?name=${user?.first_name + ' ' + user?.last_name}&size=256&background=60494d&color=fff&bold=true`}/>
                            </div>
                        </form>}
                    </div> 
                </div>
            </div>

            <Dialog open={isPasswordChangeDiologOpened}>
                <DialogContent className="w-full flex justify-center items-center flex-col bg-background-950 text-text-50">
                    <DialogHeader>
                        <DialogTitle>Login to change password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onLoginSubmition} className="w-[80%] justify-center items-center flex gap-2 flex-col">
                        <Input onChange={onUserCredentalsChange} placeholder="Enter email" name="email"/>
                        <Input type="password" onChange={onUserCredentalsChange} placeholder="Enter password" name="password"/>

                        <div className="flex gap-2 w-full">
                            <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-1/2">Login</Button>
                            <Button onClick={(e) => {e.preventDefault(); setIsPasswordChangeOpened(false)}} className="bg-[#e74c4c] hover:bg-[#b43c3c] text-text-50 font-semibold w-1/2">Close</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isConfirmPasswordOppend}>
                <DialogContent className="w-full flex justify-center items-center flex-col bg-background-950 text-text-50">
                    <DialogHeader>
                        <DialogTitle>Enter your new password</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={onPasswordChange} className="w-[80%] justify-center items-center flex gap-2 flex-col">
                        <Input type="password" onChange={onUserChange} placeholder="Enter new password" name="password"/>
                        <Input type="password" onChange={onUserChange} placeholder="Confirm new password" name="confirmPassword"/>

                        <div className="flex gap-2 w-full">
                            <Button type="submit" className="bg-primary-700 text-text-50 hover:bg-primary-800 font-semibold w-1/2">Confirm</Button>
                            <Button onClick={(e) => {e.preventDefault(); setIsConfirmPasswordOppend(false)}} className="bg-[#e74c4c] hover:bg-[#b43c3c] text-text-50 font-semibold w-1/2">Close</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}