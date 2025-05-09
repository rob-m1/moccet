import { Router, Request, Response } from "express";
const router = Router()

import models from '../../database/models/schema.js'
const {agent, task} = models

router.get('/', async (req:Request, res:Response)=> {
  try {
    const tasks = await task.find()
    res.json(tasks)
  } catch (error) {
    console.error('Error retrieving tasks:', error)
    res.status(500).json({ error: 'Error retrieving tasks' })
  }
})

router.post('/', async (req:Request, res:Response) => {
  try {
    const { name, id, desc, taskAgentId, taskStatus, taskDeps } = req.body
    console.log(req.body)
    if (!name || !id || !desc || !taskAgentId || !taskStatus ) {
      res.status(400).json({ error:"All fields are required." })
      return;
    }
    const newTask= new task({
      id:id,
      name:name,
      description:desc,
      agentId:taskAgentId,
      status:taskStatus,
      dependencies:taskDeps
    })

    await newTask.save()

    // Respond with the newly created agent
    res.json(newTask)
  } catch (error) {
    console.error('Error saving task:', error)
    res.status(500).json({ error: 'Error saving task' })
  }
})

router.delete('/:id', async (req:Request, res:Response) => {
  try {
    const result = await task.findOneAndDelete({ id: req.params.id });

    if (!result) {
      res.status(404).json({ error: "Task not found" });
      return
    }

    res.json({ message: "Task deleted successfully", task: result });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
})

router.put('/', async (req:Request, res:Response) => {
  try {
    const { name, id, desc, taskAgentId, taskStatus, taskDeps } = req.body;

    const result = await task.findOne({ id: id });
    if (!result) {
      res.status(404).json({ error: "Task not found" });
      return 
    }

    result.name = name;
    result.description = desc;
    if(taskAgentId != "")
      result.agentId = taskAgentId;
    result.status = taskStatus;
    result.dependencies = taskDeps;

    const updatedTask = await result.save();

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
})

export default router