import { Router, Request, Response } from 'express';
import { loginService } from '../services/loginService';

export const loginRouter = Router();

interface LoginRequest {
  username: string;
  password: string;
}

/**
 * POST /api/login
 * Realiza el login del usuario
 */
loginRouter.post('/', async (req: Request, res: Response) => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const result = await loginService.authenticate(username, password);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token
      });
    } else {
      res.status(401).json({
        success: false,
        message: result.message || 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * GET /api/login/status
 * Verifica el estado de la sesión
 */
loginRouter.get('/status', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      authenticated: false,
      message: 'No token provided'
    });
  }

  const isValid = loginService.validateToken(token);

  res.status(isValid ? 200 : 401).json({
    authenticated: isValid,
    message: isValid ? 'Session is valid' : 'Invalid or expired token'
  });
});

