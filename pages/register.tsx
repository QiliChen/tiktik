import React, {useEffect, useState} from "react";
import {BiSolidUserAccount} from "react-icons/bi";
import {BASE_URL} from "../utils";
import axios from "axios";
import {router} from "next/client";
import data from '../utils/data.json';
import {useRouter} from 'next/router';

import {ToastContainer, toast, Bounce} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {IoMdArrowRoundBack} from "react-icons/io";
import {generateRandomString} from "../utils/tools";
import useAuthStore from "../store/authStore";
import {motion} from "framer-motion";


interface User {
    userName: string;
    username: string;
    password: string;
    type: string;
    image: string;
}


const Register = () => {

    const {addUser, isLoggedIn} = useAuthStore(); // 假设 useAuthStore 提供了 isLoggedIn 方法

    useEffect(() => {
        // Assuming data.json is a valid JSON file
        // @ts-ignore
        setImages(data?.images);
    }, []);

    useEffect(() => {
        // 检查用户是否已登录
        if (isLoggedIn()) {
            router.push('/'); // 如果已登录，重定向到主页
        }
    }, [isLoggedIn]); // 依赖项包括 isLoggedIn 和 router

    const [images, setImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [error, setError] = useState<string>('')

    const router = useRouter();

    useEffect(() => {
        // Assuming data.json is a valid JSON file
        // @ts-ignore
        setImages(data.images);
    }, []);

    // @ts-ignore
    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setUserInput({...userInput, image: imageUrl})
    };


    const [userInput, setUserInput] = React.useState<User>({
        username: '',
        password: '',
        userName: '',
        image: '',
        type: 'Web'
    });


    function clickRegister() {
        let errorMessage = '';
        if (userInput.username === '' || userInput.username.length < 3 || userInput.username.length > 15) {
            errorMessage = 'Username must be between 3 and 15 characters';
        } else if (userInput.password === '' || userInput.password.length < 3 || userInput.password.length > 15) {
            errorMessage = 'Password must be between 3 and 15 characters';
        } else if (selectedImage === null) {
            errorMessage = 'Please select an image';
        } else {
            setUserInput({...userInput, image: selectedImage, userName: userInput.username});
            checkUserPassword();
            return; // 如果没有错误，直接返回，防止执行以下的错误处理代码
        }

        // 如果有错误，设置错误状态并显示 toast
        if (errorMessage !== '') {
            setError(errorMessage); // 保留这行可以在其他地方使用错误状态，如果需要的话
            toast(errorMessage, {
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
    }


    const checkUserPassword = async () => {
        const response = await axios.get(`${BASE_URL}/api/users`);
        const users = response.data;
        // @ts-ignore
        const errors = [];

        users.forEach((user: User) => {
            if (user.type === "Web" && userInput.username === user.userName) {
                errors.push("Username already exists, please choose another username");
            }
        });

        if (errors.length > 0) {
            // @ts-ignore
            const errorMessage = errors.join('\n');
            setError(errorMessage); // 保留这行可以在其他地方使用错误状态，如果需要的话
            toast(errorMessage, {
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
        } else {
            await postUser();
        }
    };


    const postUser = async () => {
        const randomString = generateRandomString(10);
        const user = {
            _id: randomString,
            _type: 'user',
            userName: userInput.userName,
            type: 'Web',
            image: userInput.image,
            password: userInput.password
        };

        try {
            const axiosResponse = await axios.post(`${BASE_URL}/api/auth`, user);
            if (axiosResponse.status === 200) {
                // 在重定向之前显示注册成功的弹窗提示
                toast("Registration successful! Redirecting to login...", {
                    position: "top-center",
                    autoClose: 1500, // 1.5秒后自动关闭
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                    onClose: () => router.push("/login") // 在弹窗关闭后重定向到登录页面
                });
            } else {
                throw new Error('An error occurred during registration');
            }
        } catch (error) {
            setError('An error occurred during registration');
            toast('An error occurred during registration', {
                position: "top-center",
                autoClose: 3000,
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


    return (
        <motion.div
            className="flex flex-col items-center justify-center min-h-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <div className="flex justify-center items-center h-screen mt-[-50px]">
                <div className="max-w-md p-8 bg-white shadow-md rounded-md">
                    <ToastContainer
                        position="top-center"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                    <h1 className="text-3xl font-semibold mb-6 text-center">Register</h1>

                    <div className="flex gap-6">
                        <div className="flex-1">
                            <label htmlFor="username" className="block text-md font-medium text-gray-600 mb-1">
                                Username:
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                className="rounded-md outline-none text-md border-2 border-gray-200 p-2 w-full"
                                placeholder="Enter your username"
                                onChange={(e) => setUserInput({
                                    ...userInput,
                                    userName: e.target.value,
                                    username: e.target.value
                                })}
                            />
                        </div>

                        <div className="flex-1">
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
                    </div>

                    <div className="mt-6 flex gap-6 ba">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold mb-4">Image Gallery</h2>
                            <div className="grid grid-cols-3 gap-4 ">
                                {images.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleImageClick(imageUrl)}
                                        className={`relative cursor-pointer w-12 h-12 ${
                                            imageUrl === selectedImage ? 'border-2 border-blue-500' : ''
                                        } rounded-full overflow-hidden`}
                                    >
                                        <div
                                            className="absolute w-full h-full rounded-full bg-light-blue-500 opacity-50"></div>
                                        <img
                                            src={imageUrl}
                                            alt={`Image ${index}`}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col justify-center items-center">
                            <div className="mb-1">
                                <div className="mb-1">
                                    <div className="text-center">
                                        <h2 className="text-md font-semibold mt-4">Your Image</h2>
                                    </div>
                                    <div className="flex items-center justify-center mt-2">
                                        {selectedImage && (
                                            <img
                                                src={selectedImage}
                                                alt="Selected Image"
                                                className="w-16 h-16 object-cover rounded-full"
                                            />
                                        )}
                                    </div>
                                </div>

                            </div>
                            <div className="mb-1"></div>

                            <div className="mb-1">
                                <button
                                    className="rounded-md border-2 h-12 px-4 text-md font-semibold flex items-center gap-2 bg-gray-200 hover:bg-gray-300 "
                                    onClick={clickRegister}
                                >
                                    <BiSolidUserAccount className="text-xl"/>
                                    <span className={"w-16"}>Register</span>
                                </button>
                                <div className="mb-1"></div>
                                <button
                                    className="rounded-md border-2 h-12 px-4 text-md font-semibold flex items-center gap-2"
                                    onClick={() => router.push("/login")}
                                >
                                    <IoMdArrowRoundBack className="text-xl"/>
                                    <span className={"w-16"}>Back</span>
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );

}

export default Register;