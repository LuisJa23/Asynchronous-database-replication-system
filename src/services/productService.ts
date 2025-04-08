import pool, { getPool } from '../config/database';
import { Product } from '../models/product';
import { ResultSetHeader } from 'mysql2';

export class ProductService {
  /**
   * Crea un nuevo producto en la base de datos
   * @param product Producto a crear
   * @returns El ID del producto creado
   */
  /**
   * Crea un nuevo producto en la base de datos
   * @param product Producto a crear
   * @returns El ID del producto creado
   */
  static async createProduct(product: Product): Promise<number> {
    try {
      console.log('Intentando insertar producto:', product);
      const pool = await getPool();
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO products (name, price) VALUES (?, ?)',
        [product.name, product.price]
      );
      
      console.log('Producto insertado correctamente, ID:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error al insertar producto:', error);
      throw new Error('No se pudo insertar el producto en la base de datos');
    }
  }

  /**
   * Obtiene un producto por su ID
   * @param id ID del producto
   * @returns Producto encontrado o null
   */
  static async getProductById(id: number): Promise<Product | null> {
    try {
      const [rows] = await pool.execute(
        { sql: 'SELECT * FROM products WHERE id = ?' },
        [id]
      );
      
      const products = rows as Product[];
      return products.length > 0 ? products[0] : null;
    } catch (error) {
      console.error(`Error al obtener el producto con ID ${id}:`, error);
      throw new Error(`No se pudo obtener el producto con ID ${id}`);
    }
  }
}