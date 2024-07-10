import { useContext, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { AnimationContext } from '../../context/AnimationContext';

export default function BurningPage() {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error('BurningPage must be used within an AnimationProvider');
  }

  const { animations, fetchAnimation } = context;

  useEffect(() => {
    fetchAnimation('burning-page', '/burning-page.riv');
  }, [fetchAnimation]);

  const { RiveComponent } = useRive({
    src: animations['burning-page'] || '',
    autoplay: true,
    stateMachines: 'burning-page',
  });

  return (
    <RiveComponent className="w-full h-screen" />
  )
};
