import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';
import smoothieRoutes from './routes/smoothieRoutes'

//Load environment variables
dotenv.config()

//Initialize application
const app = express();

// Use PORT from .env
const PORT = process.env.PORT

//Middleware
app.use(express.json())
app.use(cors());


//Routes
app.use('/api/smoothies', smoothieRoutes)

app.get('/', (request, response) => {
    response.send("Welcome to Smoothie Recipe backend")
})

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
})

