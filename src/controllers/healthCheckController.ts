import { Request, Response } from 'express';
import { checkDatabaseInstanceByName } from '../services/healthCheckService';

export const checkInstance = async (req: Request, res: Response) => {
    const { name } = req.params;
  
    try {
      await checkDatabaseInstanceByName(name);
      res.status(200).json({ message: `Instancia ${name} verificada correctamente.` });
    } catch (error) {
      res.status(500).json({ error: `Error al verificar la instancia ${name}` });
    }
  };