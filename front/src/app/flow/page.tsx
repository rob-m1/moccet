"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle,
    Circle,
    Play,
    Pause,
    RefreshCw,
    Settings,
    List,
    Users,
    Zap,
    BrainCircuit,
    Layers3,
    LayoutDashboard,
    XCircle,
    Trash
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    useReactFlow,
    ReactFlow,
    Controls,
    Background,
    MiniMap,
    Panel,
    Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Agent, Task } from '@/components/react-flow/interfaces';
import { createInitialWorkflow } from '@/components/react-flow/workflow';
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader } from '@/components/ui/sheet';
import { useSidebarAgent } from "../contexts/sidebarContext"
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import Env from '@/lib/Env';

// ===============================
// Constants
// ===============================

const initAGENTS: Agent[] = [
    { id: 'agent-1', name: 'Planning Agent', type: 'ai', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'agent-2', name: 'Coding Agent', type: 'ai', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'agent-3', name: 'Testing Agent', type: 'ai', icon: <BrainCircuit className="w-4 h-4" /> },
    { id: 'human-1', name: 'Project Manager', type: 'human', icon: <Users className="w-4 h-4" /> },
];

const initINITIAL_TASKS: Task[] = [
    { id: 'task-1', name: 'Define Project Goals', description: 'Gather requirements and set objectives.', agentId: 'human-1', status: 'completed', dependencies: [] },
    { id: 'task-2', name: 'Create Workflow Diagram', description: 'Design the process flow.', agentId: 'agent-1', status: 'completed', dependencies: ['task-1'] },
    { id: 'task-3', name: 'Implement Core Features', description: 'Write the main application code.', agentId: 'agent-2', status: 'running', dependencies: ['task-2'] },
    { id: 'task-4', name: 'Write Unit Tests', description: 'Develop tests for the core features.', agentId: 'agent-3', status: 'idle', dependencies: ['task-3'] },
    { id: 'task-5', name: 'Integrate UI Components', description: 'Connect the frontend elements.', agentId: 'agent-2', status: 'idle', dependencies: ['task-3'] },
    { id: 'task-6', name: 'Perform System Testing', description: 'Test the complete application.', agentId: 'agent-3', status: 'idle', dependencies: ['task-4', 'task-5'] },
    { id: 'task-7', name: 'Final Review', description: 'Get final approval from PM.', agentId: 'human-1', status: 'idle', dependencies: ['task-6'] },
];

// ===============================
// Main Component
// ===============================

