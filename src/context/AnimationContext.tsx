import { createContext, useState,  useCallback, ReactNode } from 'react';

type AnimationContextType = {
  animations: { [key: string]: string | null };
  fetchAnimation: (key: string, url: string) => Promise<void>;
}

export const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

type AnimationProviderProps = {
  children: ReactNode;
}

export function AnimationProvider ({ children } : AnimationProviderProps) {
  const [animations, setAnimations] = useState<{ [key: string]: string | null }>({});

  const fetchAnimation = useCallback(async (key: string, url: string) => {
    if (animations[key]) return;

    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);

    setAnimations((prevAnimations) => ({
    ...prevAnimations,
    [key]: objectUrl,
    }));
    
  }, [animations]);

  return (
    <AnimationContext.Provider value={{ animations, fetchAnimation }}>
      {children}
    </AnimationContext.Provider>
  );
};
