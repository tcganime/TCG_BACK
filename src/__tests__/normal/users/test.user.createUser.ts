import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import User from '../../../models/user.model';
import createUser from '../../../routes/normal/user/user.createUser';

jest.mock('../../../models/user.model');
jest.mock('bcrypt');

describe('createUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a user successfully', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Password123=',
                profile_picture: 'test.jpg',
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        // Mock the findOne method of the User model
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);

        // Mock the create method of the User model
        (User.create as jest.Mock).mockResolvedValueOnce({} as any); // Replace with actual user data

        const hashedPassword = 'hashedpassword';
        (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(hashedPassword);

        await createUser(req, res);

        expect(bcrypt.hashSync).toHaveBeenCalledWith('Password123=', 10);

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                [Op.or]: [
                    { username: 'testuser' },
                    { email: 'test@example.com' },
                ],
            },
        });
        expect(User.create).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword', // This is the hashed version of 'password123'
            profile_picture: 'test.jpg',
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/create: User created' });
    });

    it('should create a user successfully without profile picture', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Password123='
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        // Mock the findOne method of the User model
        (User.findOne as jest.Mock).mockResolvedValueOnce(null);

        // Mock the create method of the User model
        (User.create as jest.Mock).mockResolvedValueOnce({} as any); // Replace with actual user data

        const hashedPassword = 'hashedpassword';
        (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(hashedPassword);

        await createUser(req, res);

        expect(bcrypt.hashSync).toHaveBeenCalledWith('Password123=', 10);

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                [Op.or]: [
                    { username: 'testuser' },
                    { email: 'test@example.com' },
                ],
            },
        });
        expect(User.create).toHaveBeenCalledWith({
            username: 'testuser',
            email: 'test@example.com',
            password: 'hashedpassword', // This is the hashed version of 'password123'
            profile_picture: null
        });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/create: User created' });
    });

    it('should handle user already exists', async () => {
        const req = {
            body: {
                username: 'existinguser',
                email: 'existing@example.com',
                password: 'Password123=',
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        // Mock the findOne method of the User model to return an existing user
        (User.findOne as jest.Mock).mockResolvedValueOnce({} as any); // Replace with actual existing user data

        await createUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                [Op.or]: [
                    { username: 'existinguser' },
                    { email: 'existing@example.com' },
                ],
            },
        });
        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/create: User already exists' });
    });

    it('should handle missing username field', async () => {
        const req = {
            body: {
                username: '',
                email: 'invalidemail',
                password: 'weakpassworD123!',
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '/user/create: Username is required',
        });
    });

    it('should handle missing password field', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'test@mail.com',
                password: ''
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '/user/create: Password is required',
        });
    });

    it('should handle missing email field', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: '',
                password: 'Password123=',
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '/user/create: Email is required',
        });
    });

    it('should handle invalid password', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'test@mail.com',
                password: 'weakpassword'
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);

        expect(res.json).toHaveBeenCalledWith({
            message: '/user/create: Password is not valid',
        });
    })

    it('should handle invalid email', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'invalidemail',
                password: 'Password123=',
            },
        } as Request;

        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            message: '/user/create: Email is not valid',
        });
    });


    it('should handle internal error', async () => {
        const req = {
            body: {
                username: 'testuser',
                email: 'test@example.com',
                password: 'Password123=',
            },
        } as Request;
        const res = {
            status: jest.fn().mockReturnThis(), // Mock the chainable status method
            json: jest.fn(),
        } as unknown as Response;

        // Mock the findOne method of the User model to throw an error
        (User.findOne as jest.Mock).mockRejectedValueOnce(new Error('Database error'));

        await createUser(req, res);

        expect(User.findOne).toHaveBeenCalledWith({
            where: {
                [Op.or]: [
                    { username: 'testuser' },
                    { email: 'test@example.com'}
                ],
            },
        });

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            message: '/user/create: Internal Error: Database error',
        });
    });
});