import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import compression from 'compression'
import connectDB from './config/connectDB.js'
import { webhookStripe } from './controllers/order.controller.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'
import adminRouter from './route/admin.route.js'
import agentRouter from './route/agent.route.js'

const app = express()
console.log(process.env.FRONTEND_URL);
app.use(cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:5173" || "http://localhost:5174"
}))
app.post('/api/order/webhook', express.raw({ type: 'application/json' }), webhookStripe)
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy: false
}))
app.use(compression())

const PORT = process.env.PORT

app.get("/", (request, response) => {
    ///server to client
    response.json({
        message: "Server is running " + PORT
    })
})

app.use('/api/user', userRouter)
app.use("/api/category", categoryRouter)
app.use("/api/file", uploadRouter)
app.use("/api/subcategory", subCategoryRouter)
app.use("/api/product", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/address", addressRouter)
app.use('/api/order', orderRouter)
app.use('/api/admin', adminRouter)
app.use('/api/agent', agentRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is running", PORT)
    })
})

