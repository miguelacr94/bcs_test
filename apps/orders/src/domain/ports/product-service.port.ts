export interface ProductServicePort {
  // Reducir el inventario (stock) de una lista de productos
  reduceStock(items: { productId: string; quantity: number }[]): Promise<boolean>;

  // Función Compensatoria (Saga): Restaurar el inventario si la orden falla
  restoreStock(items: { productId: string; quantity: number }[]): Promise<boolean>;
}
