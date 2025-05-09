import { cn } from "@/lib/utils";
import { Agent, Task } from "../interfaces";

const getAgentColor = (agentType: 'ai' | 'human') => {
    return agentType === 'ai' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30';
};
const getTaskStatusColor = (status: Task['status']) => {
    switch (status) {
        case 'idle': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        case 'running': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse';
        case 'completed': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};
export const createTaskNode = (task: Task, agents: Agent[]): Node => {
    const agent = task.agentId ? agents.find(a => a.id === task.agentId) : null;
    const agentColor = agent ? getAgentColor(agent.type) : 'bg-gray-700 text-gray-300 border-gray-600';
    const statusColor = getTaskStatusColor(task.status);

    return {
        id: task.id,
        type: 'default',
        data: {
            label: (
                <div className="flex flex-col items-start gap-1">
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-sm font-medium rounded-full px-2 py-1",
                            statusColor
                        )}>
                            {task.status.toUpperCase()}
                        </span>
                        {agent && (
                            <div className={cn(
                                "flex items-center gap-1 text-xs font-medium rounded-full px-2 py-1",
                                agentColor
                            )}>
                                {agent.icon}
                                {agent.name}
                            </div>
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-black">{task.name}</h3>
                    <p className="text-sm text-gray-800">{task.description}</p>
                </div>
            ),
        },
        position: { x: 0, y: 0 }, // Will be updated later
        className: "bg-gray-800 border border-gray-700 rounded-xl shadow-lg",
        style: { width: 250 },
    };
};