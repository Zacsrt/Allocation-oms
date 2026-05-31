export type OrderTableRow = {
  orderId: string;
  customerId: string;
  createdAt: string;
  subOrderId: string;
  itemId: string;
  warehouseId: string;
  supplierId: string;
  requestedQty: number;
  allocatedQty: number;
  orderType: string;
  remark?: string;
};
