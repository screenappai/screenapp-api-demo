import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { basename } from 'path';
import dotenv from 'dotenv';
import { validateEnv } from './config';

dotenv.config();

const API_BASE_URL = 'http://localhost:8081/v2';
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

interface UploadInitResponse {
  fileId: string;
  uploadId: string;
}

const getAuthConfig = () => ({
  headers: {
    'Authorization': `Bearer ${process.env.AUTHENTICATION_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function initializeUpload(contentType: string): Promise<UploadInitResponse> {
  const response = await axios.put(
    `${API_BASE_URL}/files/upload/multipart/init/${process.env.TEAM_ID}/${process.env.FOLDER_ID}`,
    { contentType },
    getAuthConfig()
  );
  return response.data.data;
}

async function getUploadUrl(fileId: string, uploadId: string, partNumber: number, contentType: string): Promise<string> {
  const response = await axios.put(
    `${API_BASE_URL}/files/upload/multipart/url/${process.env.TEAM_ID}/${process.env.FOLDER_ID}/${fileId}/${uploadId}/${partNumber}`,
    { contentType },
    getAuthConfig()
  );
  return response.data.data.uploadUrl;
}

async function uploadPart(uploadUrl: string, chunk: Buffer): Promise<void> {
  const formData = new FormData();
  formData.append('file', chunk);

  await axios.put(uploadUrl, chunk, {
    headers: {
      ...formData.getHeaders(),
    },
  });
}

async function finalizeUpload(fileId: string, uploadId: string, fileName: string, contentType: string): Promise<any> {
  const response = await axios.put(
    `${API_BASE_URL}/files/upload/multipart/finalize/${process.env.TEAM_ID}/${process.env.FOLDER_ID}/${fileId}/${uploadId}`,
    {
      file: {
        contentType,
        name: fileName,
      },
    },
    getAuthConfig()
  );
  return response.data.data;
}

export const multipartUpload = async (filePath: string, contentType: string = 'video/mp4'): Promise<string> => {
  try {
    // Initialize the multipart upload
    const { fileId, uploadId } = await initializeUpload(contentType);
    
    // Create a read stream with specified chunk size
    const fileStream = createReadStream(filePath, { highWaterMark: CHUNK_SIZE });
    let partNumber = 1;

    // Upload each chunk
    for await (const chunk of fileStream) {
      const uploadUrl = await getUploadUrl(fileId, uploadId, partNumber, contentType);
      await uploadPart(uploadUrl, chunk);
      console.log(`Uploaded part ${partNumber}`);
      partNumber++;
    }

    // Finalize the upload
    const result = await finalizeUpload(fileId, uploadId, basename(filePath), contentType);
    console.log('Upload completed successfully');
    return result.file;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Main function to run the multipart upload demo
async function main() {
  try {
    // Validate environment variables
    validateEnv();

    // Upload the file specified in FILE_PATH
    const fileUrl = await multipartUpload(process.env.FILE_PATH!);
    console.log('File uploaded successfully!');
    console.log('File:', fileUrl);

  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
} 