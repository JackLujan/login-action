import request from 'supertest';
import app from '../server';
import { loginService } from '../services/loginService';

describe('Login Tests', () => {
  describe('POST /api/login', () => {
    it('should return 400 if username is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ password: 'password123' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 400 if password is missing', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({ username: 'player1' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('required');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'player1',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return 200 and token for valid credentials', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'player1',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toBeDefined();
      expect(response.body.user.username).toBe('player1');
    });

    it('should return 401 for non-existent user', async () => {
      const response = await request(app)
        .post('/api/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/login/status', () => {
    it('should return 401 if no token provided', async () => {
      const response = await request(app)
        .get('/api/login/status');

      expect(response.status).toBe(401);
      expect(response.body.authenticated).toBe(false);
    });

    it('should return 401 for invalid token', async () => {
      const response = await request(app)
        .get('/api/login/status')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.authenticated).toBe(false);
    });

    it('should return 200 for valid token', async () => {
      // Primero hacer login para obtener un token válido
      const loginResponse = await request(app)
        .post('/api/login')
        .send({
          username: 'player1',
          password: 'password123'
        });

      const token = loginResponse.body.token;

      const response = await request(app)
        .get('/api/login/status')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.authenticated).toBe(true);
    });
  });

  describe('LoginService', () => {
    it('should authenticate valid user', async () => {
      const result = await loginService.authenticate('player1', 'password123');

      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.token).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const result = await loginService.authenticate('player1', 'wrongpassword');

      expect(result.success).toBe(false);
      expect(result.message).toBeDefined();
    });

    it('should validate token correctly', async () => {
      // Primero crear un token
      const result = await loginService.authenticate('player1', 'password123');
      
      if (result.token) {
        const isValid = loginService.validateToken(result.token);
        expect(isValid).toBe(true);
      }
    });

    it('should reject invalid token', () => {
      const isValid = loginService.validateToken('invalid-token');
      expect(isValid).toBe(false);
    });
  });
});

