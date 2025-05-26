import express from 'express'
import dotenv from 'dotenv'
import {connectDB} from './config/db.js'
import cookieParser from 'cookie-parser'
import path from 'path'

import userRoutes from './routes/userRoutes.js'


const app = express()
dotenv.config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use('/api/v1/users', userRoutes)



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
    connectDB();
})