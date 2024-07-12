import { useContext, useEffect } from 'react';
import { useRive } from '@rive-app/react-canvas';
import { AnimationContext } from '../../context/AnimationContext';

export default function RoomAnimation() {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error('Room must be used within an AnimationProvider');
  }

  const { animations, fetchAnimation } = context;

  useEffect(() => {
    fetchAnimation('room', '/room.riv');
  }, [fetchAnimation]);

  const { RiveComponent } = useRive({
    src: animations['room'] || '',
    autoplay: true,
    stateMachines: 'room',
  });

  return animations['room'] ? (
    <RiveComponent className="w-full h-[200px] flex justify-center" />
  ) : (
    <div>Loading...</div>
  );
};

