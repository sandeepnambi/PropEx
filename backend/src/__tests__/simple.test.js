import { expect, describe, it } from '@jest/globals';

describe('Simple Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });
});
