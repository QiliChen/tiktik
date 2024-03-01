import React, {useEffect, useState} from "react";
import {IoLogInOutline} from "react-icons/io5";
import {BiSolidUserAccount} from "react-icons/bi";
import {GoogleLogin} from "@react-oauth/google";
import {BASE_URL, createOrGetUser} from "../utils";
import axios from "axios";
import {useRouter} from "next/router";
import useAuthStore from "../store/authStore";
import {Bounce, toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {motion} from 'framer-motion';

interface User {
    userName: string;
    username: string;
    password: string;
    type: string;
}

const Login = () => {
    const [userInput, setUserInput] = React.useState<User>({
        username: "",
        password: "",
        userName: "",
        type: "Web",
    });

    const {addUser, isLoggedIn} = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isLoggedIn()) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    function extracted() {
        toast("login successful! ", {
            position: "top-center",
            autoClose: 1500, // 1.5秒后自动关闭
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
            onClose: () => router.push("/") // 在弹窗关闭后重定向到登录页面
        });
    }

    const checkUserPassword = async () => {
        if (!userInput.username.trim() || !userInput.password.trim()) {
            toast("Username and password are required.", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            return;
        }

        const response = await axios.get(`${BASE_URL}/api/users`);
        const users = response.data;
        let foundUser = false;

        users.forEach((user: User) => {
            if (user.type === "Web" && userInput.username === user.userName && userInput.password === user.password) {
                addUser(user);
                extracted();
                foundUser = true;
            }
        });

        if (!foundUser) {
            toast("Username or password is incorrect", {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        }
    };

    const containerVariants = {
        hidden: {
            opacity: 0
        },
        visible: {
            opacity: 1,
            transition: {duration: 0.5} // 动画过渡属性
        }
    };

    // @ts-ignore
    const handleLoginSuccess = async (response) => {
        await createOrGetUser(response, addUser); // 处理用户登录信息
        extracted();
    };

    return (
            <div className="flex flex-col justify-center items-center h-screen">
                <ToastContainer/>
                <motion.div // 使用 motion.div 替代 div
                    className="max-w-md w-full p-8 bg-white rounded-md"
                    variants={containerVariants} // 应用动画变量
                    initial="hidden" // 初始状态
                    animate="visible" // 动画结束状态
                >
                    <div className="max-w-md w-full p-8 bg-white shadow-md rounded-md">
                        <h1 className="text-3xl font-semibold mb-6 text-center">Login</h1>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-md font-medium text-gray-600 mb-1">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="rounded-md outline-none text-md border-2 border-gray-200 p-2 w-full"
                                placeholder="Enter your username"
                                onChange={(e) => setUserInput({...userInput, username: e.target.value})}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-md font-medium text-gray-600 mb-1">
                                Password:
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="rounded-md outline-none text-md border-2 border-gray-200 p-2 w-full"
                                placeholder="Enter your password"
                                onChange={(e) => setUserInput({...userInput, password: e.target.value})}
                            />
                        </div>
                        <div className="flex justify-between items-center space-x-8">
                            <button
                                className="rounded-md border-2 h-12 px-6 text-md font-semibold flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                onClick={checkUserPassword}
                            >
                                <IoLogInOutline className="text-xl"/>
                                <span>Login</span>
                            </button>

                            <button
                                className="rounded-md border-2 h-12 px-6 text-md font-semibold flex items-center gap-2 bg-gray-200 hover:bg-gray-300 transition-colors"
                                onClick={() => router.push("/register")}
                            >
                                <BiSolidUserAccount className="text-xl"/>
                                <span>Register</span>
                            </button>
                        </div>

                        <div className="mt-4">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={() => console.log("Login Failed")}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
            );

};

export default Login;
