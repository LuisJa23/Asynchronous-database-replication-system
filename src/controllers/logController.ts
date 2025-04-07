// src/controllers/logController.ts
import { Request, Response } from 'express';
import { enableBinaryLogging } from '../services/logService';

export const enableBinlog = async (req: Request, res: Response) => {
  try {
    const { projectId, instanceId } = req.body;

    // Validación robusta de parámetros
    if (!projectId || !instanceId) {
      return res.status(400).json({
        error: 'Parámetros requeridos faltantes',
        details: {
          requeridos: ['projectId', 'instanceId'],
          recibidos: Object.keys(req.body)
        },
        ejemplo: {
          projectId: "tokyo-house-454522-g7",
          instanceId: "database-main-laboratory"
        }
      });
    }

    // Ejecutar la operación
    const result = await enableBinaryLogging({ 
      projectId, 
      instanceId 
    });

    // Respuesta exitosa
    res.status(200).json({
      operationType: "HABILITAR_BINLOG",
      operationId: result.name,
      details: {
        estado: "EN_PROGRESO",
        aviso: "La instancia se reiniciará automáticamente",
        tiempoEstimado: "5-15 minutos",
        accionesRecomendadas: [
          "No realizar cambios durante la actualización",
          "Verificar estado con GET /operations/{operationId}"
        ]
      }
    });

  } catch (error) {
    // Manejo detallado de errores
    const errorMessage = (error as Error).message;
    const solutions = {
      'settings version': [
        "La instancia debe estar en estado RUNNABLE",
        "Ejecutar GET /instances/{instanceId} para verificar estado"
      ],
      'Permission denied': [
        "Verificar permisos de la cuenta de servicio",
        "Asignar rol 'Cloud SQL Admin'"
      ],
      default: [
        "Consultar logs de operación en Google Cloud Console",
        "Reintentar después de 5 minutos"
      ]
    };

    res.status(500).json({
      error: "Error crítico en configuración",
      technicalDetails: errorMessage,
      diagnosticSteps: [
        "1. Verificar estado de la instancia",
        "2. Confirmar versión de MySQL compatible",
        "3. Validar configuración de red"
      ],
      solutions: solutions[errorMessage.includes('version') ? 'settings version' : 
        errorMessage.includes('Permission') ? 'Permission denied' : 'default']
    });
  }
};