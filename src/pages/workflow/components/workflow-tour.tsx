import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { useUser } from '@/lib/store/userStore.ts'
import { useState } from 'react'
import { RepositoryFactory } from '@/api/repository-factory.ts'

const UserRepository = RepositoryFactory.get('user')
export default function WorkflowTour() {
  const user = useUser(state => state.user)
  const steps: Step = [
    {
      target: '.wf-toolbar',
      content: <h2>Let's begin our journey!</h2>,
      locale: { skip: <strong aria-label="skip">SKIP</strong> },
      disableBeacon: true

    },
    {
      target: '.wf-sidebar',
      content: <h2>Sticky elements</h2>,
      floaterProps: {
        disableAnimation: true,
      },
      spotlightPadding: 20,
      disableBeacon: true
    },
  ]

  const handleClickStart = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const updateGuide = () => {
    UserRepository.updateGuide('workflow')
  }
  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, type } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      updateGuide()
    }
  };

  return <Joyride
    callback={handleJoyrideCallback}
    continuous
    scrollToFirstStep
    showProgress
    showSkipButton
    steps={steps}
    run={user?.workflowGuide === false}
    styles={{
      options: {
        zIndex: 10000,
      },
    }}
  />
}