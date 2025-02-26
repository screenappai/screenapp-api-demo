import dotenv from 'dotenv';
import { AxiosRequestConfig } from 'axios';

dotenv.config();

export const API_BASE_URL = 'https://api.screenapp.io';

export const getAuthConfig = (): AxiosRequestConfig => ({
  headers: {
    'Authorization': `Bearer ${process.env.AUTHENTICATION_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

export const validateEnv = () => {
  const requiredEnvVars = [
    'AUTHENTICATION_TOKEN',
    'TEAM_ID',
    'FOLDER_ID'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}; 