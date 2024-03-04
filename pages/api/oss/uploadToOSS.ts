import OSS from 'ali-oss';

// OSS 客户端初始化
const client = new OSS({
    region: `${process.env.NEXT_PUBLIC_OSS_REGION}`,
    accessKeyId: `${process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_ID}`,
    accessKeySecret: `${process.env.NEXT_PUBLIC_OSS_ACCESS_KEY_SECRET}`,
    bucket: `${process.env.NEXT_PUBLIC_OSS_BUCKET}`,
});

export  async function otherUploadToOSS(imageUrl: string): Promise<string> {
    try {
        // 获取图片名称
        const imageName = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
        // 获取图片扩展名
        const extension = imageName.substring(imageName.lastIndexOf('.'));
        // 构造新的文件名
        const timestamp = new Date().getTime();
        const newFileName = `header/headerG-${timestamp}.jpg`;
        // 下载图片
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], imageName, { type: blob.type });

        // 使用 OSS 客户端上传文件
        const result = await client.put(newFileName, file);

        // 返回上传后的图片 URL
        return result.url;
    } catch (error) {
        console.error('Failed to upload image to OSS:', error);
        throw new Error('Failed to upload image to OSS');
    }



}


export async function uploadToOSS(file: File): Promise<string> {
    try {
        const extension = file.name.split('.').pop();
        const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
        const timestamp = new Date().getTime();
        const newFileName = `header/header-${timestamp}.${extension}`;

        // 直接使用传入的 File 对象上传到 OSS
        const result = await client.put(newFileName, file);

        // 返回上传后的图片 URL
        return result.url;
    } catch (error) {
        console.error('Failed to upload image to OSS:', error);
        throw new Error('Failed to upload image to OSS');
    }
}


