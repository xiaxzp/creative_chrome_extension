export const localeDateStringOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
};

export async function convertImageToBase64(url: string) {
  try {
    // 使用 fetch API 请求图片
    const response = await fetch(url);

    // 确保请求成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取图片的 blob 数据
    const blob = await response.blob();

    // 返回一个新的 Promise
    return new Promise<FileReader['result']>((resolve, reject) => {
      // 创建 FileReader 实例
      const reader = new FileReader();

      // 当读取操作完成时触发 resolve 函数
      reader.onloadend = () => resolve(reader.result); // reader.result 包含转换的 Base64 格式数据

      // 如果读取失败，则 reject Promise
      reader.onerror = (error) => reject(error);

      // 启动转换操作
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Convert image to Base64 error:', error);
    throw error; // 重新抛出错误，允许调用者捕获
  }
}
