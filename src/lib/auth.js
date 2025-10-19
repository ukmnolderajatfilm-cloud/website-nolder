import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * Middleware untuk validasi admin authentication
 */
export function validateAdminAuth(request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '') || request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return { isValid: false, error: 'No token provided' };
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret);
    
    if (!decoded.adminId && !decoded.id) {
      return { isValid: false, error: 'Invalid token payload' };
    }

    return { 
      isValid: true, 
      adminId: decoded.adminId || decoded.id,
      admin: decoded 
    };
  } catch (error) {
    console.error('Auth validation error:', error);
    return { 
      isValid: false, 
      error: 'Invalid or expired token' 
    };
  }
}

/**
 * Validasi ownership artikel
 */
export async function validateArticleOwnership(articleId, adminId) {
  try {
    const { prisma } = await import('../lib/db.js');
    
    const article = await prisma.article.findUnique({
      where: {
        id: parseInt(articleId),
        deletedAt: null
      },
      select: {
        id: true,
        adminId: true,
        title: true,
        status: true
      }
    });

    if (!article) {
      return { 
        isValid: false, 
        error: 'Article not found' 
      };
    }

    if (article.adminId !== parseInt(adminId)) {
      return { 
        isValid: false, 
        error: 'You can only access your own articles' 
      };
    }

    return { 
      isValid: true, 
      article 
    };
  } catch (error) {
    return { 
      isValid: false, 
      error: 'Database error' 
    };
  }
}

/**
 * Validasi admin role (untuk superadmin yang bisa akses semua)
 */
export function validateAdminRole(admin, requiredRole = 'admin') {
  const roles = ['admin', 'superadmin', 'manager'];
  const adminRole = admin.role || 'admin';
  
  const adminRoleIndex = roles.indexOf(adminRole);
  const requiredRoleIndex = roles.indexOf(requiredRole);
  
  return adminRoleIndex >= requiredRoleIndex;
}

/**
 * Verifikasi password dengan bcrypt
 */
export async function verifyPassword(password, hashedPassword) {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}

/**
 * Generate JWT token untuk admin
 */
export function generateToken(payload) {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.sign(
      { 
        adminId: payload.id,
        username: payload.username,
        role: payload.role,
        ...payload 
      }, 
      secret, 
      { expiresIn: '24h' }
    );
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate token');
  }
}

/**
 * Verify JWT token (alias untuk backward compatibility)
 */
export function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}