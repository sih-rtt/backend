import { PrismaClient } from "@prisma/client";
const main=async()=>{
 const prisma=new PrismaClient();
 const data={
    conductorId : "1",
    password : "1",
    fullName : "Abhishek",
    gender :  "male",
    phoneNumber : "6363695280"
 }
 await prisma.conductor.create({data : data})
}
main();