import { Request, Response } from 'express';
import User from '../../../models/user.model';
import getUserById from '../../../routes/normal/user/user.getUserById';

jest.mock('../../../models/user.model'); // Mock the User model

describe('getUserById', () => {

  let res: Response;

  beforeEach(() => {
    jest.clearAllMocks();

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    } as any;
  });

  it('should get a user by ID successfully', async () => {
    const mockedUser = {
      id: 1,
      username: 'testuser',
      profile_picture: 'test.jpg',
      victories: 5,
      defeats: 2,
    };

    // Mock the findByPk method of the User model
    (User.findByPk as jest.Mock).mockResolvedValueOnce(mockedUser);

    const req = { params: { id: '1' } } as any;

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith('1', {
      attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats'],
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockedUser);
  });

  it('should handle user not found', async () => {
    // Mock the findByPk method of the User model to return null
    (User.findByPk as jest.Mock).mockResolvedValueOnce(null);

    const req = { params: { id: '1' } } as any;

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith('1', {
      attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats'],
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('should handle errors', async () => {
    // Mock the findByPk method of the User model to throw an error
    (User.findByPk as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

    const req = { params: { id: '1' } } as any;

    await getUserById(req, res);

    expect(User.findByPk).toHaveBeenCalledWith('1', {
      attributes: ['id', 'username', 'profile_picture', 'victories', 'defeats'],
    });
    expect(res.status).toHaveBeenCalledWith(500);
    // check if there is a json object
    expect(res.json).toHaveBeenCalled(); // Check if json method is called
    expect(res.json).toHaveBeenCalledTimes(1); // Ensure json is called only once
   });
});
