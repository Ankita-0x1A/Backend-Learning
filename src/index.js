// require("dotenv").config({path: "./env"});
// isse bhi chl jaayga but better version h joh use krte h because import db here require

import dotenv from "dotenv";
import connectDB from "./db/index.js";
const app = express();
// import express from "express";

dotenv.config({
    path: "./env"
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server running on port ${process.env.PORT}`)
    })

    app.on("error",(error)=>{
        console.log("mongodb connection failed");
        throw error
    })
})
.catch((error)=>{
    console.log("mongodb connection failed !!!! ",error);
})














/** 
 * 
import mongoose  from "mongoose";
import {DB_NAME} from "./constants";
import express from "express";
const app=express();

(async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("NOT ABLE TO CONNECT: ",error);
            throw error;
        })

        app.listen(process.env.PORT,()=>{
            console.log(`app is listening at port ${process.env.PORT}`);
        })
    }catch(error){
        // console.log("error: ",error)
        console.error("error: ",error);
        throw error;
    }
})()

*/