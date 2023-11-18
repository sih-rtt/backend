import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import express from 'express'
import startRouter from './routes/journey_start.js'
import endRouter from './routes/journey_end.js'
const prisma = new PrismaClient()
const app = express() 
app.use(express.json())

const testDbConnection = async () => {
    try {
      await prisma.$connect();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
};

export const redis = createClient();
redis.on('error', (error) => {
  console.log(error)
});

await redis.connect();

testDbConnection()
app.use('/api/journey',startRouter);
app.use('/api/journey',endRouter)

app.listen(4000,()=>{
  console.log("Server on port 4000");
});
