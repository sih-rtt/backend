import { PrismaClient } from "@prisma/client";
import express from 'express';
import { redis } from "../index.js";
import { verifyToken } from "./verifyToken.js";


export const prisma = new PrismaClient()
const router = express.Router()


router.put('/end',async (req,res)=>{
    
    const {sessionId,endLocation,status,endTime,endLocationName}= req.body

    const resStream = await redis.xRange('session:712', '-', '+')
    console.log(resStream)
    res.status(200)
})

export default router
