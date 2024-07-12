import { useNavigate } from 'react-router-dom'

import BurningPage from '../components/animations/BurningPage';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

export default function Login() {
    const navigate = useNavigate();

    return (
        <>
            <div className="bg-background-900 min-h-screen min-w-screen flex">
                <div className='w-1/2 h-full max-lg:hidden'>
                    <BurningPage />
                </div>
                <div className='bg-background-950 min-h-full w-1/2 flex items-center justify-center relative max-lg:w-full'>

                    <Button onClick={() => navigate("/register")} className='absolute top-8 right-8 bg-secondary-800 hover:bg-secondary-900 px-8 py-6 text-text-50 font-bold text-xl'>Register</Button>
                    <div className='w-[40%] flex flex-col gap-5'>
                        <div className='flex flex-col gap-3 items-center'>
                            <h1 className='text-text-50 font-bold text-3xl text-center'>Login</h1>
                            <p className='text-text-400 text-center'>Enter email and password to login to your account</p>
                        </div>
                        <form className='flex flex-col gap-5'>
                            <div className='flex gap-3 flex-col'>
                                <Input type='email' placeholder='Enter password' className='text-white focus:outline-none border-text-400'/>
                                <Input type='password' placeholder='Confirm password' className='text-white focus:outline-none border-text-400'/>
                            </div>
                            <Button type='submit' className='bg-secondary-800 hover:bg-secondary-900 px-8 py-6 text-text-50 font-bold  text-xl'>Login</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}