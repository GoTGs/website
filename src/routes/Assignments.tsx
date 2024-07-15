import { useEffect } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"


export default function Assignments() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    useEffect(() => {
        if (!searchParams.has('id')) {
            navigate('/dashboard')
        }
    }, [])

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative flex-col items-center">
                <div className="flex flex-col w-[90%]">
                    <Breadcrumb className="mt-16 ml-[-10px]">
                        <BreadcrumbList className="text-text-50">
                            <BreadcrumbItem>
                                <BreadcrumbLink onClick={() => navigate('/dashboard')} className="text-lg">Dashboard</BreadcrumbLink> 
                            </BreadcrumbItem>
                            <BreadcrumbSeparator><p className="text-2xl -translate-y-1 text-text-50">/</p></BreadcrumbSeparator>
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-lg text-text-50 font-semibold px-2">Methematics</BreadcrumbPage> 
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>


                    <h1 className="text-text-300 text-lg mt-2">Your assignments</h1>
                </div>
            </div>
        </>
    )
}