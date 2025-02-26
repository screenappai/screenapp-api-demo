import { validateEnv } from './config';
import { uploadFile } from './uploads';
async function main() {
  try {
    // Validate environment variables
    validateEnv();

    // Verify authentication
    const isAuthenticated = await verifyAuthentication();
    if (!isAuthenticated) {
      throw new Error('Authentication failed');
    }


    // Example: Upload a file (uncomment and specify path to test)
    // const fileUrl = await uploadFile('/path/to/your/file.jpg');
    // console.log('File uploaded:', fileUrl);

  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main(); 