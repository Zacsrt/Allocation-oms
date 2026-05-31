import { faker } from "@faker-js/faker";
faker.seed(1001);

export type OrderType =
  | "EMERGENCY"
  | "OVERDUE"
  | "DAILY";

export type SubOrder = {
  subOrderId: string;
  itemId: string;
  warehouseId: string;
  supplierId: string;

  requestedQty: number;
  allocatedQty: number;

  orderType: OrderType;

  remark?: string;
};

export type Order = {
  orderId: string;
  customerId: string;
  createdAt: string;

  subOrders: SubOrder[];
};

const orderTypes: OrderType[] = [
  "EMERGENCY",
  "OVERDUE",
  "DAILY",
];

const itemIds = ["Item-1", "Item-2"];

const warehouseIds = [
  "WH-001",
  "WH-002",
  "WH-000",
];

const supplierIds = [
  "SP-001",
  "SP-002",
  "SP-000",
];

export const orders: Order[] = Array.from(
  { length: 3500 },
  (_, index) => {
    const orderNo = String(index + 1).padStart(
      4,
      "0"
    );

    const subOrderCount = faker.number.int({
      min: 1,
      max: 2,
    });

    return {
      orderId: `ORDER-${orderNo}`,

      customerId: `CT-${faker.number
        .int({
          min: 1,
          max: 50,
        })
        .toString()
        .padStart(4, "0")}`,

      createdAt: faker.date
        .past({ years: 1 })
        .toISOString(),

      subOrders: Array.from(
        { length: subOrderCount },
        (_, subIndex) => ({
          subOrderId: `ORDER-${orderNo}-${String(
            subIndex + 1
          ).padStart(3, "0")}`,

          itemId:
            faker.helpers.arrayElement(itemIds),

          warehouseId:
            faker.helpers.arrayElement(
              warehouseIds
            ),

          supplierId:
            faker.helpers.arrayElement(
              supplierIds
            ),

          requestedQty: faker.number.int({
            min: 1,
            max: 300,
          }),

          allocatedQty: 0,

          orderType:
            faker.helpers.arrayElement(
              orderTypes
            ),

          remark: faker.datatype.boolean({
            probability: 0.1,
          })
            ? "Special for VIP"
            : "",
        })
      ),
    };
  }
);