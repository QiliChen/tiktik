import type { AppProps } from 'next/app';
import Head from 'next/head'; // 导入 Head 组件
import { useEffect, useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../styles/globals.css';
import { appWithTranslation } from 'next-i18next';

import { useTranslation } from 'next-i18next'
import {withStaticTranslations} from "../utils/I18";
export const getStaticProps = withStaticTranslations(['common']);


const MyApp = ({ Component, pageProps }: AppProps) => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  if (isSSR) return null;

  return (
      <GoogleOAuthProvider clientId={`${process.env.NEXT_PUBLIC_GOOGLE_API_TOKEN}`}>
        <Head>
          {/* 添加全局头部信息，比如网站的 favicon，全局的 meta 信息等 */}
          {/*<link rel="icon" href="/favicon.ico" />*/}
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>TikTik</title> {/* 可以设置一个默认的页面标题 */}
        </Head>
        <div className='xl:w-[1200px] m-auto overflow-hidden h-[100vh]'>
          <Navbar />
          <div className='flex gap-6 md:gap-20'>
            <div className='h-[92vh] overflow-hidden xl:hover:overflow-auto'>
              <Sidebar />
            </div>
            <div className='mt-4 flex flex-col gap-10 overflow-auto h-[88vh] videos flex-1'>
              <Component {...pageProps} />
            </div>
          </div>
        </div>
      </GoogleOAuthProvider>
  );
};

export default appWithTranslation(MyApp);
