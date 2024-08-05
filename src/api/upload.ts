import axios from 'axios';

export async function upload2awsS3(url: string, file: File, fileSize: number) {
  const size = fileSize * 1024 * 1024;
  let option = { headers: { 'Content-Type': file.type, 'Accept': '*/*', 'x-goog-content-length-range': `0,${size}` } };
  return axios.put(url, file, option);
}
