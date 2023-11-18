import { PrismaClient } from "@prisma/client";
import express from 'express';
import { verifyToken } from "./verifyToken.js";


export const prisma = new PrismaClient()
const router = express.Router()

router.post('/start',async (req,res)=>{

    const Info = {
        routeId :req.body.routeId,
        busId : req.body.busId,
        conductorId : req.body.conductorId,
        startLocation : req.body.startLocation,
        startLocationName : req.body.startLocationName
    }

    const verifyLocation = async (lat,long) => {

        const route_obj = await prisma.$queryRaw`
            select 
            ST_Y("fromLocation") AS latitude,
            ST_X("fromLocation") AS longitude
            from "Route" where id=${Info.routeId};
        `

        const difference = await prisma.$queryRaw`SELECT ST_Distance(
            ST_Transform(ST_GeomFromText('POINT(
                ' || ${route_obj[0].longitude} ||' ' || ${route_obj[0].latitude} || '
            )',4326),3857),
            ST_Transform(ST_GeomFromText('POINT(
                ' || ${long} ||' ' || ${lat} || '
            )',4326),3857));`

        console.log(difference)

        if(difference[0].st_distance <= 200) return true
    }


    const session_obj =  await prisma.session.findFirst({
        where : {
            OR :[
                {
                    busId : Info.busId
                },
                {
                    conductorId : Info.conductorId
                }
            ],
            status : {
                equals : "ongoing"
            }
        }
    })


    const verified_location = await verifyLocation(Info.startLocation.latitude,Info.startLocation.longitude);
    
    try {
        console.log(session_obj)

        if(!session_obj){
            console.log(verified_location)
            if(verified_location){
                await prisma.$executeRaw`
                insert into "Session" ("routeId","busId","conductorId","startLocation","startLocationName") 
                values(${Info.routeId},
                    ${Info.busId}, 
                    ${Info.conductorId}, 
                    ST_GeomFromText('POINT(
                        ' || ${Info.startLocation.longitude} || ' ' || ${Info.startLocation.latitude} || '
                        )'
                    , 4326),${Info.startLocationName})`
                const session = await prisma.session.findFirst({
                    where : {
                        AND :[
                            {
                                busId : Info.busId
                            },
                            {
                                conductorId : Info.conductorId
                            }
                        ],
                        status : {
                            equals : "ongoing"
                        }
                    }
                })
                res.status(200).json(session)
            }
            else{
                res.status(400).send("!!Start Location is not near the starting bus stop!!")
            }
        }
        else{
            res.status(403).send("ERROR!! ALREADY EXIST AS ONGOING")
        }
        
    } catch (err) {
        res.status(500).json(err)
        console.log(err)
    }
    
})

export default router

