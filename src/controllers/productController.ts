import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/productService';
import { Product } from '../models/product';

export class ProductController {
  /**
   * Crea un nuevo producto
   */
  static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, price } = req.body;
      
      // Validaciones básicas
      if (!name || name.trim() === '') {
        res.status(400).json({ error: 'El nombre del producto es requerido' });
        return;
      }
      
      if (!price || isNaN(Number(price)) || Number(price) <= 0) {
        res.status(400).json({ error: 'El precio debe ser un número positivo' });
        return;
      }
      
      const product: Product = {
        name,
        price: Number(price)
      };
      
      const productId = await ProductService.createProduct(product);
      
      res.status(201).json({
        message: 'Producto creado exitosamente',
        productId,
        product
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtiene todos los productos
   */
  // static async getAllProducts(req: Request, res: Response, next: NextFunction): Promise<void> {
  //   try {
  //     const products = await ProductService.getAllProducts();
  //     res.status(200).json(products);
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  /**
   * Obtiene un producto por su ID
   */
  static async getProductById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Producto no encontrado' });
        return;
      }
      
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
}