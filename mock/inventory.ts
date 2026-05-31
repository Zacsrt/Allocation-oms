import { faker } from "@faker-js/faker";
faker.seed(1003);

export type Inventory = {
  itemId: string;

  warehouseId: string;
  supplierId: string;

  availableStock: number;

  pricePerUnit: number;
};

type InventoryKey = Pick<
  Inventory,
  "itemId" | "warehouseId" | "supplierId"
>;


const validInventoryKeys: InventoryKey[] = [
  { itemId: "Item-1", warehouseId: "WH-001", supplierId: "SP-001" },
  { itemId: "Item-1", warehouseId: "WH-001", supplierId: "SP-002" },
  { itemId: "Item-1", warehouseId: "WH-002", supplierId: "SP-001" },
  { itemId: "Item-2", warehouseId: "WH-001", supplierId: "SP-001" },
  { itemId: "Item-2", warehouseId: "WH-002", supplierId: "SP-002" },
];

export const inventory: Inventory[] = validInventoryKeys.map((key) => ({
  ...key,
  availableStock: faker.number.int({
    min: 0,
    max: 20000,
  }),
  pricePerUnit: faker.number.int({
    min: 50,
    max: 200,
  }),
}));
