// updateUser.test.ts

import { Request, Response } from 'express';
import User from '../../../models/user.model';
import updateUser from '../../../routes/normal/user/user.updateUser';
import { check_email } from '../../../functions/check_functions';

jest.mock('../../../models/user.model');

describe('updateUser', () => {
    it('should update a user successfully', async () => {
        // Mock request object
        const req = {
            body: {
                id: 1,
                username: 'testuser',
                email: 'new_email@dc.com',
                profile_picture: 'test.jpg'
            }
        } as Request;

        // Mock response object
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        // Mock the User.update method
        (User.findByPk as jest.Mock).mockResolvedValueOnce({
            id: 1,
            username: 'testuser',
            email: 'email@dc.com',
            profile_picture: 'test.jpg'
        });
        (User.update as jest.Mock).mockResolvedValueOnce([1]); // Assuming update returns an array indicating the number of affected rows

        // Call the updateUser function
        await updateUser(req, res);

        // Assertions
        expect(User.update).toHaveBeenCalledWith(
            { username: 'testuser', email: 'new_email@dc.com', profile_picture: 'test.jpg' },
            { where: { id: 1 } }
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update: User updated' });
    });

    it('should handle wrong email', async () => {
        // Mock request object
        const req = {
            body: {
                id: 1,
                username: 'testuser',
                email: 'dc.com',
                profile_picture: 'test.jpg'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update: Email wrong format' });
    })

    it('should handle missing parameters', async () => {
        // Mock request object
        const req = {
            body: {
                id: 1,
                username: 'testuser',
                email: '',
                profile_picture: 'test.jpg'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update: Missing parameters' });
    });

    it('should handle user not found', async () => {
        // Mock request object
        const req = {
            body: {
                id: 1,
                username: 'testuser',
                email: 'dc@email.com',
                profile_picture: 'new_picture.jpg'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        (User.findByPk as jest.Mock).mockResolvedValueOnce(null);

        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update: User not found' });
    })

    it('should handle errors', async () => {
        // Mock request object
        const req = {
            body: {
                id: 1,
                username: 'testuser',
                email: 'test@mail.com',
                profile_picture: 'test.jpg'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        // Mock the User.update method
        (User.findByPk as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    })
});
