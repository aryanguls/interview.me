'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface CameraContextType {
  stream: MediaStream | null;
  setStream: React.Dispatch<React.SetStateAction<MediaStream | null>>;
  isCameraOn: boolean;
  setIsCameraOn: React.Dispatch<React.SetStateAction<boolean>>;
}

const CameraContext = createContext<CameraContextType | undefined>(undefined);

export const CameraProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  return (
    <CameraContext.Provider value={{ stream, setStream, isCameraOn, setIsCameraOn }}>
      {children}
    </CameraContext.Provider>
  );
};

export const useCamera = () => {
  const context = useContext(CameraContext);
  if (context === undefined) {
    throw new Error('useCamera must be used within a CameraProvider');
  }
  return context;
};