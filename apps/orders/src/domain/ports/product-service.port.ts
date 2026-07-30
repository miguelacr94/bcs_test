export interface ProductServicePort {
  // Reducir el inventario (stock) de una lista de productos
  reduceStock(items: { productId: string; quantity: number }[]): Promise<boolean>;
}
