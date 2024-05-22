import axios from 'axios';

export async function upload2awsS3(url: string, file: File) {
  let option = { headers: { 'Content-Type': file.type, 'Accept': '*/*', 'x-goog-content-length-range': '0,1048576' } };
  return axios.put(url, file, option);
}
