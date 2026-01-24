import dotenv from "dotenv"
import connectDb from "./db/index.js"

/*2nd approach
ham alag se file le db folder me ya connection folder me wahan sara code likhe wahan se function export karaye
then us function ko import karaye aur usey execute kar de
*/
dotenv.config({
    path:'./env'
})
connectDb()
//package.json me jake script me bolna hai ki experimental feature use karna hai
.then(
    //ab hamari app server ka use karna suru karegi or listen karegi
    ()=>{
        app.listen(process.env.PORT ||8000,()=>{
            console.log(`server is running at port:${process.env.PORT}`)
        })
    }
)
.catch((err)=>{
    console.log("mongodb connection failed!!!",err);
})














/*approach:1
import express from "express";
const app=express()
//IIFE function

(async()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("error",error)
        throw error
       })
       app.listen(process.env.PORT,()=>{
        console.log(`app is listening at ${process.env.PORT}`);
       })
    } catch (error) {
        console.error("ERROR: ",error)
        throw error
    }
})()
    */