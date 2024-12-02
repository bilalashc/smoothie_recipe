import express from 'express';
import dotenv from 'dotenv'

//Load environment variables
dotenv.config()

//Initialize application
const app = express();

// Use PORT from .env
const PORT = process.env.PORT

//Middleware to parse json bodies
app.use(express.json())





app.get('/', (request, response) => {
    response.send("Welcome to Smoothie Recipe backend")
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);  
})

