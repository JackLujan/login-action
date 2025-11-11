import { Router, Request, Response } from 'express';
import { loginService } from '../services/loginService';

export const gamesRouter = Router();

// Middleware para verificar autenticación
const requireAuth = (req: Request, res: Response, next: Function) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const isValid = loginService.validateToken(token);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  next();
};

/**
 * GET /api/games
 * Obtiene la lista de juegos (requiere autenticación)
 */
gamesRouter.get('/', requireAuth, (req: Request, res: Response) => {
  // Simulación de lista de juegos
  const games = [
    {
      id: 1,
      name: 'Aventura Épica',
      description: 'Un juego de aventuras épicas',
      category: 'Aventura',
      players: 1000
    },
    {
      id: 2,
      name: 'Batalla Real',
      description: 'Juego de batalla en tiempo real',
      category: 'Acción',
      players: 2500
    },
    {
      id: 3,
      name: 'Estrategia Maestra',
      description: 'Juego de estrategia avanzada',
      category: 'Estrategia',
      players: 800
    }
  ];

  res.json({
    success: true,
    games,
    count: games.length
  });
});

/**
 * GET /api/games/:id
 * Obtiene información de un juego específico
 */
gamesRouter.get('/:id', requireAuth, (req: Request, res: Response) => {
  const gameId = parseInt(req.params.id);

  // Simulación de búsqueda de juego
  const game = {
    id: gameId,
    name: `Juego ${gameId}`,
    description: `Descripción del juego ${gameId}`,
    category: 'General',
    players: Math.floor(Math.random() * 5000)
  };

  res.json({
    success: true,
    game
  });
});

