// src/tests/CreateCommission.test.js

import { createCommission } from '../services/commission';

const testCommission = {
  title: "Test Commission",
  description: "This is a test commission",
  price: 100,
  deadline: "2024-12-31",
  requirements: "Test requirements"
};

describe('Commission Creation', () => {
  test('should create a new commission', async () => {
    const result = await createCommission(testCommission);
    expect(result).toHaveProperty('id');
    expect(result.message).toBe('Commission created successfully');
  });

  test('should validate price > 0', async () => {
    const invalidCommission = { ...testCommission, price: -100 };
    await expect(createCommission(invalidCommission)).rejects.toThrow();
  });

  test('should validate future deadline', async () => {
    const invalidCommission = { ...testCommission, deadline: '2020-01-01' };
    await expect(createCommission(invalidCommission)).rejects.toThrow();
  });
});