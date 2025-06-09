"""
Multipart Upload for ScreenApp API

Suitable for large files, stateless apps, real-time uploads, and recording scenarios.
Uploads files in 5MB chunks for better fault tolerance and memory efficiency.
"""

import os
import sys
import requests
from typing import Dict, Any
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
API_BASE_URL = "http://localhost:8081/v2"
CHUNK_SIZE = 5 * 1024 * 1024  # 5MB chunks

def get_auth_headers():
    """Get authentication headers for API requests"""
    return {
        'Authorization': f"Bearer {os.getenv('AUTHENTICATION_TOKEN')}",
        'Content-Type': 'application/json'
    }

def validate_env():
    """Validate that all required environment variables are set"""
    required_env_vars = [
        'AUTHENTICATION_TOKEN',
        'TEAM_ID',
        'FOLDER_ID',
        'FILE_PATH'
    ]
    
    missing_vars = []
    for env_var in required_env_vars:
        if not os.getenv(env_var):
            missing_vars.append(env_var)
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}")

class UploadInitResponse:
    def __init__(self, file_id: str, upload_id: str):
        self.file_id = file_id
        self.upload_id = upload_id

def initialize_upload(content_type: str) -> UploadInitResponse:
    """Initialize a multipart upload"""
    team_id = os.getenv('TEAM_ID')
    folder_id = os.getenv('FOLDER_ID')
    
    url = f"{API_BASE_URL}/files/upload/multipart/init/{team_id}/{folder_id}"
    payload = {"contentType": content_type}
    
    response = requests.put(url, json=payload, headers=get_auth_headers())
    response.raise_for_status()
    
    data = response.json()['data']
    return UploadInitResponse(data['fileId'], data['uploadId'])

def get_upload_url(file_id: str, upload_id: str, part_number: int, content_type: str) -> str:
    """Get a presigned URL for uploading a specific part"""
    team_id = os.getenv('TEAM_ID')
    folder_id = os.getenv('FOLDER_ID')
    
    url = f"{API_BASE_URL}/files/upload/multipart/url/{team_id}/{folder_id}/{file_id}/{upload_id}/{part_number}"
    payload = {"contentType": content_type}
    
    response = requests.put(url, json=payload, headers=get_auth_headers())
    response.raise_for_status()
    
    return response.json()['data']['uploadUrl']

def upload_part(upload_url: str, chunk: bytes) -> None:
    """Upload a single part/chunk to the presigned URL"""
    response = requests.put(upload_url, data=chunk)
    response.raise_for_status()

def finalize_upload(file_id: str, upload_id: str, file_name: str, content_type: str) -> Dict[str, Any]:
    """Finalize the multipart upload"""
    team_id = os.getenv('TEAM_ID')
    folder_id = os.getenv('FOLDER_ID')
    
    url = f"{API_BASE_URL}/files/upload/multipart/finalize/{team_id}/{folder_id}/{file_id}/{upload_id}"
    payload = {
        "file": {
            "contentType": content_type,
            "name": file_name
        }
    }
    
    response = requests.put(url, json=payload, headers=get_auth_headers())
    response.raise_for_status()
    
    return response.json()['data']

def multipart_upload(file_path: str, content_type: str = "video/mp4") -> str:
    """Upload a file using multipart upload"""
    try:
        # Initialize the multipart upload
        upload_init = initialize_upload(content_type)
        file_id = upload_init.file_id
        upload_id = upload_init.upload_id
        
        # Get file name
        file_name = Path(file_path).name
        
        # Upload file in chunks
        part_number = 1
        with open(file_path, 'rb') as file:
            while True:
                chunk = file.read(CHUNK_SIZE)
                if not chunk:
                    break
                
                # Get upload URL for this part
                upload_url = get_upload_url(file_id, upload_id, part_number, content_type)
                
                # Upload the chunk
                upload_part(upload_url, chunk)
                print(f"Uploaded part {part_number}")
                
                part_number += 1
        
        # Finalize the upload
        result = finalize_upload(file_id, upload_id, file_name, content_type)
        print("Upload completed successfully")
        return result['file']
        
    except Exception as error:
        print(f"File upload failed: {error}")
        raise error

# Main function to run the multipart upload demo
def main():
    """Main function to run the ScreenApp API demo"""
    try:
        # Validate environment variables
        validate_env()
        
        # Get file path from environment
        file_path = os.getenv('FILE_PATH')
        
        # Upload the file
        file_url = multipart_upload(file_path)
        print('File uploaded successfully!')
        print(f'File: {file_url}')
        
    except Exception as error:
        print(f'Error in main: {error}')
        sys.exit(1)

# Run main function if this file is executed directly
if __name__ == "__main__":
    main() 