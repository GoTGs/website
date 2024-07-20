import { Button } from "./ui/button"

export default function MemberEntry({firstName, lastName, email, role, id, isAdmin}: {firstName: string, lastName: string, email: string, role: string, id: number, isAdmin: boolean}) {
    return (
        <>
            <div className="gap-10 flex p-3 text-text-50 border-text-300 border-x border-b items-center duration-100 transition-colors">
                <img className="h-[48px] w-[1%] grow" src={`https://ui-avatars.com/api/?name=${firstName + ' ' + lastName}&size=64&background=60494d&color=fff&bold=true&rounded=true`}/>

                <h1 className="w-[1%] grow">{firstName}</h1>
                <h1 className="w-[1%] grow">{lastName}</h1>
                <h1 className="w-[1%] grow break-words">{email}</h1>
                <h1 className="w-[1%] grow break-words">{role.toUpperCase()}</h1>

                {isAdmin && <div className="w-[1%] grow">
                    <Button className="bg-[#e74c4c] transition-colors font-bold text-text-50 hover:bg-[#b43c3c] duration-150">Remove</Button>
                </div>}
            </div>
        </>
    )
}