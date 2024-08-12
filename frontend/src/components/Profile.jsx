import React, { useState } from "react";
import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";
const isResume = true;
const Profile = () => {
  useGetAppliedJobs();
  const [open,setOpen] = useState(false);
  const {authUser} = useSelector(store=>store.auth);
  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8">
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={authUser?.profile?.profilePhoto?authUser.profile.profilePhoto:"https://github.com/shadcn.png"}
                alt="profile-photo"
              />
            </Avatar>
            <div>
              <h1 className="font-medium text-xl">{authUser?.fullName}</h1>
              <p>
                {
                  authUser?.profile?.bio
                }
              </p>
            </div>
          </div>
          <Button className="text-right" variant="outline" onClick={()=>setOpen(true)}>
            <Pen />
          </Button>
        </div>
        <div className="my-5">
          <div className="flex items-center gap-3 my-2">
            <Mail />
            <span>{authUser?.email}</span>
          </div>
          <div className="flex items-center gap-3 my-2">
            <Contact />
            <span>{authUser?.phoneNumber}</span>
          </div>
        </div>
        <div className="my-5">
            <h1 className="text-md font-bold">Skills</h1>
            <div className="flex items-center gap-1 my-2">
            {
                authUser?.profile?.skills?authUser?.profile?.skills?.map((item,idx) => (<Badge key={idx}>{item}</Badge>)): <span className="text-sm text-gray-500">skills not added yet</span>
            }
            </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-md font-bold">Resume</Label>
            {
                isResume?<a className="text-blue-500 w-full hover:underline cursor-pointer" href={authUser?.profile?.resume} target="_blank">{authUser?.profile?.resumeOriginalName}</a>:<span className="text-sm text-gray-500">Resume not added yet</span>
            }
        </div>
      </div>
        <div className="max-w-4xl mx-auto bg-white rounded-2xl">
            <h1 className="font-bold text-lg my-5">Applied jobs</h1>
            {/* Application table  */}
            <AppliedJobTable/>
        </div>
        <UpdateProfileDialog open={open} setOpen={setOpen}/>
    </div>
  );
};

export default Profile;
