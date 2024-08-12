import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import axios from "axios";

const companyArray = [];
const PostJob = () => {
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: 5,
    location: "",
    jobType: "",
    experienceLevel: "",
    position: 0,
    company: "",
  });
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const selectChangeHandler = (value)=>{
    setInput({...input,company:value})
  }
  const submitHandler = async(e)=>{
    e.preventDefault();
    try {
        setLoading(true);
        const res = await axios.post(`${JOB_API_END_POINT}/post`,input,{
            headers:{
                'Content-Type':'application/json'
            },
            withCredentials:true
        });
        if(res.data.message){
            navigate("/admin/jobs");
            toast.success(res?.data?.message);
        }
        
    } catch (error) {
        if(error?.response?.data?.message){
            toast.error(error.response.data.message);
        }
        else if(error.message){
            toast.error(error.message);
        }
        else{
            toast.error("Something went wrong...")
        }
        console.log(error)
        
    }finally{
        setLoading(false);
    }
  }
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="title1" className="cursor-pointer">
                Title
              </Label>
              <Input
                type="text"
                id="title1"
                placeholder="Job Title"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="title"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="description1" className="cursor-pointer">
                Description
              </Label>
              <Input
                type="text"
                id="description1"
                placeholder="Job Description"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="requirements1" className="cursor-pointer">
                Requirements
              </Label>
              <Input
                type="text"
                id="requirements1"
                placeholder="provide by giving comma's"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="salary1" className="cursor-pointer">
                Salary
              </Label>
              <Input
                type="number"
                id="salary1"
                placeholder="Only in digits as it reflects LPA to the appliers"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="location1" className="cursor-pointer">
                Location
              </Label>
              <Input
                type="text"
                id="location1"
                placeholder="Job location"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="jobType1" className="cursor-pointer">
                Job Type
              </Label>
              <Input
                type="text"
                id="jobType1"
                placeholder="e.g. full time , part time"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="experience1" className="cursor-pointer">
                Experience
              </Label>
              <Input
                type="text"
                id="experience1"
                placeholder="Experience"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="experienceLevel"
                value={input.experienceLevel}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label htmlFor="position1" className="cursor-pointer">
                Position
              </Label>
              <Input
                type="number"
                id="position1"
                placeholder="No of positions"
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>
            {companies?.length >= 0 && (
              <Select onValueChange={selectChangeHandler} required>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>companies</SelectLabel>
                    {companies?.map((company) => {
                      return <SelectItem key={company?._id} value={company?._id}>{company.name}</SelectItem>;
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          </div>
          {loading ? (
            <Button className="w-full mt-8">
              <Loader2 className="m2-2 h-4 animate-spin">Please wait</Loader2>
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-8">Post New Job</Button>
          )}
          {companies?.length === 0 && (
            <p className="text-xs text-red-600 font-bold text-center my-3">
              *Please register a company first, before posting a job
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob;
