import { Request, Response } from 'express';
import User from '../../../models/user.model';
import getAllUsers from '../../../routes/normal/user/user.getAllUsers';

jest.mock('../../../models/user.model');

describe('getAllUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get all users successfully', async () => {
    // Mock the findAll method of the User model to return an array of users
    const mockedUsers = [
      { id: 1, username: 'user1', victories: 5, defeats: 2 },
      { id: 2, username: 'user2', victories: 3, defeats: 1 },
    ];
    (User.findAll as jest.Mock).mockResolvedValueOnce(mockedUsers);

    const req = {} as Request;
    const res = {
      json: jest.fn(),
    } as unknown as Response;

    await getAllUsers(req, res);

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'username', 'victories', 'defeats'],
    });
    expect(res.json).toHaveBeenCalledWith(mockedUsers);
  });

  it('should handle internal error', async () => {
    // Mock the findAll method of the User model to throw an error
    (User.findAll as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const req = {} as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    await getAllUsers(req, res);

    expect(User.findAll).toHaveBeenCalledWith({
      attributes: ['id', 'username', 'victories', 'defeats'],
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Database error' });
  });
});
