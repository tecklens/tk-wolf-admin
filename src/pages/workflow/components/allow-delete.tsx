import {Input} from '@/components/ui/input.tsx'
import {Button} from '@/components/custom/button.tsx'
import {IWorkflowEntity} from '@/types/workflow.interface.ts'
import React, {useState} from 'react'
import {RepositoryFactory} from '@/api/repository-factory.ts'
import {HttpStatusCode} from 'axios'
import {useToast} from '@/components/ui/use-toast.ts'
import {DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {throttle} from "lodash";
import {useWorkflow} from "@/lib/store/workflowStore.ts";

const WorkflwoRepository = RepositoryFactory.get('wf')

export default function WorkflowAllowDelete({workflow, onClose}: {
    workflow: IWorkflowEntity | null;
    onClose: () => void;
}) {
    const [name, setName] = useState('')
    const {toast} = useToast()
    const {fetchWf, reload} = useWorkflow()

    const delWf = throttle(async () => {
        const rsp = await WorkflwoRepository.deleteWf(workflow?._id)

        if (rsp.status === HttpStatusCode.Ok) {
            toast({
                content: `The workflow '${workflow?.name}' has been successfully deleted.`
            })

            fetchWf()
            reload()
            onClose()
        } else {
            toast({
                content: `An error occurred while deleting the workflow '${workflow?.name}'.`
            })
        }

    }, 200, {trailing: true})

    return (
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle className={'text-base'}>Delete {workflow?.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2">
                <div className={'font-semibold'}>To confirm, type "{workflow?.name}" in the box below</div>
                <Input value={name} onChange={e => setName(e.target.value)}/>
            </div>
            <DialogFooter className={'w-full'}>
                <Button
                    onClick={delWf}
                    disabled={!name || name === '' || name !== workflow?.name}
                    type="button"
                    variant={'destructive'}
                    className={'w-full'}>Delete
                    this workflow</Button>
            </DialogFooter>
        </DialogContent>
    )
}