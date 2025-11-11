import jwt from 'jsonwebtoken';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface LoginResult {
  success: boolean;
  message?: string;
  user?: User;
  token?: string;
}

// Simulación de base de datos de usuarios
// En producción, esto debería estar en una base de datos real
const users: User[] = [
  {
    id: '1',
    username: 'player1',
    email: 'player1@example.com',
    role: 'player'
  },
  {
    id: '2',
    username: 'admin',
    email: 'admin@example.com',
    role: 'admin'
  }
];

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const loginService = {
  /**
   * Autentica un usuario con username y password
   */
  async authenticate(username: string, password: string): Promise<LoginResult> {
    // Simulación de validación de credenciales
    // En producción, esto debería verificar contra una base de datos
    // con contraseñas hasheadas (bcrypt, argon2, etc.)
    
    if (!username || !password) {
      return {
        success: false,
        message: 'Username and password are required'
      };
    }

    // Credenciales de prueba (en producción usar hash)
    const validCredentials = {
      'player1': 'password123',
      'admin': 'admin123'
    };

    if (!validCredentials[username as keyof typeof validCredentials]) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    if (validCredentials[username as keyof typeof validCredentials] !== password) {
      return {
        success: false,
        message: 'Invalid password'
      };
    }

    // Buscar usuario
    const user = users.find(u => u.username === username);

    if (!user) {
      return {
        success: false,
        message: 'User not found'
      };
    }

    // Generar token JWT
    const payload = { userId: user.id, username: user.username, role: user.role };
    // @ts-expect-error - JWT_EXPIRES_IN es válido como string para expiresIn (jsonwebtoken acepta string)
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return {
      success: true,
      user,
      token
    };
  },

  /**
   * Valida un token JWT
   */
  validateToken(token: string): boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Obtiene información del usuario desde el token
   */
  getUserFromToken(token: string): User | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      return users.find(u => u.id === decoded.userId) || null;
    } catch (error) {
      return null;
    }
  }
};

