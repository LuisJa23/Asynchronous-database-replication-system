import { getSQLAdminClient } from '../config/googleConfig';
import { DatabaseConnection } from '../config/data-source';
import { Instance } from '../models/instance';

/**
 * Verifica el estado de una sola instancia por nombre.
 * @param instanceName - Nombre de la instancia a verificar
 */
export const checkDatabaseInstanceByName = async (instanceName: string) => {
  try {
    const sqladmin = await getSQLAdminClient();
    const repository = DatabaseConnection.getInstance().getRepository(Instance);

    const instance = await repository.findOneBy({ name: instanceName });

    if (!instance) {
      throw new Error(`No se encontró la instancia con nombre: ${instanceName}`);
    }

    try {
      const res = await sqladmin.instances.get({
        project: process.env.PROJECT_ID || '',
        instance: instance.name,
      });

      const instanceStatus = res.data.state;
      instance.isOk = instanceStatus === 'RUNNABLE';

      await repository.save(instance);
      console.log(`Instancia ${instance.name} actualizada a estado: ${instance.isOk ? 'OK' : 'NO OK'}`);
    } catch (error) {
      console.error(`Error al consultar la instancia ${instance.name}:`, error);
      instance.isOk = false;
      await repository.save(instance);
    }
  } catch (error) {
    console.error('Error al verificar la instancia:', error);
    throw error;
  }
};
