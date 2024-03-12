import React, { useEffect, useState } from 'react';
import { SanityAssetDocument } from '@sanity/client';
import { useRouter } from 'next/router';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import OSS from 'ali-oss';


import useAuthStore from '../store/authStore';
import { BASE_URL } from '../utils';
import {useTopics} from '../utils/constants';

import { useTranslation } from 'next-i18next'
import {withStaticTranslations} from "../utils/I18";
export const getStaticProps = withStaticTranslations(['common']);
const Upload = () => {
  const { t } = useTranslation('common');
  const [caption, setCaption] = useState('');
  const [topic, setTopic] = useState<String>(useTopics.id);
  const [loading, setLoading] = useState<Boolean>(false);
  const [savingPost, setSavingPost] = useState<Boolean>(false);
  const [videoAsset, setVideoAsset] = useState<SanityAssetDocument | undefined>();
  const [wrongFileType, setWrongFileType] = useState<Boolean>(false);

  const userProfile: any = useAuthStore((state) => state.userProfile);
  const router = useRouter();

  useEffect(() => {
    if (!userProfile) router.push('/');
  }, [userProfile, router]);

  const client = new OSS({
    region: `${process.env.NEXT_PUBLIC_OSS_REGION}`,
    accessKeyId: `${process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID}`,
    accessKeySecret: `${process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET}`,
    bucket: `${process.env.NEXT_PUBLIC_OSS_BUCKET}`,
  });

  const uploadVideo = async (e: any) => {
    // const selectedFile = e.target.files[0];
    // const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    //
    // // uploading asset to sanity
    // if (fileTypes.includes(selectedFile.type)) {
    //   setWrongFileType(false);
    //   setLoading(true);
    //
    //   client.assets
    //     .upload('file', selectedFile, {
    //       contentType: selectedFile.type,
    //       filename: selectedFile.name,
    //     })
    //     .then((data) => {
    //       console.log(data)
    //       setVideoAsset(data);
    //       setLoading(false);
    //     });
    // } else {
    //   setLoading(false);
    //   setWrongFileType(true);
    // }

    const selectedFile = e.target.files ? e.target.files[0] : null;
    const fileTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      setWrongFileType(false);
      setLoading(true);

      try {
        // 使用OSS的put方法上传文件
        const extension = selectedFile.name.split('.').pop();
        // 获取不含扩展名的文件名
        const fileNameWithoutExtension = selectedFile.name.replace(/\.[^/.]+$/, "");
        // 创建时间戳
        const timestamp = new Date().getTime();
        // 构造新的文件名，格式为“原始文件名-时间戳.扩展名”
        const newFileName = `video/${fileNameWithoutExtension}-${timestamp}.${extension}`;

        // 使用新的文件名和原始文件上传到OSS
        const result = await client.put(newFileName, selectedFile);


        // 构造一个与SanityFileAsset类型匹配的对象
        // @ts-ignore
        const fileAsset: SanityFileAsset = {
          _createdAt: new Date().toISOString(),
          _id: `file-${result.name}`,
          _rev: '', // _rev 通常是由数据库管理的，这里你可能需要一个占位符或从服务器获取
          _type: "sanity.fileAsset",
          _updatedAt: new Date().toISOString(),
          assetId: result.name.split('.')[0], // 假设你想要文件名作为assetId
          extension: selectedFile.name.split('.').pop() || '',
          mimeType: selectedFile.type,
          originalFilename: selectedFile.name,
          path: result.name,
          sha1hash: '', // SHA1 hash通常是文件内容的摘要，需要特别处理
          size: selectedFile.size,
          uploadId: result.etag, // 假设使用etag作为uploadId
          url: result.url
        };

        setVideoAsset(fileAsset);
        setLoading(false);
      } catch (error) {
        console.error('Upload to OSS failed', error);
        setLoading(false);
      }
    } else {
      setWrongFileType(true);
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (caption && videoAsset?.url && topic) { // 确保这里使用 videoAsset?.url
      setSavingPost(true);

      const doc = {
        _type: 'post',
        caption,
        video: videoAsset.url, // 使用 videoAsset.url 而不是 videoAsset?._id
        userId: userProfile?._id,
        postedBy: {
          _type: 'postedBy',
          _ref: userProfile?._id,
        },
        topic,
      };

      // 发送 POST 请求保存帖子信息
      await axios.post(`${BASE_URL}/api/post`, doc);

      router.push('/');
    }
  };



  const handleDiscard = () => {
    setSavingPost(false);
    setVideoAsset(undefined);
    setCaption('');
    setTopic('');
  };

  return (
    <div className='flex w-full h-full absolute left-0 top-[60px] lg:top-[70px] mb-10 pt-10 lg:pt-20 bg-[#F8F8F8] justify-center'>
      <div className=' bg-white rounded-lg xl:h-[80vh] flex gap-6 flex-wrap justify-center items-center p-14 pt-6'>
        <div>
          <div>
            <p className='text-2xl font-bold'>{t('common:UploadVideo')}</p>
            <p className='text-md text-gray-400 mt-1'>{t('common:PostVideo')}</p>
          </div>
          <div className=' border-dashed rounded-xl border-4 border-gray-200 flex flex-col justify-center items-center  outline-none mt-10 w-[260px] h-[458px] p-10 cursor-pointer hover:border-red-300 hover:bg-gray-100'>
            {loading ? (
              <p className='text-center text-3xl text-red-400 font-semibold'>
                {t('common:Posting')}
              </p>
            ) : (
              <div>
                {!videoAsset ? (
                  <label className='cursor-pointer'>
                    <div className='flex flex-col items-center justify-center h-full'>
                      <div className='flex flex-col justify-center items-center'>
                        <p className='font-bold text-xl'>
                          <FaCloudUploadAlt className='text-gray-300 text-6xl' />
                        </p>
                        <p className='text-xl font-semibold'>
                          {t('common:SelectVideoUpload')}
                        </p>
                      </div>

                      <p className='text-gray-400 text-center mt-10 text-sm leading-10'>
                        {t('common:upload-message-1')}<br />
                        {t('common:upload-message-2')}<br />
                        {t('common:upload-message-3')}<br />
                        {t('common:upload-message-4')}
                      </p>
                      <p className='bg-[#F51997] text-center mt-8 rounded text-white text-md font-medium p-2 w-52 outline-none'>
                        {t('common:SelectFile')}
                      </p>
                    </div>
                    <input
                      type='file'
                      name='upload-video'
                      onChange={(e) => uploadVideo(e)}
                      className='w-0 h-0'
                    />
                  </label>
                ) : (
                  <div className=' rounded-3xl w-[300px]  p-4 flex flex-col gap-6 justify-center items-center'>
                    <video
                      className='rounded-xl h-[462px] mt-16 bg-black'
                      controls
                      loop
                      src={videoAsset?.url}
                    />
                    <div className=' flex justify-between gap-20'>
                      <p className='text-lg'>{videoAsset.originalFilename}</p>
                      <button
                        type='button'
                        className=' rounded-full bg-gray-200 text-red-400 p-2 text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out'
                        onClick={() => setVideoAsset(undefined)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          {wrongFileType && (
            <p className='text-center text-xl text-red-400 font-semibold mt-4 w-[260px]'>
              {t('common:upload-message-red')}
            </p>
          )}
        </div>
        <div className='flex flex-col gap-3 pb-10'>
          <label className='text-md font-medium '>{t('common:Caption')}</label>
          <input
            type='text'
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className='rounded lg:after:w-650 outline-none text-md border-2 border-gray-200 p-2'
          />
          <label className='text-md font-medium '>{t('common:SelectTopic')}</label>

          <select
            onChange={(e) => {
              setTopic(e.target.value);
            }}
            className='outline-none lg:w-650 border-2 border-gray-200 text-md capitalize lg:p-4 p-2 rounded cursor-pointer'
          >
            {useTopics().map((item) => (
              <option
                key={item.id}
                className=' outline-none capitalize bg-white text-gray-700 text-md p-2 hover:bg-slate-300'
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
          <div className='flex gap-6 mt-10'>
            <button
              onClick={handleDiscard}
              type='button'
              className='border-gray-300 border-2 text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
            >
              {t('common:Discard')}
            </button>
            <button
              disabled={videoAsset?.url ? false : true}
              onClick={handlePost}
              type='button'
              className='bg-[#F51997] text-white text-md font-medium p-2 rounded w-28 lg:w-44 outline-none'
            >
              {savingPost ? t('common:Posting'): t('common:Post')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
