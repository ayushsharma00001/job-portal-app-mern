import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser, setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);
  const { authUser } = useSelector((store)=>store.auth);


  const changeEventHandler = (e) => {
    setInput((currInput) => {
      return { ...currInput, [e.target.name]: e.target.value };
    });
  };

  const changeFileHandler = (e) => {
    setInput((currInput) => {
      return { ...currInput, file: e.target.files?.[0] };
    });
  };
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        toast.error(error.response.data.message);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };
  useEffect(()=>{
    if(authUser){
      navigate("/");
    }
  },[])

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={onSubmitHandler}
          className="w-1/2 border border-gray-200 rounded-md p-4 my-10"
        >
          <h1 className="font-bold text-xl mb-5">Sign up</h1>
          <div className="my-2">
            <Label htmlFor="fullName1">Full Name</Label>
            <Input
              type="text"
              placeholder="Ayush"
              id="fullName1"
              name="fullName"
              value={input.fullName}
              onChange={changeEventHandler}
            />
          </div>
          <div className="my-2">
            <Label htmlFor="email1">Email</Label>
            <Input
              type="email"
              placeholder="example@gmail.com"
              id="email1"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
            />
          </div>
          <div className="my-2">
            <Label htmlFor="phoneNumber1">Phone Number</Label>
            <Input
              type="number"
              placeholder="869083XXXX"
              id="phoneNumber1"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
            />
          </div>
          <div className="my-2">
            <Label htmlFor="password1">Password</Label>
            <Input
              type="password"
              placeholder="your password"
              id="password1"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
            />
          </div>
          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  id="r1"
                  value="student"
                  className="cursor-pointer"
                  checked={input.role === "student"}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="r1" className="cursor-pointer">
                  Student
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="role"
                  id="r2"
                  value="recruiter"
                  className="cursor-pointer"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                />
                <Label htmlFor="r2" className="cursor-pointer">
                  Recruiter
                </Label>
              </div>
            </RadioGroup>
            <div className="flex items-center gap-2">
              <Label htmlFor="profile1" className="cursor-pointer">
                Profile
              </Label>
              <Input
                accept="image/*"
                type="file"
                className="cursor-pointer"
                id="profile1"
                onChange={changeFileHandler}
              />
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4">
              <Loader2 className="m2-2 h-4 animate-spin">Please wait</Loader2>
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Sign up
            </Button>
          )}
          <span className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600">
              login
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Signup;
