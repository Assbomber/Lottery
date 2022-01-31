import express,{Application} from "express";
import dotenv from "dotenv";
import log from "./utils/logger";
import mongoose from "mongoose";
import auth from "./routes/auth";

const app:Application= express();

//dotenv config for environment variables
dotenv.config();

//To enable json requests in body
app.use(express.json());

//redirecting routes
app.use("/api/auth",auth);


//starting server
app.listen(process.env.PORT || 3000,()=>{
    log.info("Server up and running on port "+process.env.PORT || 3000);

    //Connecting to mongodb Atlas
    mongoose.connect(process.env.MONGODB_URL as string)
    .then(()=>log.info("Connected to MongoDB"))
    .catch((e)=>log.error("Error connecting to MongoDB. "+e.message));




});