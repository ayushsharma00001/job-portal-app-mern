import { setSingleCompany } from "@/redux/companySlice";
import { COMPANY_API_END_POINT} from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get/${companyId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleCompany(res?.data?.company));
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
    fetchSingleCompany();
  }, [companyId,dispatch]);
};

export default useGetCompanyById;
