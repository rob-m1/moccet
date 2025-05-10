"use client"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuSkeleton,
  } from "@/components/ui/sidebar"
  import Env from "../lib/Env"

import { cn } from "@/lib/utils"
import { BrainCircuit, LayoutDashboard, Users } from "lucide-react"
import { Button } from "./ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { Combobox } from "./agentTypeSelector"
import { useEffect, useRef, useState } from "react"
import { Agent, Task } from "./react-flow/interfaces"
import { ComboboxAgent } from "./agentSelector"
import { ComboboxAgentSingular } from "./agentSelectorSingular"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
 
  export function AppSidebar({...props}) {
    const [open, setOpen] = useState(false);
    const [openTask, setOpenTask] = useState(false);
    const [agents, setAgents] = useState({});
    const [tasks, setTasks] = useState({});
    const [agentsObj, setAgentsObj] = useState<Agent[]>();
    const [tasksObj, setTasksObj] = useState<Task[]>();
    const [selectedAgent, setSelectedAgent] = useState<Agent>(null);
    const [loading, setLoading] = useState(true);
    const [agentId, setAgentId] = useState([])
    const [currTask, setCurrTask] = useState<Task>();
    const [taskDeps, setTaskDeps] = useState([])
    const [modMode, setModMode] = useState(false) //true = PUT, false = POST
    const [taskAgentId, setTaskAgentId] = useState("")
    const [taskID, setTaskID] = useState("")
    const handleAgentSelectInternal = (id) => {
      const found = agentsObj.find(agent => agent.id === id);
      if (found) setSelectedAgent(found);
      props.handleAgentSelect(found)
    }
    const fetchAgents = async () => {
      try {
        console.log(Env.BACKEND_APP_URL)
        const response = await fetch(Env.BACKEND_APP_URL+'/api/agent', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      }); // update this path if your API route differs
        const data = await response.json();
        setAgents(data);
        const transformedAgents: Agent[] = data.map((agent: any) => ({
          ...agent,
          icon: agent.type === 'ai' ? <BrainCircuit className="w-4 h-4" /> : <Users className="w-4 h-4" />,
        }));
        setAgentsObj(transformedAgents)
        props.setAGENTS(transformedAgents)
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchTasks = async () => {
      try {
        console.log(Env.BACKEND_APP_URL)
        const response = await fetch(Env.BACKEND_APP_URL+'/api/task', {
          method: "GET",
          headers: { "Content-Type": "application/json" },
      }); // update this path if your API route differs
        const data = await response.json();
        if(props.currTasks){
          data.forEach((element) => {
            if (element){
            const tempTask = props.currTasks.find(task => task.id === element.id)
            if (tempTask)
              element.status = tempTask.status;
            console.log(element.status)
            }
          }
        );
        }
        setTasks(data);
        const transformedTasks: Task[] = data.map((task: any) => ({
          ...task,
        }));
        setTasksObj(transformedTasks)
        props.setTASKS(transformedTasks)
      } catch (error) {
        console.error('Failed to fetch agents:', error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      fetchAgents();
      fetchTasks();
    }, []);
    useEffect(() => {
      fetchAgents();
      fetchTasks();
    }, [props.currTasks,props.toUpdate]);
    useEffect(() => {
      fetchAgents();
      fetchTasks();
      setErrorMessage("")
    }, [props.panelOpen]);
    useEffect(()=>{
      if(!openTask){
        setModMode(false)
        setTaskID("")
      }
    },[openTask])

    const nameRefTask = useRef<HTMLInputElement>(null);
    const idRefTask = useRef<HTMLInputElement>(null);
    const descRefTask = useRef<HTMLInputElement>(null);

    const nameRef = useRef<HTMLInputElement>(null);
    const idRef = useRef<HTMLInputElement>(null);
    const [agentType, setAgentType] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const createAgent = async () => {
      const name = nameRef.current?.value.trim();
      const id = idRef.current?.value.trim();
  
      if (!name || !id || !agentType) {
        setErrorMessage("Name, ID, and Agent Type are required.");
        return;
      }
  
      setErrorMessage(""); // Clear previous error
  
      const payload = { name, id, agentType };
  
      try {
        const res = await fetch(Env.BACKEND_APP_URL+"/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        if (!res.ok) throw new Error("Failed to create agent");
  
        const data = await res.json();
        console.log("Agent created:", data);
        setOpen(false)
        // optionally reset fields or show success message
      } catch (error) {
        console.error(error);
        setErrorMessage("Error creating agent. Please try again.");
      }
      await fetchAgents();
      await fetchTasks();
    };

    const createTask = async () => {
      if(modMode){
        await modifyTask()
        await fetchTasks()
        return
      }
      const name = nameRefTask.current?.value.trim();
      const id = idRefTask.current?.value.trim();
      const desc = descRefTask.current?.value.trim() || "";
  
      if (!name || !id || !desc || taskAgentId == "") {
        setErrorMessage("All fields are required.");
        return;
      }
  
      setErrorMessage(""); // Clear previous error
      const taskStatus = 'idle'
      const payload = { name, id, desc, taskAgentId, taskStatus, taskDeps };
      console.log(payload)
      console.log("woops")
      try {
        const res = await fetch(Env.BACKEND_APP_URL+"/api/task", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log(res)
        if (!res.ok) throw new Error("Failed to create task");
  
        const data = await res.json();
        console.log("Task created:", data);
        setOpenTask(false)
        // optionally reset fields or show success message
      } catch (error) {
        console.error(error);
        setErrorMessage("Error creating task. Please try again.");
      }
      await fetchAgents();
      await fetchTasks();
    };
    const openModifyTask = (id:string, name, desc, deps,agentId) =>{
      setModMode(true)
      setTaskID(id)
      const found = tasksObj.find(task => task.id === id);
      if (found) setCurrTask(found);
      setOpenTask(true)
      setTaskDeps(found?.dependencies)
    }
    const modifyTask = async () => {
      const name = nameRefTask.current?.value.trim();
      const id = idRefTask.current?.value.trim();
      const desc = descRefTask.current?.value.trim() || "";
  
      if (!name || !id || !desc) {
        setErrorMessage("All fields are required.");
        return;
      }
  
      setErrorMessage(""); // Clear previous error
      const tempCurrTask = props.currTasks.find(task => task.id === currTask?.id)
      const taskStatus = tempCurrTask?.status
      if(taskAgentId == ""){
        setTaskAgentId(currTask?.agentId || "")
      }
      const payload = {
        name, id, description:desc, agentId:taskAgentId, status:taskStatus, dependencies:taskDeps
      }
      console.log(payload)
      try {
        const res = await fetch(Env.BACKEND_APP_URL+"/api/task", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        console.log(res)
        if (!res.ok) throw new Error("Failed to modify task");
  
        const data = await res.json();
        console.log("Task modified:", data);
        setOpenTask(false)
        setModMode(false)
      setTaskID("")
        // optionally reset fields or show success message
      } catch (error) {
        console.error(error);
        setErrorMessage("Error modifying task. Please try again.");
      }
      await fetchAgents();
      await fetchTasks();
    };
    return (
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <Sidebar>
        <SidebarHeader >
        <Link href="/">
        <div className="flex items-center gap-2 mb-8">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                    <h1 className="text-xl font-semibold text-white">Moccet Assessment</h1>
                </div>
                </Link>
          </SidebarHeader>
        <SidebarContent>
        <SidebarMenu>
          <span>Agents:</span>
        {Object.entries(agents).length > 0 &&  Object.entries(agents).map(([_id, { id, name, type }]) => (
        <SidebarMenuItem key={_id}>
          <Button
            variant="ghost"
            className={cn(
              'w-full flex items-center justify-start gap-2',
              'hover:bg-gray-200/50 hover:text-white',
              selectedAgent?.id === id && 'bg-gray-700/50 text-white'
            )}
            onClick={() => handleAgentSelectInternal(id)}
          >
            {type == "ai" ? <BrainCircuit className="w-4 h-4" /> : <Users className="w-4 h-4" /> } {/* fallback if icon is not defined */}
            {name}
          </Button>
        </SidebarMenuItem>
      ))}

        <span>Tasks:</span>
        {Object.entries(tasks).length > 0 &&  Object.entries(tasks).map(([_id, { name, id, description, agentId, status, dependencies }]) => (
        <SidebarMenuItem key={_id}>
              <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <Button
            variant="ghost"
            className={cn(
              'w-full flex items-center justify-start gap-2',
              'hover:bg-gray-200/50 hover:text-white',
              selectedAgent?.id === id && 'bg-gray-700/50 text-white'
            )}
            onClick={() => handleAgentSelectInternal(id)}
          >
            {name}
          </Button>      
          </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>ID: {id}</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => openModifyTask(id,name,description,dependencies,agentId)}>
            Edit Properties
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
          
        </SidebarMenuItem>
      ))}

      </SidebarMenu>
          <SidebarGroup />

        </SidebarContent>
        <SidebarFooter>
        <div className="mt-auto space-y-5 mb-15">

        <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-blue-100/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 hover:text-blue-300"
          onClick={     ()=> setOpen(true)          }
        >
          New Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Agent</DialogTitle>
          <DialogDescription>Enter your agent parameters</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-end">
          <Combobox onChange={setAgentType} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Name" className="text-right">Name</Label>
            <Input id="Name" ref={nameRef} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ID" className="text-right">ID</Label>
            <Input id="ID" ref={idRef} className="col-span-3" />
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={createAgent}
            type="button"
          >
            Create Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
              
    <Dialog open={openTask} onOpenChange={setOpenTask}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full bg-blue-100/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30 hover:text-blue-300"
          onClick={     ()=> setOpenTask(true)          }
        >
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{modMode ? "Modify Task" : "New Task"}</DialogTitle>
          <DialogDescription>Enter your task parameters</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-end">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="agentId" className="text-right">Agent ID</Label>
            {modMode ? <ComboboxAgentSingular id="agentId" onChange={setTaskAgentId} agents={agentsObj} defaultValue={currTask?.agentId}/> :
            <ComboboxAgentSingular id="agentId" onChange={setTaskAgentId} agents={agentsObj} />}
          </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Name" className="text-right">Name</Label>
            {modMode ? <Input id="Name" ref={nameRefTask} defaultValue={currTask.name} className="col-span-3" /> :
            <Input id="Name" ref={nameRefTask} className="col-span-3" />}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="ID" className="text-right">ID</Label>
            {modMode ? <Input id="ID" ref={idRefTask} className="col-span-3" value={taskID} disabled/> :
            <Input id="ID" ref={idRefTask} className="col-span-3"/>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Description" className="text-right">Description</Label>
            {modMode ? <Input id="Description" ref={descRefTask} defaultValue={currTask?.description} className="col-span-3" /> : <Input id="Description" ref={descRefTask} className="col-span-3" />}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="deps" className="text-right">Dependencies</Label>
            {modMode ? <ComboboxAgent id="deps" onChange={setTaskDeps} agents={tasksObj} defaultValues={currTask?.dependencies}/> :
            <ComboboxAgent id="deps" onChange={setTaskDeps} agents={tasksObj} />}
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm text-center mt-2">{errorMessage}</p>
          )}
        </div>
        <DialogFooter>
          <Button
            onClick={createTask}
            type="button"
          >
            {modMode ? "Modify Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
        </div>
        </SidebarFooter>
      </Sidebar>
      </div>
    )
  } 