import { validateEnv } from './config';
import { uploadFile } from './uploads';

async function main() {
  try {
    // Validate environment variables
    validateEnv();

    // Upload the file specified in FILE_PATH
    const fileUrl = await uploadFile(process.env.FILE_PATH!);
    console.log('File uploaded successfully!');
    console.log('File:', fileUrl);

  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main(); 