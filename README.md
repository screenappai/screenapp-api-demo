# ScreenApp API Example

This is a demo project showcasing how to use the ScreenApp API.

## Prerequisites

- Node.js (v20 or higher)
- A ScreenApp account with authentication token
- Your ScreenApp Team ID and Folder ID

## Setup

1. Clone this repository
2. Navigate to the Node.js example:
   ```bash
   cd nodeJS
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment variables file:
   ```bash
   cp env.example .env
   ```
5. Update the `.env` file with your:
   - `AUTHENTICATION_TOKEN` from ScreenApp
   - `TEAM_ID` from your ScreenApp account
   - `FOLDER_ID` where you want to upload files
   - `FILE_PATH` pointing to your video file

## Running the Example

To run the Node.js example:

1. Navigate to the nodeJS folder (if not already there):
   ```bash
   cd nodeJS
   ```
2. Run the example:
   ```bash
   npm start
   ```

This will execute the demo script which shows how to interact with the ScreenApp API.
