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

The Node.js example demonstrates two different file upload methods using TypeScript:

- **Simple Upload** (`src/upload.ts`) - For smaller files using a single upload request
- **Multipart Upload** (`src/multipart-upload.ts`) - For larger files using chunked upload

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

For simple upload (recommended for smaller files):
```bash
npm run upload
```

For multipart upload (recommended for larger files):
```bash
npm run multipart-upload
```

#### Simple Upload Flow
The simple upload (`upload.ts`) follows this process:
1. Request an upload URL from the API
2. Upload the file directly to the received URL
3. Finalize the upload with metadata

#### Multipart Upload Flow
The multipart upload (`multipart-upload.ts`) follows this process:
1. Initialize a multipart upload session
2. Upload the file in 5MB chunks
3. Finalize the multipart upload

## Python Example

The Python example provides two upload methods:
1. **Simple Upload** (`upload.py`) - For smaller files using direct upload
2. **Multipart Upload** (`multipart-upload.py`) - For larger files using chunked upload

## Setup

1. Navigate to the Python directory:
   ```bash
   cd python
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Copy the environment file:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your ScreenApp credentials

### Running

**Simple Upload:**
```bash
python src/upload.py
```

**Multipart Upload:**
```bash
python src/multipart-upload.py
```

The simple upload is suitable for smaller files, while multipart upload is recommended for larger files as it uploads in chunks for better reliability.

## Environment Variables

Both examples require the same environment variables:

- `AUTHENTICATION_TOKEN` - Your ScreenApp authentication token
- `TEAM_ID` - Your ScreenApp team ID
- `FOLDER_ID` - The folder ID where you want to upload files
- `FILE_PATH` - Absolute path to the video file you want to upload

## What the Examples Do

**Simple Upload** demonstrates:
1. Requesting an upload URL from the ScreenApp API
2. Uploading the file directly to the presigned URL
3. Finalizing the upload process

**Multipart Upload** demonstrates:
1. Validating environment configuration
2. Initializing a multipart upload session with the ScreenApp API
3. Uploading a video file in 5MB chunks
4. Finalizing the upload process

Both examples will upload the file specified in `FILE_PATH` to your ScreenApp account.

## Project Structure

### Node.js Structure
```
nodeJS/
├── package.json
├── tsconfig.json
├── env.example
└── src/
    ├── upload.ts              # Simple upload implementation
    ├── multipart-upload.ts    # Multipart upload implementation
    └── config.ts             # Configuration and validation utilities
```

### Python Structure
```
python/
├── requirements.txt
├── .env.example
└── src/
    ├── upload.py             # Simple upload implementation
    └── multipart-upload.py   # Multipart upload implementation
```
