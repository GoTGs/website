import { useEffect, useState } from "react"

import { useSearchParams, useNavigate } from "react-router-dom"

import AssignmentsTable from "@/components/AssignmentsTable"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb"
import { Label } from "@/components/ui/label"

export default function Assignments() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const [filter, setFilter] = useState<string>('all')

    useEffect(() => {
        if (!searchParams.has('id')) {
            navigate('/dashboard')
        }
    }, [])

    const handleFilterSelect = (e: any) => {
        setFilter(e.target.value)
        console.log(e.target.value)
    }

    return (
        <>
            <div className="bg-background-950 min-h-screen min-w-screen flex relative flex-col items-center">
                <div className="flex flex-col w-[90%] gap-8">
                    <div>
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

                    <div className="text-text-50 flex">
                            <Label htmlFor="all" className="cursor-pointer border-y border-l border-text-300 rounded-l-md">
                                <input onChange={handleFilterSelect} type="radio" value="all" id="all" className="hidden" name="filter" checked={filter === 'all'} />
                                <div className="label-checked:bg-background-800 hover:bg-background-700 p-3 rounded-l-md">All</div>
                            </Label>

                            <Label htmlFor="completed" className="cursor-pointer border-y border-text-300">
                                <input onChange={handleFilterSelect} type="radio" value="completed" id="completed" name="filter" className="hidden" checked={filter === 'completed'} />
                                <div className="label-checked:bg-background-800 hover:bg-background-700 p-3">Completed</div>
                            </Label>

                            <Label htmlFor="todo" className="cursor-pointer border-y border-r border-text-300 rounded-r-md">
                                <input onChange={handleFilterSelect} type="radio" value="todo" id="todo" name="filter" className="hidden" checked={filter === 'todo'} />
                                <div className="label-checked:bg-background-800 p-3 rounded-r-md hover:bg-background-700">Todo</div>
                            </Label>
                    </div>

                    <AssignmentsTable className="pb-5"/>
                </div>
            </div>
        </>
    )
}