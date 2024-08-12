import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import dotenv from "dotenv"
import connectDb from "./utils/db.js";
dotenv.config({});

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOptions = {
    origin:'http://localhost:5173',
    credentials:true
};
app.use(cors(corsOptions));



// importing routes

import userRoutes from "./routes/userRoutes.js";
import companyRoute from "./routes/companyRoute.js"
import jobRoute from "./routes/jobRoute.js";
import ApplicationRoute from "./routes/applicationRoute.js";

// using api's

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/company",companyRoute);
app.use("/api/v1/job",jobRoute);
app.use("/api/v1/application",ApplicationRoute);





app.get("/home",(req,res)=>{
    return res.status(200).json({
        message:"Home page",
        success:true
    })
})


const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    connectDb()
    console.log(`App is listening on port ${PORT}`)
})