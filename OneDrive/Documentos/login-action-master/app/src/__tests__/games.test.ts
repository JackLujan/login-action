import request from 'supertest';
import app from '../server';

describe('Games API Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // Obtener token de autenticación antes de las pruebas
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        username: 'player1',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/games', () => {
    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/games');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return games list with valid token', async () => {
      const response = await request(app)
        .get('/api/games')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.games).toBeDefined();
      expect(Array.isArray(response.body.games)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/games')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/games/:id', () => {
    it('should return game details with valid token', async () => {
      const response = await request(app)
        .get('/api/games/1')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.game).toBeDefined();
      expect(response.body.game.id).toBe(1);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .get('/api/games/1');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});

