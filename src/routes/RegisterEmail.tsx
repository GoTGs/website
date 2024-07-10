import { useState, Suspense } from 'react';

// import { useNavigate } from 'react-router-dom'

import BurningPage from '../components/animations/BurningPage';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function RegisterEmail() {
    // const navigate = useNavigate();

    const [email, setEmail] = useState('')

    const handleSignUp = (e: any) => {
        e.preventDefault()

        if (!email) {
            return;
        }
        
        // navigate('/register/finish?email=' + email)
        window.location.href = '/register/finish?email=' + email
    }

    return (
        <>
            <div className="bg-background-900 min-h-screen min-w-screen flex">
                <div className='w-1/2 h-full max-lg:hidden'>
                    <Suspense>
                        <BurningPage/>
                    </Suspense>
                </div>
                <div className='bg-background-950 min-h-full w-1/2 flex items-center justify-center relative max-lg:w-full'>
                    <Button onClick={() => window.location.href = "/login"} className='absolute top-8 right-8 bg-secondary-800 hover:bg-secondary-900 px-8 py-6 text-text-50 font-bold text-xl'>Login</Button>
                    <div className='w-[40%] flex flex-col gap-5'>
                        <div className='flex flex-col gap-3 items-center'>
                            <h1 className='text-text-50 font-bold text-3xl'>Create an account</h1>
                            <p className='text-text-400'>Enter your email below to create your account</p>
                        </div>
                        <form onSubmit={handleSignUp} className='w-full flex flex-col gap-5'>
                            <Input onChange={(e) => {setEmail(e.target.value)}} type='email' placeholder='Enter email' className='text-white focus:outline-none border-text-400'/>
                            <Button type="submit" className='bg-secondary-800 hover:bg-secondary-900 w-full px-8 py-6 text-text-50 font-bold  text-xl'>Sign up with Email</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}