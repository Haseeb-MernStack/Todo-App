import React, { useState } from 'react'
import { Input } from '@headlessui/react';
import { Button } from '@headlessui/react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();
    const changeHandler = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const loginHandler = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8000/api/v1/user/login",
                user,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true, // for cookie
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center w-full bg-[#555a54] h-screen gap-2'>
            <Input
                name='email'
                value={user.email}
                onChange={changeHandler}
                className="w-1/5 border-[2px] rounded-sm py-2 active:outline-blue-800 outline-blue-500 px-4 border-[#272c39] placeholder:text-[#272c39]"
                type="text"
                placeholder='Email' />
            <Input
                name='password'
                value={user.password}
                onChange={changeHandler}
                className="w-1/5 border-[2px] rounded-sm py-2 active:outline-blue-800 outline-blue-500 px-4 border-[#272c39] placeholder:text-[#272c39]"
                type="password"
                placeholder='Password' />
            <Button
                onClick={loginHandler}
                className="w-28 rounded py-[11px] font-medium px-4 text-sm text-white transition
                          bg-[#272c39]"
            >
                Login
            </Button>
        </div>
    )
}

export default Login
