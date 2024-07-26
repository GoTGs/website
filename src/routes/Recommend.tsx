import { useState } from "react"

import { useQuery, useMutation } from "@tanstack/react-query"

import Nav from "@/components/Nav"

import { userAPI } from "@/apis/userAPI"
import { aiAPI } from "@/apis/aiAPI"

import { Bars } from "react-loader-spinner"
import { Menu, Plus } from "lucide-react"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export default function Recommend() {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [text, setText] = useState<string>('')
    const [response, setResponse] = useState<string>('')

    const {data: user } = useQuery({
        queryKey: ['user'],
        queryFn: userAPI.getUser,
    })

    const aiMutation = useMutation({
        mutationFn: aiAPI.getRecommendation,
        onSuccess: (res) => {
            // @ts-ignore
            setResponse(res.data.response)
        }
    })


    const handleSubmit = (e: any) => {
        e.preventDefault()
        aiMutation.mutate(text)
    }

    return (
        <>
            {
                false?
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

            <div className="bg-background-950 min-h-screen min-w-screen flex relative justify-center">
                <Menu onClick={() => {setMenuOpen(true)}} className="lg:hidden absolute w-12 h-12 top-3 text-text-50 hover:scale-105 active:scale-100 cursor-pointer left-4"/>
                {menuOpen && <Plus onClick={() => {setMenuOpen(false)}} className="lg:hidden rotate-45 absolute w-12 h-12 top-5 text-text-50 hover:scale-105 active:scale-100 cursor-pointer right-5 z-30"/>}
                <Nav role={user?.role} className={`min-h-screen ${!menuOpen? "max-lg:hidden": ""}`}/>


                <div className="w-5/6 flex flex-col items-center gap-8 overflow-x-hidden">
                    <div className="w-[80%] pt-10 mt-16">
                        <h1 className="text-text-100 font-bold text-3xl">Generate Assignment</h1>

                        <form onSubmit={handleSubmit} className="flex gap-5 mt-20 flex-col">
                            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter prompt" className="resize-none text-text-50 text-lg bg-background-900" rows={5}/>
                            <Button type="submit" className="bg-primary-700 hover:bg-primary-800 text-text-50 font-bold text-xl">Generate</Button>
                        </form>

                            {
                                !aiMutation.isPending?
                                <p className="text-justify">{response}</p>:
                                <Skeleton className="w-full h-6 bg-[#88888850] rounded-lg" />
                            }
                    </div>
                </div>
            </div> 
        </>
    )
}