import { Link } from "@tanstack/react-router"
import { useEffect } from "react"

export default function ProjectDetail({id}: {id: string}) {

    useEffect(() => {
        console.log('id', id)
    }, [id])

    return <div>
        <div>Hello "/projects/$id" {id}!</div>

        <div>
            Project Info: {id}
        </div>

        <button className="mt-2 text-blue-500 m-2 p-2 border border-blue-500 rounded-md">
            <Link to="/projects/$id/members" params={{ id }} className="text-blue-500">
                View Members
            </Link>
        </button>
    </div>
}
