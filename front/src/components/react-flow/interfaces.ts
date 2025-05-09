import { Edge } from "@xyflow/react";

export interface Agent {
    id: string;
    name: string;
    type: 'ai' | 'human';
    icon: React.ReactNode;
}

export interface Task {
    id: string;
    name: string;
    description: string;
    agentId: string | null;
    status: 'idle' | 'running' | 'completed' | 'failed';
    dependencies: string[];
}

export interface Workflow {
    nodes: Node[];
    edges: Edge[];
}