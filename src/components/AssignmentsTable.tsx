import AssignmentEntry from "./AssignmentEntry"
import { AssignmentDataType } from "@/apis/assignmentAPI"
import moment from 'moment'

export default function AssignmentsTable({ className, assignments } : {className?: string, assignments: AssignmentDataType[] | undefined}) {
    return (
        <>
            <div className={`text-text-50 flex flex-col ${className}`}>
                <div className="gap-10 flex text-text-300 border-text-300 border px-3 py-1 rounded-t-md font-semibold">
                    <h1 className="w-[1%] grow-[3]">Title</h1>
                    <h1 className="w-[1%] grow">Due date</h1>
                    <h1 className="w-[1%] grow">Status</h1>
                    <h1 className="w-[1%] grow">Score</h1>
                </div>

                {
                    assignments?.map(assignment => (
                        <AssignmentEntry key={assignment.id} title={assignment.title} dueDate={moment(assignment.dueDate, 'DD-MM-YYYY HH:mm:ss').format("DD-MM-YY")} status="Todo" score="Not Graded" id={assignment.id} />
                    ))
                }
            </div>
        </>
    )
}