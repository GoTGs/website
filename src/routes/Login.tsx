import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query';

import { authenticationAPI } from '@/apis/authenticationAPI';

import BurningPage from '../components/animations/BurningPage';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from "@/components/ui/use-toast"

import { Bars } from 'react-loader-spinner';

export default function Login() {
    const navigate = useNavigate();
    const { toast } = useToast()

    const [ userData, setUserData ] = useState<{email: string, password: string} | null>(null)

    const loginUserMutation = useMutation({
        mutationFn: authenticationAPI.signIn,
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            window.location.href = "/dashboard"
        },
        onError: (error: any) => {
            toast({
                variant: "destructive",
                title: error.response.data.data,
            })            
        }
    })

    useEffect(() => {
        if (localStorage.getItem('token')) {
            navigate("/dashboard")
        }
    }, [])

    const handleUserCredentials = (e: any) => {
        setUserData(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const handleLogin = (e: any) => {
        e.preventDefault()

        if (!userData?.email || !userData?.password) {
            toast({
                variant: "destructive",
                title: "Please enter email and password",
            })

            return
        }

        loginUserMutation.mutate(userData)
    }

    return (
        <>
            {
                loginUserMutation.isPending?
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

            <div className="bg-background-900 min-h-screen min-w-screen flex">
                <div className='w-1/2 h-full max-lg:absolute max-lg:left-[-1000px]'>
                    <BurningPage />
                </div>
                <div className='bg-background-950 min-h-full w-1/2 flex items-center justify-center relative max-lg:w-full'>

                    <Button variant="outline" onClick={() => navigate("/register")} className='absolute top-8 right-8 hover:bg-secondary-900 px-8 py-6 text-text-50 font-bold text-xl'>Register</Button>
                    <div className='w-[40%] flex flex-col gap-5'>
                        <div className='flex flex-col gap-3 items-center'>
                            <h1 className='text-text-50 font-bold text-3xl text-center'>Login</h1>
                            <p className='text-text-400 text-center'>Enter email and password to login to your account</p>
                        </div>
                        <form onSubmit={handleLogin} className='flex flex-col gap-5'>
                            <div className='flex gap-3 flex-col'>
                                <Input onChange={handleUserCredentials} type='email' name='email' placeholder='Enter email' className='text-white focus:outline-none border-text-400'/>
                                <Input onChange={handleUserCredentials} type='password' name='password' placeholder='Enter password' className='text-white focus:outline-none border-text-400'/>
                            </div>
                            <Button type='submit' className='bg-primary-800 hover:bg-primary-900 px-8 py-6 text-text-50 font-bold  text-xl'>Login</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}