export interface IOrderItemResponse {
  productId: string;
  quantity: number;
  price: number;
}

export interface IOrderResponse {
  id: string;
  userId: string;
  items: IOrderItemResponse[];
  totalAmount: number;
  status: string;
  createdAt: Date;
}
