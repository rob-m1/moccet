import { initializeMongoose } from './../database/index.js';
import express, {Application, Request, Response} from "express"
import "dotenv/config"
import path from "path"
import cors from "cors"
const PORT = process.env.PORT || 7000
import { fileURLToPath } from "url"
import Routes from './routes/index.js'
import {createServer, Server as HttpServer} from "http"
const __dirname = path.dirname(fileURLToPath(import.meta.url))
initializeMongoose()
const app:Application = express()
const server:HttpServer = createServer(app)
app.use(express.json()) // when sending json file formats in the req it will convert to js objects
app.use(cors())
// app.use(express.static("public"))

// * Routes
app.use(Routes)

app.get("/", (req:Request, res:Response)=>{
    //res.send("The server is working")
    /*
    In Express, the res.send() method already sends the response, 
    and you don't need to explicitly return the result from the handler. 
    However, when you add the return, 
    TypeScript might be confused about the types involved.
    res.send() itself is a method that ends the request-response cycle, 
    so returning the value from it is unnecessary.
    */
    res.json("works")
})

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
}) 

