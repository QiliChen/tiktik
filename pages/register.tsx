import {Bounce, toast, ToastContainer} from "react-toastify";
import {motion} from "framer-motion";
import Image from "next/image";
import Logo from "../utils/tiktik-logo.png";
import {GoogleLogin} from "@react-oauth/google";
import React, {useEffect, useState} from "react";
import router, {useRouter} from "next/router";
import useAuthStore from "../store/authStore";
import data from "../utils/data.json";
import {uploadToOSS} from "./api/oss/uploadToOSS";
import axios from "axios";
import {BASE_URL} from "../utils";
import {generateRandomString} from "../utils/tools";
import {FiUpload} from "react-icons/fi";
import 'react-toastify/dist/ReactToastify.css';

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
    const [uploadedImage, setUploadedImage] = useState(null);
    const [isLocked, setIsLocked] = useState(false);
    const [userRePassword, setUserRePassword] = useState('');

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

    const handleImageUpload = async (e: { target: { files: any[]; }; }) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            try {
                const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
                if (!allowedExtensions.exec(selectedFile.name)) {
                    throw new Error('Unsupported file type. Please select an image.');
                }

                const reader = new FileReader();
                reader.onload = async (event) => {
                    const img = document.createElement('img');
                    img.onload = async () => {
                        const minSide = Math.min(img.width, img.height);
                        const offsetX = (img.width - minSide) / 2;
                        const offsetY = (img.height - minSide) / 2;

                        const canvas = document.createElement('canvas');
                        canvas.width = minSide;
                        canvas.height = minSide;
                        const ctx = canvas.getContext('2d');
                        // @ts-ignore
                        ctx.drawImage(img, offsetX, offsetY, minSide, minSide, 0, 0, minSide, minSide);
                        canvas.toBlob(async (blob) => {
                            // @ts-ignore
                            const newFile = new File([blob], selectedFile.name, { type: 'image/png' });
                            const ossImageUrl = await uploadToOSS(newFile);
                            // @ts-ignore
                            setUploadedImage(ossImageUrl);
                            // @ts-ignore
                            setSelectedImage(ossImageUrl);
                            setIsLocked(true);
                        }, 'image/png');
                    };
                    // @ts-ignore
                    img.src = event.target.result;
                };
                reader.readAsDataURL(selectedFile);
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Error uploading image');
            }
        }
    };



    const [userInput, setUserInput] = React.useState<User>({
        username: '',
        password: '',
        userName: '',
        image: '',
        type: 'Web'
    });


    async function clickRegister() {
        let errorMessage = '';
        if (userInput.username === '' || userInput.username.length < 3 || userInput.username.length > 15) {
            errorMessage = 'Username must be between 3 and 15 characters';
        } else if (userRePassword !== userInput.password) {
            errorMessage = 'The passwords entered twice are inconsistent';
        } else if (userInput.password === '' || userInput.password.length < 3 || userInput.password.length > 15) {
            errorMessage = 'Password must be between 3 and 15 characters';
        }else if (selectedImage === null) {
            errorMessage = 'Please select an image';
        } else {
            await setUserInput({...userInput, image: selectedImage, userName: userInput.username});
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
            image: selectedImage,
            password: userInput.password
        };


        try {
            const axiosResponse = await axios.post(`${BASE_URL}/api/auth`, user);
            if (axiosResponse.status === 200) {
                localStorage.setItem('user', JSON.stringify(user));
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

    function clickUpload() {
        if (uploadedImage === null) {
            // @ts-ignore
            document.getElementById('avatarUpload').click();
        }else {
            toast("You can only upload one image", {
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


    return (
        <div className="relative py-3 sm:max-w-xl sm:mx-auto w-3/5">
            <ToastContainer/>
            <motion.div
                className="max-w-md w-full p-8 bg-white rounded-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
            >
                <div
                    className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10"
                >
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-5 justify-center">
                            <div className='w-[100px] md:w-[129px] md:h-[30px] h-[38px]'>
                                <Image
                                    src={Logo}
                                    alt='logo'
                                    layout='responsive'
                                />
                            </div>
                        </div>
                        <div className="mt-5">
                            <label
                                className="font-semibold text-sm text-gray-600 pb-1 block"
                                htmlFor="login"
                            >Username</label
                            >
                            <input
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                                type="text"
                                id="login"
                                onChange={(e) => setUserInput({...userInput, username: e.target.value, userName: e.target.value})}
                            />
                            <label
                                className="font-semibold text-sm text-gray-600 pb-1 block"
                                htmlFor="password"
                            >Password</label
                            >
                            <input
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                                type="password"
                                id="password"
                                onChange={(e) => setUserInput({...userInput, password: e.target.value})}
                            />
                            <label
                                className="font-semibold text-sm text-gray-600 pb-1 block"
                                htmlFor="password"
                            >Confirm Password</label>
                            <input
                                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                                type="password"
                                id="RePassword"
                                onChange={(e) => setUserRePassword(e.target.value)}
                            />
                        </div>
                        <div className="text-right mb-2">
                            <a
                                className="text-xs font-display font-semibold text-gray-500 hover:text-gray-600 cursor-pointer"
                                href="#"
                            >
                            </a>
                        </div>
                        <div className="text-right mb-2">
                            <h3 className="text-xs text-center sm:text-sm font-medium text-gray-700 mb-2 h-8" >Select Your Avatar:</h3>
                        </div>
                        <div className="flex justify-center w-full items-center">
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {images.map((imageUrl, index) => (
                                    <div
                                        key={index}
                                        onClick={() => !isLocked && setSelectedImage(imageUrl)}
                                        className={`cursor-pointer w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-cover bg-center rounded-full overflow-hidden border-4 ${imageUrl === selectedImage ? 'border-blue-500 scale-105 sm:scale-110' : 'border-transparent'} transition-all ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{backgroundImage: `url(${imageUrl})`}}
                                    />
                                ))}
                                <div
                                    className={`cursor-pointer w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 flex justify-center items-center rounded-full overflow-hidden border-4 ${uploadedImage ? 'border-blue-500 scale-105 sm:scale-110' : 'border-dashed border-gray-300'} transition-all hover:border-blue-500 hover:scale-105 sm:hover:scale-110`}
                                    onClick={clickUpload}
                                >
                                    {uploadedImage ? (
                                        <div
                                            className="w-full h-full bg-cover bg-center rounded-full"
                                            style={{backgroundImage: `url(${uploadedImage})`}}
                                        />
                                    ) : (
                                        <FiUpload className="text-xl text-gray-400"/>
                                    )}
                                    <input
                                        type="file"
                                        id="avatarUpload"
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-5">
                            <button
                                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                                type="submit"
                                onClick={clickRegister}
                            >
                                Register
                            </button>
                        </div>
                        <div className="flex items-center justify-center mt-2"
                             onClick={() => router.push('/login')}


                        >
                            <span className="border-b dark:border-gray-600 items-center"></span>
                            <button
                                className="overflow-hidden w-24 p-1 h-8  border-none rounded-md  text-xs font-bold cursor-pointer relative z-10 group"
                            >
                                Back
                                <span
                                    className="absolute w-28 h-24 -top-6 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-right"
                                ></span>
                                <span
                                    className="absolute w-28 h-24 -top-6 -left-2 bg-blue-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-right"
                                ></span>
                                <span
                                    className="absolute w-28 h-24 -top-6 -left-2 bg-blue-700 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-right"
                                ></span>
                                <span
                                    className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1.5 left-4 z-10 text-sm text-white"
                                >← Log in</span
                                >

                            </button>


                        </div>

                    </div>
                </div>
            </motion.div>
        </div>

    )
}

export default Register