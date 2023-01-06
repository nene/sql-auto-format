import { format } from "./test_utils";
import dedent from "dedent-js";

describe("update", () => {
  it("formats basic UPDATE", () => {
    expect(
      format(`
        UPDATE customer_orders
        SET order_status = 'shipped',
            shipping_address = '123 Main Street, Anytown, USA',
            shipping_cost = 9.99
        WHERE order_id = 1000
      `)
    ).toBe(dedent`
      UPDATE customer_orders
      SET
        order_status = 'shipped',
        shipping_address = '123 Main Street, Anytown, USA',
        shipping_cost = 9.99
      WHERE
        order_id = 1000
    `);
  });
});
