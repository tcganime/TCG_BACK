// profileUser.test.ts

import { Request, Response } from 'express';
import User from '../../../models/user.model';
import profileUser from '../../../routes/normal/user/user.profileUser';

jest.mock('../../../models/user.model');

describe('profileUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return user profile successfully', async () => {
    const req = {
      body: { id: 1 },
    } as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    // Mock the findByPk method of the User model to return a user
    const user = {
      id: 1,
      username: 'testuser',
      profile_picture: 'test.jpg',
      victories: 5,
      defeats: 2,
    };
    (User.findByPk as jest.Mock).mockResolvedValueOnce(user);

    await profileUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1, {
      attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats'],
    });
    expect(res.json).toHaveBeenCalledWith(user);
  });

  it('should handle internal error', async () => {
    const req = {
      body: { id: 1 },
    } as Request;
    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    } as unknown as Response;

    // Mock the findByPk method of the User model to throw an error
    (User.findByPk as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    await profileUser(req, res);

    expect(User.findByPk).toHaveBeenCalledWith(1, {
      attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats'],
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: '/user/profile: Internal Error: Database error' });
  });
});
