import { Edge, Node } from "@xyflow/react";
import { Agent, Task } from "./interfaces";
import { createTaskNode } from "./nodes/taskNode";

const createEdge = (source: string, target: string): Edge => ({
    id: `edge-${source}-${target}`,
    source,
    target,
    animated: true,
    style: { stroke: '#999', strokeWidth: 2 },
    markerEnd: {
        type: 'arrow',
        color: '#fff',
        width: 20,
        height: 20,
    },
});

function getNonOverlappingPosition(
    id: string,
    positionMap: Map<string, { x: number; y: number }>,
    usedPositions: Set<string>,
    spacing = 100 // Spacing between nodes
): { x: number; y: number } {
    const normalize = (pos: { x: number; y: number }) =>
        `${Math.round(pos.x)}-${Math.round(pos.y)}`;

    const existing = positionMap.get(id);
    if (existing) {
        const key = normalize(existing);
        if (!usedPositions.has(key)) {
            usedPositions.add(key);
            return existing;
        }
    }

    // Generate a new non-overlapping position
    let attempts = 0;
    let x = 0;
    let y = 0;
    let key = '';

    do {
        x = Math.floor(Math.random() * 10) * spacing; // Spread out nodes
        y = Math.floor(Math.random() * 10) * spacing;
        key = normalize({ x, y });
        attempts++;
    } while (usedPositions.has(key) && attempts < 100); // Limit attempts to prevent infinite loop

    usedPositions.add(key);
    return { x, y };
}

export function createInitialWorkflow(
    tasks: Task[],
    agents: Agent[],
    existingNodes: Node[] = []
): { nodes: Node[]; edges: Edge[] } {
    const positionMap = new Map(existingNodes.map((n) => [n.id, n.position]));
    const usedPositions = new Set<string>();

     existingNodes.forEach(node => {
        const key = `${Math.round(node.position.x)}-${Math.round(node.position.y)}`;
        if (!usedPositions.has(key)) {
            positionMap.set(node.id, node.position);
            usedPositions.add(key);
        }
    });

    const nodes = tasks.map(task => {
        const existingNode = existingNodes.find(n => n.id === task.id);
        const position = existingNode ? existingNode.position : getNonOverlappingPosition(task.id, positionMap, usedPositions);
        return {
            ...createTaskNode(task, agents),
            position
        }
    });
    const edges: Edge[] = [];
    tasks.forEach(task => {
        task.dependencies.forEach(depId => {
            const source = depId;
            const target = task.id;
            edges.push(createEdge(source, target));
        });
    });

    return { nodes, edges };
};
