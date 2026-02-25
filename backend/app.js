import express from 'express'
import cors from 'cors'
import { registerRoutes } from './routes/index.js'

const app = express()

app.use(cors({ origin: true }))
app.use(express.json())

registerRoutes(app)

export default app
