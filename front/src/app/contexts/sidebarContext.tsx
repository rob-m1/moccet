import { Agent } from '@/components/react-flow/interfaces';
import React, { createContext, useContext, useState } from 'react';

// Create a Context to hold the sidebar state
const SidebarAgentContext = createContext(null);

export const SidebarAgentProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentAgent, setCurrentAgent] = useState<Agent>(null); // or any other state you need for your sidebar

  return (
    <SidebarAgentContext.Provider value={{ currentAgent, setCurrentAgent }}>
      {children}
    </SidebarAgentContext.Provider>
  );
};

export const useSidebarAgent = () => {
  return useContext(SidebarAgentContext);
};
