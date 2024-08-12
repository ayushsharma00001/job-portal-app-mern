import { setCompanies } from "@/redux/companySlice";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        });
        console.log(res)
        if (res.data.success) {
          console.log(res.data.companies);
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        if(error.response.data.message){
            toast.error(error.response.data.message);
        }
        else if(error.message){
            toast.error(error.message);
        }
        else{
            toast.error("Something went wrong...")
        }
        console.log(error)
      }
    };
    fetchAllCompanies();
  },[]);
};

export default useGetAllCompanies;
