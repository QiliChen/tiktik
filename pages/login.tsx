import Image from "next/image";
import Logo from "../utils/tiktik-logo.png";
import React, {useEffect} from "react";
import {useRouter} from "next/router";
import useAuthStore from "../store/authStore";
import {Bounce, toast, ToastContainer} from "react-toastify";
import axios from "axios";
import {BASE_URL, createOrGetUser} from "../utils";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'next-i18next'
import { withStaticTranslations } from '../utils/I18';
export const getStaticProps = withStaticTranslations(['common']);

interface User {
    userName: string;
    username: string;
    password: string;
    type: string;
}
const Login = () => {

    const { t } = useTranslation('common');
    const [userInput, setUserInput] = React.useState<User>({
        username: "",
        password: "",
        userName: "",
        type: "Web",
    });

    const {addUser, isLoggedIn} = useAuthStore();
    const [localUser, setLocalUser] = React.useState<User | null>(null);
    const [localUserMsg, setLocalUserMsg] = React.useState<string | null>("");
    const router = useRouter();
    const [localUserImg, setLocalUserImg] = React.useState<string | null>(null);
    const [registerLogin, setRegisterLogin] = React.useState<boolean>(false);

    useEffect(() => {
        if (isLoggedIn()) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        const userString = localStorage.getItem("user"); // 获取localStorage中的"user"项

        if (userString) { // 确保"user"项存在且不为null或undefined
            setRegisterLogin(true);
            const userObject = JSON.parse(userString); // 解析"user"项的字符串
            setLocalUser(userObject); // 设置用户对象状态

            if (userObject.image) { // 检查解析后的用户对象是否包含image属性
                setLocalUserImg(userObject.image); // 如果存在，则设置用户图像状态
                setLocalUserMsg(`${t("common:login-register-prefix")} ${userObject.userName} ${t("common:login-register-suffix")}`);
            }
        }else {
            setRegisterLogin(false);
        }
    }, []);


    function extracted() {
        toast(t('common:login-message-success'), {
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

    const checkUserInput = () => {
        if (!userInput.username.trim() || !userInput.password.trim()) {
            toast(t('common:login-message-fail-1'), {
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
        checkUserPassword();
    }

    const checkUserPassword = async () => {

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
            toast(t('common:login-message-fail-1'), {
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

    // @ts-ignore
    const handleLoginSuccess = async (response) => {
        console.log(response);
        await createOrGetUser(response, addUser); // 处理用户登录信息
        extracted();
    };


    function backUserClick() {
        // 假设localUser中存储了用户名和密码
        if (localUser) {

            setUserInput({
                ...userInput,
                username: localUser.userName, // 确保这里的属性与你的state结构匹配
                password: localUser.password, // 同上
                userName: localUser.userName, // 同上
                type: localUser.type, // 同上
            });

            userInput.username = localUser.userName; // 确保这里的属性与你的state结构匹配
            userInput.password = localUser.password; // 同上

            // 然后自动发起登录请求
            checkUserPassword();
            localStorage.removeItem("user")
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
                        >{t("common:Username")}</label
                        >
                        <input
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            type="text"
                            id="login"
                            onChange={(e) => setUserInput({...userInput, username: e.target.value})}

                        />
                        <label
                            className="font-semibold text-sm text-gray-600 pb-1 block"
                            htmlFor="password"
                        >{t("common:Password")}</label
                        >
                        <input
                            className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            type="password"
                            id="password"
                            onChange={(e) => setUserInput({...userInput, password: e.target.value})}
                        />
                    </div>
                    <div className="text-right mb-4">
                        <a
                            className="text-xs font-display font-semibold text-gray-500 hover:text-gray-600 cursor-pointer"
                            href="#"
                        >
                        </a>
                    </div>
                    <div className="flex justify-center w-full items-center">
                        <div>
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={() => console.log('Login Failed')}
                            />
                        </div>
                    </div>

                    {registerLogin && (
                        <div className="flex justify-center w-full items-center mt-5">
                            <button
                                className="flex justify-center items-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg gap-4"
                                onClick={backUserClick}
                            >
                                <img src={localUserImg || 'path_to_default_avatar'} alt="Avatar" className="w-6 h-6 rounded-full"/>
                                {` ${localUserMsg}`}

                            </button>
                        </div>
                    )}
                    <div className="mt-5">
                        <button
                            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                            type="submit"
                            onClick={checkUserInput}
                        >
                            {t("common:Login")}
                        </button>
                    </div>
                    <div className="flex items-center justify-center mt-2"
                         onClick={() => router.push('/register')}


                    >
                        <span className="border-b dark:border-gray-600 items-center"></span>
                        <button
                            className="overflow-hidden w-24 p-1 h-8  border-none rounded-md  text-xs font-bold cursor-pointer relative z-10 group"
                        >
                            {t("common:NoAccount")}
                            <span
                                className="absolute w-28 h-24 -top-6 -left-2 bg-white rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-500 duration-1000 origin-left"
                            ></span>
                            <span
                                className="absolute w-28 h-24 -top-6 -left-2 bg-blue-400 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-700 duration-700 origin-left"
                            ></span>
                            <span
                                className="absolute w-28 h-24 -top-6 -left-2 bg-blue-700 rotate-12 transform scale-x-0 group-hover:scale-x-100 transition-transform group-hover:duration-1000 duration-500 origin-left"
                            ></span>
                            <span
                                className="group-hover:opacity-100 group-hover:duration-1000 duration-100 opacity-0 absolute top-1.5 left-4 z-10 text-sm text-white"
                            >{t("common:SignUp")} →</span
                            >

                        </button>


                    </div>
                </div>
            </div>
            </motion.div>
        </div>

    )
}

export default Login;