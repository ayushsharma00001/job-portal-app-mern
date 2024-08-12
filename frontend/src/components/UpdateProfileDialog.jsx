import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setAuthUser } from "@/redux/authSlice";
import { toast } from "sonner";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const {authUser} = useSelector(store=>store.auth)
  const [input,setInput] = useState({
    fullName:authUser?.fullName,
    email:authUser?.email,
    phoneNumber:authUser?.phoneNumber,
    bio:authUser?.profile?.bio,
    skills:authUser?.profile?.skills?.map(skill=>skill),
    file:authUser?.profile?.resume
  })
  const dispatch = useDispatch();
  const changeEventHandler = (e)=>{
    setInput({...input , [e.target.name]:e.target.value})
  }
  const fileChangeHandler = (e)=>{
    const file = e.target.files?.[0];
    setInput({...input , file});
  }
  const submitHandler = async(e)=>{
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName",input.fullName);
    formData.append("email",input.email);
    formData.append("phoneNumber",input.phoneNumber);
    formData.append("bio",input.bio);
    formData.append("skills",input.skills);
    if(input.file){
        formData.append("file",input.file);
    }

    try {
        setLoading(true);
        const res = await axios.post(`${USER_API_END_POINT}/profile/update`,formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            },
            withCredentials:true
        });
        if(res.data.success){
            dispatch(setAuthUser(res.data.user));
            toast.success(res.data.message)
        }
        setOpen(false);
    } catch (error) {
        if(error.response.data.message){
            toast.error(error.response.data.message)
        }
        else if(error.message){
            toast.error(error.message)
        }
        else{
            toast.error("Something went wrong");
        }
        console.log(error);
        
    }finally{
      setLoading(false);
    }
  }
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          className="sm:max-w-[425px]"
          onInteractOutside={() => setOpen(false)}
        >
          <DialogHeader>
            <DialogTitle>Update Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitHandler}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  name="fullName"
                  placeholder="Your fullname"
                  value={input.fullName}
                  onChange={changeEventHandler}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="email1" className="text-right">
                  Email
                </Label>
                <Input
                  id="email1"
                  className="col-span-3"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={input.email}
                  onChange={changeEventHandler}

                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="number" className="text-right">
                  Phone Number
                </Label>
                <Input
                  id="number"
                  className="col-span-3"
                  name="phoneNumber"
                  type="number"
                  placeholder="Your Phone Number"
                  value={input.phoneNumber}
                  onChange={changeEventHandler}

                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="bio1" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio1"
                  className="col-span-3"
                  name="bio"
                  placeholder="Your bio"
                  value={input.bio}
                  onChange={changeEventHandler}

                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="skills1" className="text-right">
                  skills
                </Label>
                <Input
                  id="skills1"
                  className="col-span-3"
                  name="skills"
                  placeholder="Enter skills seperated with , (comma)"
                  value={input.skills}
                  onChange={changeEventHandler}

                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4 ">
                <Label htmlFor="resume1" className="text-right">
                  Resume
                </Label>
                <Input
                  id="resume1"
                  className="col-span-3"
                  name="resume"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  
                />
              </div>
            </div>
          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                <Loader2 className="m2-2 h-4 animate-spin">Please wait</Loader2>
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateProfileDialog;
