import AssignmentEntry from "./AssignmentEntry"

export default function AssignmentsTable({ className } : {className?: string}) {
    return (
        <>
            <div className={`text-text-50 flex flex-col ${className}`}>
                <div className="gap-10 flex text-text-300 border-text-300 border px-3 py-1 rounded-t-md font-semibold">
                    <h1 className="w-[1%] grow-[3]">Title</h1>
                    <h1 className="w-[1%] grow">Due date</h1>
                    <h1 className="w-[1%] grow">Status</h1>
                    <h1 className="w-[1%] grow">Score</h1>
                </div>

                <AssignmentEntry title="Exploring the Intricacies of Quantum Computing: How Quantum Mechanics is Revolutionizing Technology and Problem-Solving" dueDate="15-07-2024" status="Todo" score="Not Graded" id={1} />
                <AssignmentEntry title="Revolutionizing Industries: The Power of Artificial Intelligence" dueDate="20-07-2024" status="Completed" score="97%" id={2}/>
                <AssignmentEntry title="The Future of Renewable Energy: How Innovative Technologies Are Paving the Way for a Sustainable and Eco-Friendly World" dueDate="18-07-2024" status="Completed" score="Not Graded" id={3}/>
            </div>
        </>
    )
}