import {Job} from "../modals/jobModal.js";
import {User} from "../modals/userModal.js";



// for admin
export const postjob = async (req,res)=>{
    try {
        const {title , description , salary , location , jobType , position , requirements , experienceLevel , company} = req.body;
        const createdBy = req.id;
        const fields = {title , description , salary , location , jobType , position , company , createdBy , experienceLevel , requirements:requirements?.split(",")};
        if(!title || !description || !salary || !location || !jobType || !position){
            return res.status(400).json({
                message:"something is missing...",
                success:false
            });
        };

        const user = await User.findById(req.id);
        if(user.role !== "recruiter"){
            return res.status(400).json({
                message:"you can't create a job...",
                success:false
            });
        }

        const job = await Job.create(fields);
        res.status(201).json({
            message:"Job created",
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
        
    }
};


// for students

export const getAllJobs = async (req,res)=>{
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or:[
                {title:{$regex:keyword, $options:"i"}},
                {description:{$regex:keyword, $options:"i"}},

            ]
        };
        const jobs = await Job.find(query).populate({
            path:"company"
        }).sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            });
        };
        return res.status(200).json({
            jobs,
            success:true
        })
    } catch (error) {
        console.log(error)
        
    };
};



// for students
export const getJobById = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications"
        });
        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            });
        }
        return res.status(200).json({
            job,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAdminJobs = async (req,res)=>{
    try {
        const adminId = req.id;
        const jobs = await Job.find({createdBy:adminId}).populate({
            path:"company",
            createdAt:-1
        });
        if(jobs.length === 0){
            return res.status(404).json({
                message:"Jobs not found",
                success:false
            });
        };
        res.status(200).json({
            jobs,
            success:true
        });
    } catch (error) {
        console.log(error)
    }
}