const MoccetPlatform = () => {
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [AGENTS, setAGENTS] = useState([])
    const [INITIAL_TASKS, setINITIAL_TASKS] = useState([])
    const openSheet = () => setIsSheetOpen(true);
    const closeSheet = () => setIsSheetOpen(false);
    const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange, onConnect] = useEdgesState<Edge[]>([]);
    const [isSimulationRunning, setIsSimulationRunning] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false);
    const [simulationInterval, setSimulationInterval] = useState<NodeJS.Timeout|null>(null)
    const [toUpdate, setToUpdate] = useState(0)
    // Initialize workflow
    useEffect(() => {
        const initialWorkflow = createInitialWorkflow(tasks, AGENTS,nodes);
        setNodes(initialWorkflow.nodes);
        setEdges(initialWorkflow.edges);
    }, [setNodes, setTasks]);//setViewport

    // Update nodes and edges when tasks change
      useEffect(() => {
        const newWorkflow = createInitialWorkflow(tasks, AGENTS,nodes);
        setNodes(newWorkflow.nodes);
        setEdges(newWorkflow.edges);
    }, [tasks, setNodes, setEdges]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
              console.log(Env.BACKEND_APP_URL)
              await fetch(Env.BACKEND_APP_URL+'/api/agent', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
        }finally{
                
        }
        try {
            console.log(Env.BACKEND_APP_URL)
            await fetch(Env.BACKEND_APP_URL+'/api/task', {
              method: "GET",
              headers: { "Content-Type": "application/json" },
          });
      }finally{
              
      }
    };
        fetchItems()
        const newWorkflow = createInitialWorkflow(tasks, AGENTS,nodes);
        setNodes(newWorkflow.nodes);
        setEdges(newWorkflow.edges);

    }, []);

    const deleteAgent = async () => {
        console.log(selectedAgent.id)
        await fetch(Env.BACKEND_APP_URL+'/api/agent/'+selectedAgent!.id, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        setSelectedAgent(null)
        setIsAgentPanelOpen(false)
    }

    const handleUpdate = useCallback(async () => {
        const fetchTasks = async () => {
            try {
              console.log(Env.BACKEND_APP_URL)
              const response = await fetch(Env.BACKEND_APP_URL+'/api/task', {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            }); // update this path if your API route differs
              const data = await response.json();
              console.log("found_data",data)
              const transformedTasks: Task[] = data.map((task: any) => ({...task,}));
              setTasks(transformedTasks)
            } catch (error) {
              console.error('Failed to fetch:', error);
          };
        }
          
        await fetchTasks()
        console.log("init:",INITIAL_TASKS)
        // setToUpdate(toUpdate+1)
        console.log(INITIAL_TASKS)
        // setTasks(INITIAL_TASKS);
    },[]);
    // Simulation logic
    const runSimulation = useCallback(async () => {
        setIsSimulationRunning(true);
        await handleUpdate()
        let currentTasks = [...tasks];
        const simulationActions = async () => {
            await handleUpdate()
            // currentTasks = [...tasks];
            const runningTaskIndex = currentTasks.findIndex(t => t.status === 'running');
            if (runningTaskIndex !== -1) {
                // Simulate task completion
                currentTasks = [...currentTasks]; // Create a copy to avoid mutating state directly
                currentTasks[runningTaskIndex] = {
                    ...currentTasks[runningTaskIndex],
                    status: 'completed',
                };
                try {
                    const tempCurrTask = currentTasks[runningTaskIndex];
                    const { name, id, description, agentId, status, dependencies } = tempCurrTask;
                    console.log("id:",id)

                    const payload = {name, id, description, agentId, status, dependencies}
                    console.log(payload)
                    const res = await fetch(Env.BACKEND_APP_URL+"/api/task/status", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });
                    console.log(res)
                    if (!res.ok) throw new Error("Failed to modify task");
              
                    const data = await res.json();
                    console.log("Task modified:", data);
                    // await handleUpdate()
                    //   setTasks(currentTasks)
                    // currentTasks = [...tasks];
                  } catch (error) {
                    console.error(error);
                  }
                  await handleUpdate()
                        // currentTasks = [...tasks];
                //   currentTasks=[...tasks]

                // Find next eligible task to run
                const nextTaskIndex = currentTasks.findIndex(t =>
                    t.status === 'idle' &&
                    t.dependencies.every(depId => currentTasks.find(dt => dt.id === depId)?.status === 'completed')
                );

                if (nextTaskIndex !== -1) {
                    // Start the next task
                    currentTasks = [...currentTasks];  // Create a copy here too
                    currentTasks[nextTaskIndex] = {
                        ...currentTasks[nextTaskIndex],
                        status: 'running',
                    };
                    try {
                        const tempCurrTask = currentTasks[nextTaskIndex];
                        const { name, id, description, agentId, status, dependencies } = tempCurrTask;
                        console.log("id:",id)

                        // const currTempStatus = 'running'
                        const payload = {name, id, description, agentId, status, dependencies}
                        console.log(payload)
                        const res = await fetch(Env.BACKEND_APP_URL+"/api/task/status", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                        console.log(res)
                        if (!res.ok) throw new Error("Failed to modify task");
                  
                        const data = await res.json();
                        console.log("Task modified:", data);
                      

                      } catch (error) {
                        console.error(error);
                      }
                      await handleUpdate()
                        // currentTasks = [...tasks];
                //   currentTasks=[...tasks]
                //   setTasks(currentTasks)
                } else if (currentTasks.every(t => t.status === 'completed' || t.status === 'failed')) {
                    // Simulation is complete
                    console.log("here")
                    setIsSimulationRunning(false);
                    clearInterval(interval);
                }
            } else {
                const noAgentTasks = currentTasks.forEach(t =>{
                    if(!AGENTS.find( a=>a.id == t.agentId)){
                            t.status = 'failed'
                        }
                }
                );
                // Find the first idle task with completed dependencies
                const nextTaskIndex = currentTasks.findIndex(t =>
                    t.status === 'idle' &&
                    t.dependencies.every(depId => currentTasks.find(dt => dt.id === depId)?.status === 'completed')
                );

                if (nextTaskIndex !== -1) {
                    // Start the next task
                    await handleUpdate()
                    currentTasks = [...currentTasks];  // And here
                    currentTasks[nextTaskIndex] = {
                        ...currentTasks[nextTaskIndex],
                        status: 'running',
                        dependencies: currentTasks.find(dt => dt.id === currentTasks[nextTaskIndex].id)?.dependencies || []
                    };
                    try {
                        const tempCurrTask = currentTasks[nextTaskIndex];
                        const { name, id, description, agentId, status, dependencies } = tempCurrTask;
                        console.log("id:",id)

                        // const currTempStatus = 'running'
                        const payload = {name, id, description, agentId, status, dependencies}
                        console.log(payload)
                        const res = await fetch(Env.BACKEND_APP_URL+"/api/task/status", {
                          method: "PUT",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(payload),
                        });
                        console.log(res)
                        if (!res.ok) throw new Error("Failed to modify task");
                  
                        const data = await res.json();
                        console.log("Task modified:", data);
                        
                      } catch (error) {
                        console.error(error);
                      }
                      await handleUpdate()
                        // currentTasks = [...tasks];
                    // currentTasks=[...tasks]
                    // setTasks(currentTasks)
                    }
            }
        }
        simulationActions()
        const interval = setInterval(async () => {
            await simulationActions()
        }, Math.random() * (1700 - 1200) + 1200); // Adjust for simulation speed
        setSimulationInterval(interval)
        return () => clearInterval(interval);
    }, [tasks, handleUpdate, AGENTS]);

    const handleReset = () => {
        setIsSimulationRunning(false);
        INITIAL_TASKS.forEach(async (t) => {
            try {
                t.status = "idle"
                const tempCurrTask = t;
                const { name, id, description, agentId, status, dependencies } = tempCurrTask;

                const payload = {name, id, description, agentId, status, dependencies}
                console.log(payload)
                const res = await fetch(Env.BACKEND_APP_URL+"/api/task", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                console.log(res)
                if (!res.ok) throw new Error("Failed to modify task");
            
                const data = await res.json();
                console.log("Task modified:", data);
                } catch (error) {
                console.error(error);
                }
        })
        
        setTasks(INITIAL_TASKS); // Reset to the initial task state
        setIsSimulationRunning(false);
        if(simulationInterval)
            clearInterval(simulationInterval)
    };


    const handleAgentSelect = (agent: Agent) => {
        setSelectedAgent(agent);
        setIsAgentPanelOpen(true);
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <aside>
                <SidebarProvider>
                <AppSidebar panelOpen={isAgentPanelOpen} toUpdate={toUpdate} handleAgentSelect={handleAgentSelect} setAGENTS={setAGENTS} setTASKS={setINITIAL_TASKS} currTasks={tasks}></AppSidebar>
                </SidebarProvider>
            </aside>
            {/* Main Content */}
            <main className="flex-1 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold text-white">Workflow Visualization</h2>
                    <div className="flex gap-4">
                        <Button
                            onClick={isSimulationRunning ? () => {} : runSimulation}
                            disabled={isSimulationRunning}
                            className={cn(
                                "bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30 hover:text-green-300",
                                isSimulationRunning && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            {isSimulationRunning ? <Pause className="w-4 h-4 mr-2 animate-pulse" /> : <Play className="w-4 h-4 mr-2" />}
                            {isSimulationRunning ? 'Pause' : 'Run Simulation'}
                        </Button>
                        <Button
                            onClick={handleReset}
                            className="bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        <Button
                            onClick={handleUpdate}
                            className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30 hover:text-yellow-300"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Update
                        </Button>
                    </div>
                </div>

                <div className="h-[calc(100vh-120px)] rounded-lg overflow-hidden border border-gray-700 bg-gray-900">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        fitView
                        className="bg-gray-900"
                    >
                        <Background
                            variant=""
                            gap={20}
                            size={1}
                            color="#4a5568" // Darker gray for better contrast
                        />
                        <Panel position={Position.TopRight} className="">
                        <div className="w-64 bg-gray-800 border-gray-700 text-white rounded-md p-2.5">
                            
                            <h4 className="text-sm font-semibold mb-1">Legend</h4>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <h5 className="text-xs font-medium text-gray-400">Agent Types</h5>
                                    <div className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 bg-blue-500/20 text-blue-400 border-blue-500/30">
                                        <BrainCircuit className="w-3 h-3" /> AI Agent
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 bg-green-500/20 text-green-400 border-green-500/30">
                                        <Users className="w-3 h-3" /> Human Agent
                                    </div>
                                </div>
                                <div>
                                    <h5 className="text-xs font-medium text-gray-400">Task Status</h5>
                                    <div className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 bg-gray-500/20 text-gray-400 border-gray-500/30">
                                        <Circle className="w-3 h-3" /> Idle
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                       <Circle className="w-3 h-3 animate-pulse" /> Running
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 bg-green-500/20 text-green-400 border-green-500/30">
                                        <CheckCircle className="w-3 h-3" /> Completed
                                    </div>
                                    <div className="flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1 bg-red-500/20 text-red-400 border-red-500/30">
                                        <XCircle className="w-3 h-3" /> Failed
                                    </div>
                                </div>
                            </div>
                            </div>
                            
                        </Panel>
                    </ReactFlow>
                </div>
            </main>
            {isAgentPanelOpen && selectedAgent && (
                    <>
            <Sheet open={isSheetOpen}>
                {/* <SheetContent> */}
                    <div className='m-2 mt-15 mr-5 w-75'>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-white">Agent Details</h2>
                        </div>
                        <div className="bg-gray-900 border-gray-700">
                            <div>
                                <div className="text-lg font-semibold text-white flex items-center gap-2">
                                    {selectedAgent.icon} {selectedAgent.name}
                                </div>
                                <div className="text-gray-400">
                                    {selectedAgent.type === 'ai' ? 'AI Agent' : 'Human Agent'}
                                </div>
                            </div>
                            <div>
                                <div className="space-y-4">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-300">Agent ID</h3>
                                        <p className="text-gray-400">{selectedAgent.id}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-md font-medium text-gray-300">Tasks Assigned</h3>
                                        <ul className="list-disc list-inside space-y-1">
                                            {tasks.filter(task => task.agentId === selectedAgent.id).map(task => (
                                                <li key={task.id} className="text-gray-400">
                                                    {task.name} ({task.status})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {/* Add more agent-specific details here */}
                                </div>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300 mt-5"
                            onClick={() => deleteAgent() }
                        >
                            <Trash className="w-5 h-5" />
                            Delete
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30 hover:text-red-300 mt-5"
                            onClick={() => setIsAgentPanelOpen(false)}
                        >
                            <XCircle className="w-5 h-5" />
                            Close
                        </Button>
                        </div>
            {/* </SheetContent> */}
            
        </Sheet>
        </>
            )}
        </div>
    );
};

export default MoccetPlatform;
