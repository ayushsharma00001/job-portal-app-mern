import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName , setCompanyName] = useState(""); 
    const dispatch = useDispatch();
    const registerNewCompany = async()=>{
        try {
            const res = await axios.post(`${COMPANY_API_END_POINT}/register`,{companyName},{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true
            });
            if(res?.data?.success){
                const companyId = res?.data?.company?._id
                dispatch(setSingleCompany(res?.data?.company))
                navigate(`/admin/companies/${companyId}`);
                toast.success(res?.data?.message);
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
    }
  return (
    <div>
        <Navbar/>
        <div className="max-w-4xl mx-auto">
            <div className='my-10'>
                <h1 className='font-bold text-2xl'>Your Company Name</h1>
                <p>What would you like to give your company name? You can change this later</p>
            </div>
            <Label htmlFor="company1">CompanyName</Label>
            <Input type="text" className="my-2" placeholder="JobHunt, Microsoft etc." id="company1" onChange={(e)=>setCompanyName(e.target.value)} value={companyName}/>
            <div className="flex items-center gap-2 my-10">
                <Button variant="outline" onClick={()=>navigate("/admin/companies")}>cancel</Button>
                <Button onClick={registerNewCompany}>Continue</Button>
            </div>
        </div>
    </div>
  )
}

export default CompanyCreate