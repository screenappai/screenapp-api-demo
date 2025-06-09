import os
import sys
import requests
from typing import Dict, Any, List, Optional
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configuration
API_BASE_URL = "http://localhost:8081/v2"

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

class UploadUrlRequest:
    def __init__(self, files: List[Dict[str, str]]):
        self.files = files
    
    def to_dict(self):
        return {"files": self.files}

class UploadParam:
    def __init__(self, file_id: str, upload_url: str):
        self.file_id = file_id
        self.upload_url = upload_url

def request_upload_url(content_type: str, file_name: str) -> UploadParam:
    """Request an upload URL from the API"""
    team_id = os.getenv('TEAM_ID')
    folder_id = os.getenv('FOLDER_ID')
    
    url = f"{API_BASE_URL}/files/upload/urls/{team_id}/{folder_id}"
    payload = UploadUrlRequest([{
        "contentType": content_type,
        "name": file_name
    }]).to_dict()
    
    response = requests.post(url, json=payload, headers=get_auth_headers())
    response.raise_for_status()
    
    data = response.json()
    if not data.get('success') or not data.get('data', {}).get('uploadParams'):
        raise Exception('Failed to get upload URL')
    
    upload_param = data['data']['uploadParams'][0]
    return UploadParam(upload_param['fileId'], upload_param['uploadUrl'])

def upload_file_to_url(upload_url: str, file_path: str, content_type: str) -> None:
    """Upload file to the presigned URL"""
    file_size = os.path.getsize(file_path)
    
    with open(file_path, 'rb') as file:
        headers = {
            'Content-Type': content_type,
            'Content-Length': str(file_size)
        }
        
        response = requests.put(upload_url, data=file, headers=headers)
        response.raise_for_status()

def finalize_upload(
    file_id: str,
    content_type: str,
    file_name: str,
    description: Optional[str] = None,
    recorder_name: Optional[str] = None,
    recorder_email: Optional[str] = None,
    needs_conversion: bool = True
) -> Dict[str, Any]:
    """Finalize the upload"""
    team_id = os.getenv('TEAM_ID')
    folder_id = os.getenv('FOLDER_ID')
    
    url = f"{API_BASE_URL}/files/upload/finalize/{team_id}/{folder_id}"
    payload = {
        "file": {
            "fileId": file_id,
            "contentType": content_type,
            "name": file_name,
            "description": description,
            "recorderName": recorder_name,
            "recorderEmail": recorder_email,
            "needsConversion": needs_conversion
        }
    }
    
    response = requests.post(url, json=payload, headers=get_auth_headers())
    response.raise_for_status()
    
    return response.json()

def simple_upload(
    file_path: str,
    content_type: str = "video/mp4",
    description: Optional[str] = None,
    recorder_name: Optional[str] = None,
    recorder_email: Optional[str] = None,
    needs_conversion: bool = True
) -> Dict[str, Any]:
    """Upload a file using simple upload"""
    try:
        file_name = Path(file_path).name
        
        # Step 1: Request upload URL
        print('Requesting upload URL...')
        upload_param = request_upload_url(content_type, file_name)
        print(f'Received upload URL for file ID: {upload_param.file_id}')
        
        # Step 2: Upload file to the received URL
        print('Uploading file...')
        upload_file_to_url(upload_param.upload_url, file_path, content_type)
        print('File uploaded successfully')
        
        # Step 3: Finalize the upload
        print('Finalizing upload...')
        result = finalize_upload(
            upload_param.file_id,
            content_type,
            file_name,
            description,
            recorder_name,
            recorder_email,
            needs_conversion
        )
        print('Upload finalized successfully')
        
        return result
        
    except Exception as error:
        print(f"Simple upload failed: {error}")
        raise error

# Main function to run the simple upload demo
def main():
    """Main function to run the ScreenApp API simple upload demo"""
    try:
        # Validate environment variables
        validate_env()
        
        # Upload the file specified in FILE_PATH
        file_path = os.getenv('FILE_PATH')
        result = simple_upload(
            file_path,
            'video/mp4',
            description='Uploaded via ScreenApp API simple upload example',
            needs_conversion=True
        )
        
        print('File uploaded successfully!')
        print(f'Result: {result}')
        
    except Exception as error:
        print(f'Error in main: {error}')
        sys.exit(1)

# Run main function if this file is executed directly
if __name__ == "__main__":
    main() 