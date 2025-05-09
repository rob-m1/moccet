import { Router, Request, Response } from "express";
const router = Router()

import models from '../../database/models/schema.js'
const {agent, task} = models

router.get('/', async (req:Request, res:Response)=> {
  try {
    const agents = await agent.find()
    res.json(agents)
  } catch (error) {
    console.error('Error retrieving agents:', error)
    res.status(500).json({ error: 'Error retrieving agents' })
  }
})

router.post('/', async (req:Request, res:Response) => {
  try {
    const { name, id, agentType } = req.body

    if (!name || !id || !agentType) {
      res.status(400).json({ error:"Name, ID, and Agent Type are required." })
      return;
    }
    const newAgent = new agent({
      id:id,
      name:name,
      type:agentType,
    })

    await newAgent.save()

    // Respond with the newly created agent
    res.json(newAgent)
  } catch (error) {
    console.error('Error saving agent:', error)
    res.status(500).json({ error: 'Error saving agent' })
  }
})

router.delete('/:id', async (req:Request, res:Response) => {
  try {
    const result = await agent.findOneAndDelete({ id: req.params.id });

    if (!result) {
      res.status(404).json({ error: "Agent not found" });
      return
    }

    res.json({ message: "Agent deleted successfully", agent: result });
  } catch (error) {
    console.error('Error deleting agent:', error);
    res.status(500).json({ error: 'Error deleting agent' });
  }
})

router.put('/', async (req:Request, res:Response) => {
  try {
    const { name, id, agentType } = req.body

    if (!name || !id || !agentType) {
      res.status(400).json({ error:"Name, ID, and Agent Type are required." })
      return;
    }
    const result = await agent.findOne({ id: id });
    if (!result) {
      res.status(404).json({ error: "Task not found" });
      return 
    }

    result.name = name;
    if(agentType != "")
      result.type = agentType;

    const updatedAgent = await result.save(); // make sure to await this

    res.json(updatedAgent);
  } catch (error) {
    console.error("Error updating agent:", error);
    res.status(500).json({ error: "Failed to update agent" });
  }
})

export default router