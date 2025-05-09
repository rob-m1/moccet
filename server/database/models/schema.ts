import { Schema as _Schema, model } from 'mongoose'
const Schema = _Schema

const taskSchema = new Schema({
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: '',
      required: true
    },
    agentId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'idle'
    },
    dependencies:{
        type:[String],
        default:[]
    }
  })

const agentSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: '',
    required: true
  },
})

const agent = model('agent', agentSchema)
const task = model('task', taskSchema)

export default {agent, task}