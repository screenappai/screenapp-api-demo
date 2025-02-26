import axios from 'axios';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const API_BASE_URL = 'https://api.screenapp.io';

const getAuthConfig = () => ({
  headers: {
    'Authorization': `Bearer ${process.env.AUTHENTICATION_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const uploadFile = async (filePath: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', createReadStream(filePath));
    formData.append('teamId', process.env.TEAM_ID!);
    formData.append('folderId', process.env.FOLDER_ID!);

    const response = await axios.post(
      `${API_BASE_URL}/uploads`,
      formData,
      {
        ...getAuthConfig(),
        headers: {
          ...getAuthConfig().headers,
          ...formData.getHeaders()
        }
      }
    );

    return response.data.fileUrl;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

// Example usage
async function main() {
  try {
    // Example: Upload a file (uncomment and specify path to test)
    // const fileUrl = await uploadFile('/path/to/your/file.jpg');
    // console.log('File uploaded:', fileUrl);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 