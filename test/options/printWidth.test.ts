import { format } from "../test_utils";
import dedent from "dedent-js";

describe("printWidth", () => {
  it("breaks up lines longer than 80 chars", () => {
    expect(
      format(`
        INSERT INTO customer_orders
        (customer_id, order_date, product_id, quantity, price, discount, total_cost, shipping_cost, order_status, comment)
        VALUES (1, '2022-01-01 11:10:08', 100, 5, 99.99, 10, 89.99, 9.99, 'pending', 'Please include a gift card!')
      `)
    ).toBe(dedent`
      INSERT INTO customer_orders
        (
          customer_id,
          order_date,
          product_id,
          quantity,
          price,
          discount,
          total_cost,
          shipping_cost,
          order_status,
          comment
        )
      VALUES
        (
          1,
          '2022-01-01 11:10:08',
          100,
          5,
          99.99,
          10,
          89.99,
          9.99,
          'pending',
          'Please include a gift card!'
        )
    `);
  });

  it("does not break lines reaching exactly 80 chars", () => {
    expect(
      format(`
        INSERT INTO customer_orders
        VALUES (1, '2022-01-01 11:10:08', 100, 5, 99.99, 10, 89.99, 9.99, 'pending', 'Heip!')
      `)
    ).toBe(dedent`
      INSERT INTO customer_orders
      VALUES
        (1, '2022-01-01 11:10:08', 100, 5, 99.99, 10, 89.99, 9.99, 'pending', 'Heip!')
    `);
  });

  it("breaks lines reaching exactly 81 chars", () => {
    expect(
      format(`
        INSERT INTO customer_orders
        VALUES (1, '2022-01-01 11:10:08', 100, 5, 99.99, 10, 89.99, 9.99, 'pending', 'Hello!')
      `)
    ).toBe(dedent`
      INSERT INTO customer_orders
      VALUES
        (
          1,
          '2022-01-01 11:10:08',
          100,
          5,
          99.99,
          10,
          89.99,
          9.99,
          'pending',
          'Hello!'
        )
    `);
  });

  it("smaller printWidth setting breaks shorter lines", () => {
    expect(
      format(
        `INSERT INTO customer_orders
        VALUES (1, '2022-01-01', 100, 5, 99.99, 'XXL')`,
        { printWidth: 40 }
      )
    ).toBe(dedent`
      INSERT INTO customer_orders
      VALUES
        (
          1,
          '2022-01-01',
          100,
          5,
          99.99,
          'XXL'
        )
    `);
  });
});
