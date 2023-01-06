import { format } from "./test_utils";
import dedent from "dedent-js";

describe("insert", () => {
  it("formats basic INSERT", () => {
    expect(
      format(`
        INSERT INTO customer_orders (customer_id, order_date, product_id, quantity, price)
        VALUES (1, '2022-01-01', 100, 5, 99.99),
              (2, '2022-01-02', 101, 10, 199.99),
              (3, '2022-01-03', 102, 15, 299.99)
      `)
    ).toBe(dedent`
      INSERT INTO customer_orders
        (customer_id, order_date, product_id, quantity, price)
      VALUES
        (1, '2022-01-01', 100, 5, 99.99),
        (2, '2022-01-02', 101, 10, 199.99),
        (3, '2022-01-03', 102, 15, 299.99)
    `);
  });
});
