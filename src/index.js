// require("dotenv").config({path: "./env"});
// isse bhi chl jaayga but better version h joh use krte h because import db here require

import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: "./env"
})

connectDB()














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