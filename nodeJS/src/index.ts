import { validateEnv } from './config';
import { multipartUpload } from './uploads';

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

main(); 