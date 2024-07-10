import { useRive } from '@rive-app/react-canvas';

export default function BurningPage() {
    const { RiveComponent } = useRive({
        src: '/burning-page.riv',
        autoplay: true,
        stateMachines: 'burning-page'
    });

    return (
        <RiveComponent className='w-full h-screen'/>
    )
}