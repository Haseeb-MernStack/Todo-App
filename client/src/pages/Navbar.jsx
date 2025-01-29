import React from 'react'
import { Button } from '@headlessui/react';
import axios from 'axios';
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/v1/user/logout");
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      alert(error.message);
    }
  }
  return (
    <div className='bg-[#15919B] max-w-6xl mx-auto border-[1px] rounded-md border-[#5650DE]'>
      <div className='flex items-center justify-between p-4'>
        <h1 className='font-bold text-lg text-[#FFF7EC]'>{"Haseeb MernStack"}</h1>
        <Button
          onClick={logoutHandler}
          className="rounded py-2 px-4 text-sm font-medium text-[#FFF7EC] transition bg-[#0C6478] border-2 border-[#FFF7EC] "
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

export default Navbar
