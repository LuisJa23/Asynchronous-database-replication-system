// src/config/googleConfig.ts
import { google } from 'googleapis';

export const getSQLAdminClient = async () => {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });

  return google.sqladmin({
    version: 'v1beta4',
    auth: await auth.getClient() as any
  });
};