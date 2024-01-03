import secret_key from './secret_key';
import * as jwt from 'jsonwebtoken';

/**
 * @param id 
 * @param admin 
 * @returns a JWT token with the id and admin and expires in 2 hours
 */
function createJWT(id: number, admin: boolean) : string {
    const token = jwt.sign({ id, admin, refresh: false }, secret_key.getSecretKey, { expiresIn: '2h' });
    return token;
}

/**
 * @param id 
 * @param admin 
 * @returns a refresh token with the id and admin and expires in 2 days
 */

function createRefreshToken(id: number, admin: boolean) : string {
    const token = jwt.sign({ id, admin, refresh: true }, secret_key.getSecretKey, { expiresIn: '2d' });
    return token;
}
  
export { createJWT, createRefreshToken };
  