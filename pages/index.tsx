import React from 'react';
import axios from 'axios';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'; // 引入 serverSideTranslations
import { useTranslation } from 'next-i18next'; // 引入 useTranslation 钩子

import VideoCard from '../components/VideoCard';
import NoResults from '../components/NoResults';
import { BASE_URL } from '../utils';
import { Video } from '../types';

interface IProps {
  videos: Video[];
}

const Home = ({ videos }: IProps) => {
  const { t } = useTranslation('common');
  return (
      <div className='flex flex-col gap-10 videos h-full'>
        {videos.length
            ? videos.map((video: Video) => (
                <VideoCard post={video} isShowingOnHome key={video._id} />
            ))
            : <NoResults text='' />}
      </div>
  );
};

// @ts-ignore
export const getServerSideProps = async ({ locale, query: { topic } }) => {
  let response = await axios.get(`${BASE_URL}/api/post`);

  if(topic) {
    response = await axios.get(`${BASE_URL}/api/discover/${topic}`);
  }

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      videos: response.data,
    },
  };
};

export default Home;
