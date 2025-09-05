import { useState } from "react"

import './index.css'
import { Container, DownArrow, RightArrow } from '@/components'
import { cn } from '@/lib/utils'
import { useProjects, useProjectMembers, useDeleteProjectMember } from '@/modules/projects/hooks'

function App() {

    const [selectedProjectId, setSelectedProjectId] = useState('')
    const [live, setLive] = useState(false)

    const { projects } = useProjects()
    const { projectMembers, refetchProjectMembers, isLoading: isLoadingMembers } = useProjectMembers(selectedProjectId, live)
    const { deleteMember, isDeleting } = useDeleteProjectMember()

    const onDeleteMember = (memberId: string) => {
        deleteMember(
            { projectId: selectedProjectId, memberId }
        )
        .then(() => refetchProjectMembers())
        .catch((error) => {
            console.error('onDeleteMember error', error)
        })
    }

    return <div>
        <div className="project-list">
        {projects?.items.map((project) => (
            <div key={project.id}
                className={cn(
                    'project-list-item',
                    selectedProjectId === project.id && 'bg-green-200'
                )}>
                <div>{project.name}</div>
                <div>
                    <button className="text-blue-400 text-sm"
                        onClick={() => setSelectedProjectId(project.id)}>查看成员
                    </button>
                </div>
            </div>
        ))}
        </div>

        <div className="font-bold m-2 text-base text-slate-600 flex flex-row justify-between mt-4">
            <span>
                {projectMembers?.items ? <DownArrow /> : <RightArrow />}
                项目成员: {projectMembers?.total}
                {isLoadingMembers && <span className="text-gray-400 text-sm ml-2">Loading...</span>}
            </span>
            <button
                className="text-blue-500 text-sm"
                onClick={() => setLive(!live)}
            >
                {live ? 'Stop Live' : 'Start Live'}
            </button>
        </div>

        <div>
            {isDeleting && <span className="text-[#ca5252] text-sm ml-2">Deleting...</span>}
            {projectMembers?.items.map((member) => (
                <Container key={member.id} border rounded spaced className='m-2 rounded-md'>
                    <div>{member.name} <span className="text-gray-400 text-sm">@{member.id}</span></div>
                    <button className="text-[#f00] text-sm"
                        onClick={() => onDeleteMember(member.id)}> 删除
                    </button>
                </Container>
            ))}
            <div className="m-2">
                <button className="text-sm border border-[var(--main-color)] bg-[var(--main-color)] text-white p-2 rounded-lg cursor-pointer">
                    Add Member
                </button>
            </div>
        </div>
    </div>
}

export default App
