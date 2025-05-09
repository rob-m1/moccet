import {Router} from "express"
import AgentRoutes from './agentRoutes.js'
import TaskRoutes from './taskRoutes.js'

const router = Router()

router.use("/api/agent",AgentRoutes)
router.use("/api/task",TaskRoutes)


export default router