import request from 'supertest';
import { app } from '../server.js';

describe('Example Test Suite', () => {
  it('should pass a simple test', () => {
    expect(1 + 1).toBe(2);
  });

  // Simple API test
  it('should return 200 for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
  });
});
