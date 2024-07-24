import { useNavigate } from "react-router-dom"
import Spline from '@splinetool/react-spline';

import frendlyMeeting from '/humaaans-friend-meeting.png'
import alarm from '/alarm.png'
import folder from '/folders.png'
import dashboard from '/organized-dashboard.png'
import stats from '/stats.png'

import { Button } from "@/components/ui/button";

export default function Home() {
    const navigate = useNavigate()

    return (
        <>
            <div className="bg-background-900 min-h-screen min-w-screen relative pb-14">
                <div className="w-full fixed flex justify-center z-30 mt-10">
                    <div className="text-text-50 flex gap-8 max-w-fit bg-[#B7B4B450] backdrop-blur-xl px-6 py-4 rounded-full justify-center items-center max-sm:gap-0">
                        <Button variant="link" className="text-text-50 hover:text-text-200 font-semibold">About Us</Button>
                        <Button variant="link" className="text-text-50 hover:text-text-200 font-semibold">For Students</Button>
                        <Button variant="link" className="text-text-50 hover:text-text-200 font-semibold">For Teachers</Button>

                        <div className="flex gap-2">
                            <Button onClick={() => navigate('/register')} className="bg-primary-700 hover:bg-primary-800 text-text-50">Register</Button>
                            <Button onClick={() =>navigate('/login')} className="bg-secondary-700 hover:bg-secondary-800 text-text-50">Login</Button>
                        </div>
                    </div>
                </div>

                <div className="min-h-screen min-w-screen relative flex justify-center items-center flex-col gap-5">
                    <h1 className="text-8xl font-bold z-20 text-text-200 text-center">Submit, Track, and Excel with Ease</h1>

                    <div className="z-20 relative after:absolute after:top-0 after:left-0 after:w-[110%] after:h-[110%] after:-translate-x-2 after:-translate-y-[2px] after:bg-accent-200 after:z-[-1] after:blur-xl">
                        <Button onClick={() => navigate('/register')} className="bg-accent-300 hover:bg-accent-400 text-xl font-bold z-20 text-text-800 px-8 py-6">{'Get Started'.toUpperCase()}</Button>
                    </div>

                    <Spline className="absolute top-0 left-0 right-0 bottom-0 max-lg:hidden" scene="https://prod.spline.design/ql3H9YcnGmWgBqUN/scene.splinecode" />
                </div>


                <div className="flex flex-col gap-24">
                    <div className="w-full flex justify-center max-md:flex-col items-center text-text-50 gap-12 mt-24 p-6  bg-background-800" id="aboutus">
                        <img className="w-1/3" src={frendlyMeeting} alt="" />

                        <div className="flex gap-3 flex-col">
                            <h1 className="text-4xl font-bold max-md:text-center">About Us</h1>
                            <p className="max-w-[80ch] text-lg max-md:text-center">Your ultimate platform for submitting and managing homework online. Designed for students and teachers, our intuitive interface ensures a seamless and efficient experience</p>
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center flex-col text-text-50 gap-12" id="forstudents">
                        <h1 className="text-4xl font-bold">For Students</h1>

                        <div className="flex gap-20 max-md:flex-col">
                            <div className="flex flex-col gap-5">
                                <div className="flex-col flex gap-5 justify-center items-center">
                                    <p className="max-w-[80ch] text-center font-bold text-xl">Easy Submission</p>
                                    <img src={folder} className="w-1/4" alt="" />
                                    <p className="max-w-[80ch] text-center">Upload your assignments in various formats quickly and securely</p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex-col flex gap-4 justify-center items-center">
                                    <p className="max-w-[80ch] text-center font-bold text-xl">Deadline Reminders</p>
                                    <img src={alarm} className="w-1/4" alt="" />
                                    <p className="max-w-[80ch] text-center">Never miss a due date with our timely notifications</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex justify-center items-center flex-col text-text-50 gap-12" id="forteachers">
                        <h1 className="text-4xl font-bold">For Teachers</h1>

                        <div className="flex gap-20 flex-col">
                            <div className="flex flex-col gap-5">
                                <div className="flex gap-2 justify-center items-center max-md:flex-col">
                                    <img src={stats} alt="" />
                                    <div className="flex flex-col gap-2">
                                        <p className="max-w-[80ch] max-md:text-center font-bold text-xl">Streamlined Grading</p>
                                        <p className="max-w-[80ch] max-md:text-center">Access and evaluate student submissions from any device</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-5">
                                <div className="flex gap-2 justify-center items-center max-md:flex-col-reverse">
                                    <div className="flex flex-col gap-2">
                                        <p className="max-w-[80ch font-bold text-end text-xl max-md:text-center">Organized Workflow</p>
                                        <p className="max-w-[80ch] text-end max-md:text-center">Manage classes and assignments effortlessly with our organized dashboard</p>
                                    </div>
                                    <img src={dashboard} className="scale-90" alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}