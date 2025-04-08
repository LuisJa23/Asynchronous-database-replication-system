// src/services/sqlInstanceService.ts
import { getSQLAdminClient } from '../config/googleConfig';

export const getInstancePublicIp = async (
  projectId: string,
  instanceName: string
): Promise<string | null> => {
  try {
    const sqladmin = await getSQLAdminClient();
    const res = await sqladmin.instances.get({
      project: projectId,
      instance: instanceName,
    });

    const ipAddresses = res.data.ipAddresses || [];
    const publicIp = ipAddresses.find(ip => ip.type === 'PRIMARY');

    if (!publicIp) {
      throw new Error(`No public IP found for instance: ${instanceName}`);
    }

    return publicIp.ipAddress || null;
  } catch (error) {
    console.error('Error getting public IP:', error);
    throw error;
  }
};
