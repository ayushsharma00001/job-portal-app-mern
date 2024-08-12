import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import axios from "axios";

const CompanySetup = () => {
  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });
  const params = useParams();
  useGetCompanyById(params.id)
  const {singleCompany} = useSelector(store=>store.company)
  const [loading,setLoading] = useState(false);
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const changeFileHandler = (e)=>{
    const file = e.target.files?.[0];
    setInput({...input,file})
  }
  const submitHandler = async(e)=>{
    e.preventDefault();
    console.log(input)
    const formData = new FormData();
    formData.append("name",input.name);
    formData.append("description",input.description);
    formData.append("website",input.website);
    formData.append("location",input.location);
    if(input.file){
        formData.append("file",input.file);
    }
    try {
        setLoading(true);
        const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
            withCredentials:true
        });
        if(res.data.success){
            navigate("/admin/companies")
            toast.success(res?.data?.message)
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
  useEffect(()=>{
    setInput({
        name: singleCompany.name || "",
        description:singleCompany.description || "",
        website:singleCompany.website || "",
        location:singleCompany.location || "",
        file: singleCompany.file || null,
    });
  },[singleCompany]);
  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 p-8">
            <Button
                onClick={()=>navigate("/admin/companies")}
              variant="outline"
              className="flex items-center gap-2 text-gray-500 font-semibold"
            >
              <ArrowLeft />
              <span>Back</span>
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                type="text"
                name="name"
                value={input.name}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Company Website</Label>
              <Input
                type="text"
                name="website"
                value={input.website}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Company Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>
            <div>
              <Label>Company Logo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={changeFileHandler}
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full mt-8">
              <Loader2 className="m2-2 h-4 animate-spin">Please wait</Loader2>
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-8">Save</Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default CompanySetup;
