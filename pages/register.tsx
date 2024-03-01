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
            className="flex flex-col items-center justify-center min-h-screen p-4"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: { duration: 0.5 }
                }
            }}
        >
            <div className="w-full max-w-md bg-white shadow-md rounded-md p-4 sm:p-8">
                <ToastContainer/>
                <h1 className="text-2xl sm:text-3xl font-semibold mb-4 sm:mb-6 text-center">Register</h1>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full">
                        <label htmlFor="username"
                               className="block text-md font-medium text-gray-600 mb-1">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="rounded-md outline-none text-md border border-gray-200 p-2 w-full"
                            placeholder="Enter your username"
                            onChange={(e) => setUserInput({
                                ...userInput,
                                username: e.target.value,
                                userName: e.target.value
                            })}
                        />
                    </div>
                    <div className="w-full">
                        <label htmlFor="password"
                               className="block text-md font-medium text-gray-600 mb-1">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="rounded-md outline-none text-md border border-gray-200 p-2 w-full"
                            placeholder="Enter your password"
                            onChange={(e) => setUserInput({...userInput, password: e.target.value})}
                        />
                    </div>
                </div>
                <div className="mt-4 p-2 sm:p-4 bg-gray-50 rounded-lg shadow-inner">
                    <h3 className="text-sm sm:text-md font-medium text-gray-700 mb-2">Select Your Avatar:</h3>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4">
                        {images.map((imageUrl, index) => (
                            <div
                                key={index}
                                onClick={() => handleImageClick(imageUrl)}
                                className={`cursor-pointer w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-cover bg-center rounded-full overflow-hidden border-4 ${imageUrl === selectedImage ? 'border-blue-500 scale-105 sm:scale-110' : 'border-transparent'} transition-all`}
                                style={{backgroundImage: `url(${imageUrl})`}}
                            />
                        ))}
                    </div>
                </div>


                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
                    <button
                        className="w-full sm:w-auto px-4 py-2 rounded-md text-md font-semibold bg-gray-200 hover:bg-gray-300 transition-colors"
                        onClick={clickRegister}>
                        <BiSolidUserAccount className="inline mr-2 text-lg"/> Register
                    </button>
                    <button
                        className="w-full sm:w-auto px-4 py-2 rounded-md text-md font-semibold border border-gray-300 hover:bg-gray-100 transition-colors"
                        onClick={() => router.push("/login")}>
                        <IoMdArrowRoundBack className="inline mr-2 text-lg"/> Back
                    </button>
                </div>
            </div>
        </motion.div>
    );

}

export default Register;