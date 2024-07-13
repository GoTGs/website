import { useEffect, useState } from 'react'

import { useSearchParams, useNavigate } from 'react-router-dom'

import BurningPage from '../components/animations/BurningPage';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

import { ArrowLeft } from 'lucide-react'

export default function RegisterFinish() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [ userData, setUserData ] = useState<{email: string, password: string, confirmPassword: string} | null>(null)

    useEffect(() => {
        if (!searchParams.has('email')){
            navigate('/register')
        }

        setUserData({email: searchParams.get('email')!, password: '', confirmPassword: ''})
    }, [])

    const handlePassword = (e: any) => {
        setUserData(prev => ({
            ...prev!,
            [e.target.name]: e.target.value
        }))
    }

    const handleFinish = (e: any) => {
        e.preventDefault()

        if (!userData?.password || !userData?.confirmPassword) return;

        if (userData.password !== userData.confirmPassword) return;

        console.log(userData)
    }

    return (
        <>
            <div className="bg-background-900 min-h-screen min-w-screen flex">
                <div className='w-1/2 h-full max-lg:absolute max-lg:left-[-1000px]'>
                    <BurningPage />
                </div>
                <div className='bg-background-950 min-h-full w-1/2 flex items-center justify-center relative max-lg:w-full'>
                    <ArrowLeft onClick={() => navigate("/register")} className='absolute left-5 top-8 text-text-50 w-16 h-16 hover:scale-105 active:scale-100 duration-100 cursor-pointer'/>

                    <Button onClick={() => navigate("/login")} className='absolute top-8 right-8 bg-secondary-800 hover:bg-secondary-900 px-8 py-6 text-text-50 font-bold text-xl'>Login</Button>
                    <div className='w-[40%] flex flex-col gap-5'>
                        <div className='flex flex-col gap-3 items-center'>
                            <h1 className='text-text-50 font-bold text-center text-3xl'>Finish account</h1>
                            <p className='text-text-400 text-center'>Enter password to finilize account</p>
                        </div>
                        <form onSubmit={handleFinish} className='flex flex-col gap-5'>
                            <div className='flex gap-3 flex-col'>
                                <Input onChange={handlePassword} name='password' type='password' placeholder='Enter password' className='text-white focus:outline-none border-text-400'/>
                                <Input onChange={handlePassword} name='confirmPassword' type='password' placeholder='Confirm password' className='text-white focus:outline-none border-text-400'/>
                            </div>
                            <Button type='submit' className='bg-secondary-800 hover:bg-secondary-900 px-8 py-6 text-text-50 font-bold  text-xl'>Finish account</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}