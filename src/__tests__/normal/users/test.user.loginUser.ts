import { Request, Response } from 'express';
import User from '../../../models/user.model';
import bcrypt from 'bcrypt';
import { createJWT, createRefreshToken } from '../../../jwt/creation_token';
import loginUser from '../../../routes/normal/user/user.loginUser';
import secret_key from '../../../jwt/secret_key';

jest.mock('../../../models/user.model');
jest.mock('../../../jwt/creation_token');
jest.mock('bcrypt');

describe('loginUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully login a user with correct username', async () => {
    const req = {
      body: {
        credential: 'testuser',
        password: 'password123',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the findOne method of the User model to return a user
    const user = {
      id: 1,
      username: 'testuser',
      password: '$2b$10$abcdefghijklmnopqrstuv', // bcrypt hash for 'password123'
      admin: false,
    };
    (User.findOne as jest.Mock).mockResolvedValueOnce(user);

    // Mock the bcrypt.compare method to return true
    (bcrypt.compare as jest.Mock).mockImplementationOnce((pw, hash, callback) => callback(null, true));

    // Mock the createJWT and createRefreshToken methods
    (createJWT as jest.Mock).mockReturnValueOnce('fakeAccessToken');
    (createRefreshToken as jest.Mock).mockReturnValueOnce('fakeRefreshToken');

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser'},
      attributes: ['username', 'password', 'id', 'admin'],
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password, expect.any(Function));
    expect(createJWT).toHaveBeenCalledWith(user.id, user.admin);
    expect(createRefreshToken).toHaveBeenCalledWith(user.id, user.admin);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'fakeAccessToken',
      refresh_token: 'fakeRefreshToken',
    });
  });

  it('should successfully login a user with correct email', async () => {
    const req = {
      body: {
        credential: 'test@mail.com',
        password: 'password123',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the findOne method of the User model to return a user
    const user = {
      id: 1,
      username: 'testuser',
      email: 'test@mail.com',
      password: '$2b$10$abcdefghijklmnopqrstuv', // bcrypt hash for 'password123'
      admin: false,
    };
    (User.findOne as jest.Mock).mockResolvedValueOnce(user);

    // Mock the bcrypt.compare method to return true
    (bcrypt.compare as jest.Mock).mockImplementationOnce((pw, hash, callback) => callback(null, true));

    // Mock the createJWT and createRefreshToken methods
    (createJWT as jest.Mock).mockReturnValueOnce('fakeAccessToken');
    (createRefreshToken as jest.Mock).mockReturnValueOnce('fakeRefreshToken');

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { email: 'test@mail.com'},
      attributes: ['username', 'password', 'id', 'admin'],
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', user.password, expect.any(Function));
    expect(createJWT).toHaveBeenCalledWith(user.id, user.admin);
    expect(createRefreshToken).toHaveBeenCalledWith(user.id, user.admin);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      token: 'fakeAccessToken',
      refresh_token: 'fakeRefreshToken',
    });
  });

  it('should handle user not found', async () => {
    const req = {
      body: {
        credential: 'nonexistentuser',
        password: 'password123',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the findOne method of the User model to return null
    (User.findOne as jest.Mock).mockResolvedValueOnce(null);

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: 'nonexistentuser' },
      attributes: ['username', 'password', 'id', 'admin'],
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: '/user/login: User not found' });
  });

  it('should handle wrong password', async () => {
    const req = {
      body: {
        credential: 'testuser',
        password: 'wrongpassword',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the findOne method of the User model to return a user
    const user = {
      id: 1,
      username: 'testuser',
      password: '$2b$10$abcdefghijklmnopqrstuv', // bcrypt hash for 'password123'
      admin: false,
    };
    (User.findOne as jest.Mock).mockResolvedValueOnce(user);

    // Mock the bcrypt.compare method to return false
    (bcrypt.compare as jest.Mock).mockImplementationOnce((pw, hash, callback) => callback(null, false));

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser' },
      attributes: ['username', 'password', 'id', 'admin'],
    });
    expect(bcrypt.compare).toHaveBeenCalledWith('wrongpassword', user.password, expect.any(Function));
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: '/user/login: Wrong password' });
  });



  it('should handle no parameters', async () => {
    const req = {
      body: {},
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: '/user/login: Missing parameters' });
  });

  it('should handle internal error', async () => {
    const req = {
      body: {
        credential: 'testuser',
        password: 'password123',
      },
    } as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mock the findOne method of the User model to throw an error
    (User.findOne as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await loginUser(req, res);

    expect(User.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser' },
      attributes: ['username', 'password', 'id', 'admin'],
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: '/user/login: Internal Error: Database error' });
  });
});
