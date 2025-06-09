# ScreenApp API Examples

This repository contains demo projects showcasing how to use the ScreenApp API for multipart file uploads in different programming languages.

## Available Examples

- **Node.js/TypeScript** - Located in the `nodeJS/` folder
- **Python** - Located in the `python/` folder

## Prerequisites

- For Node.js: Node.js (v20 or higher)
- For Python: Python (v3.8 or higher)
- A ScreenApp account with authentication token
- Your ScreenApp Team ID and Folder ID

## Node.js Example

The Node.js example demonstrates multipart file upload using TypeScript and is contained in a single file: `src/multipart-upload.ts`.

### Setup

1. Navigate to the Node.js example:
   ```bash
   cd nodeJS
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables file:
   ```bash
   cp env.example .env
   ```
4. Update the `.env` file with your ScreenApp credentials

### Running

```bash
npm run multipart-upload
```

This command runs the `multipart-upload.ts` file which contains all the upload logic and main execution code.

## Python Example

The Python example provides the same multipart upload functionality using Python.

### Setup

1. Navigate to the Python example:
   ```bash
   cd python
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy the environment variables file:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your ScreenApp credentials

### Running

```bash
python src/main.py
```

## Environment Variables

Both examples require the same environment variables:

- `AUTHENTICATION_TOKEN` - Your ScreenApp authentication token
- `TEAM_ID` - Your ScreenApp team ID
- `FOLDER_ID` - The folder ID where you want to upload files
- `FILE_PATH` - Absolute path to the video file you want to upload

## What the Examples Do

Both examples demonstrate multipart file upload by:
1. Validating environment configuration
2. Initializing a multipart upload session with the ScreenApp API
3. Uploading a video file in 5MB chunks
4. Finalizing the upload process

The examples will upload the file specified in `FILE_PATH` to your ScreenApp account using efficient multipart upload for large files.

## Project Structure

### Node.js Structure
```
nodeJS/
├── package.json
├── tsconfig.json
├── env.example
└── src/
    ├── multipart-upload.ts    # Main file with upload logic and execution
    └── config.ts             # Configuration and validation utilities
```

### Python Structure
```
python/
├── requirements.txt
├── .env.example
└── src/
    ├── main.py              # Main execution file
    ├── uploads.py           # Upload functionality
    ├── config.py            # Configuration utilities
    └── __init__.py          # Package initialization
```
