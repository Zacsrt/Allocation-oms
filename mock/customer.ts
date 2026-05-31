import { faker } from "@faker-js/faker";
faker.seed(1002);

export type Customer = {
  customerId: string;
  customerName: string;
  creditLimit: number;
  usedCredit: number;
  availableCredit: number;
};

export const customers: Customer[] = Array.from(
  { length: 200 },
  (_, index) => {
    const customerNo = String(index + 1).padStart(4, "0");

    const creditLimit = faker.number.int({
      min: 5000,
      max: 50000,
    });

    const usedCredit = faker.number.int({
      min: 0,
      max: creditLimit,
    });

    return {
      customerId: `CT-${customerNo}`,
      customerName: faker.company.name(),
      creditLimit,
      usedCredit,
      availableCredit: creditLimit - usedCredit,
    };
  }
);