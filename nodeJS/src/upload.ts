import axios from 'axios';
import { createReadStream, statSync } from 'fs';
import { basename } from 'path';
import dotenv from 'dotenv';
import { validateEnv } from './config';

dotenv.config();

const API_BASE_URL = 'http://localhost:8081/v2';

const getAuthConfig = () => ({
  headers: {
    'Authorization': `Bearer ${process.env.AUTHENTICATION_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

interface UploadUrlRequest {
  files: Array<{
    contentType: string;
    name: string;
  }>;
}

interface UploadUrlResponse {
  success: boolean;
  data: {
    uploadParams: Array<{
      fileId: string;
      uploadUrl: string;
    }>;
  };
}

interface FinalizeRequest {
  file: {
    fileId: string;
    contentType: string;
    name: string;
    description?: string;
    recorderName?: string;
    recorderEmail?: string;
    needsConversion?: boolean;
  };
}

async function requestUploadUrl(contentType: string, fileName: string): Promise<{ fileId: string; uploadUrl: string }> {
  const teamId = process.env.TEAM_ID;
  const folderId = process.env.FOLDER_ID;
  
  const url = `${API_BASE_URL}/files/upload/urls/${teamId}/${folderId}`;
  const payload: UploadUrlRequest = {
    files: [
      {
        contentType,
        name: fileName
      }
    ]
  };
  
  const response = await axios.post<UploadUrlResponse>(url, payload, getAuthConfig());
  
  if (!response.data.success || !response.data.data.uploadParams.length) {
    throw new Error('Failed to get upload URL');
  }
  
  const uploadParam = response.data.data.uploadParams[0];
  return {
    fileId: uploadParam.fileId,
    uploadUrl: uploadParam.uploadUrl
  };
}

async function uploadFileToUrl(uploadUrl: string, filePath: string, contentType: string): Promise<void> {
  const fileStream = createReadStream(filePath);
  const fileStats = statSync(filePath);
  const fileSize = fileStats.size;
  
  await axios.put(uploadUrl, fileStream, {
    headers: {
      'Content-Type': contentType,
      'Content-Length': fileSize.toString()
    }
  });
}

async function finalizeUpload(
  fileId: string,
  contentType: string,
  fileName: string,
  options: {
    description?: string;
    recorderName?: string;
    recorderEmail?: string;
    needsConversion?: boolean;
  } = {}
): Promise<any> {
  const teamId = process.env.TEAM_ID;
  const folderId = process.env.FOLDER_ID;
  
  const url = `${API_BASE_URL}/files/upload/finalize/${teamId}/${folderId}`;
  const payload: FinalizeRequest = {
    file: {
      fileId,
      contentType,
      name: fileName,
      description: options.description,
      recorderName: options.recorderName,
      recorderEmail: options.recorderEmail,
      needsConversion: options.needsConversion ?? true
    }
  };
  
  const response = await axios.post(url, payload, getAuthConfig());
  return response.data;
}

export const simpleUpload = async (
  filePath: string,
  contentType: string = 'video/mp4',
  options: {
    description?: string;
    recorderName?: string;
    recorderEmail?: string;
    needsConversion?: boolean;
  } = {}
): Promise<any> => {
  try {
    const fileName = basename(filePath);
    
    // Step 1: Request upload URL
    console.log('Requesting upload URL...');
    const { fileId, uploadUrl } = await requestUploadUrl(contentType, fileName);
    console.log(`Received upload URL for file ID: ${fileId}`);
    
    // Step 2: Upload file to the received URL
    console.log('Uploading file...');
    await uploadFileToUrl(uploadUrl, filePath, contentType);
    console.log('File uploaded successfully');
    
    // Step 3: Finalize the upload
    console.log('Finalizing upload...');
    const result = await finalizeUpload(fileId, contentType, fileName, options);
    console.log('Upload finalized successfully');
    
    return result;
  } catch (error) {
    console.error('Simple upload failed:', error);
    throw error;
  }
};

// Main function to run the simple upload demo
async function main() {
  try {
    // Validate environment variables
    validateEnv();
    
    // Upload the file specified in FILE_PATH
    const filePath = process.env.FILE_PATH!;
    const result = await simpleUpload(filePath, 'video/mp4', {
      description: 'Uploaded via ScreenApp API simple upload example',
      needsConversion: true
    });
    
    console.log('File uploaded successfully!');
    console.log('Result:', result);
    
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main();
} 