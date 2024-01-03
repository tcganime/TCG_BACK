// __tests__/routes/normal/user/updateUserPassword.test.ts
import { Request, Response } from 'express';
import { mocked } from 'jest-mock';
import bcrypt from 'bcrypt';
import User from '../../../models/user.model';
import updateUserPassword from '../../../routes/normal/user/user.updateUserPassword';
import { check_password } from '../../../functions/check_functions';


jest.mock('../../../models/user.model');
jest.mock('bcrypt');

describe('updateUserPassword', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should update a user password successfully and return 201 status code', async () => {
        const req = {
            body: {
                id: 1,
                password: 'Testpassword123!'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        (User.findByPk as jest.Mock).mockResolvedValueOnce({
            id: 1,
            username: 'testuser',
            email: 'email@dc.com',
            profile_picture: 'test.jpg'
        });
        (User.update as jest.Mock).mockResolvedValueOnce([1]);

        const hashedPassword = 'hashedpassword';
        (bcrypt.hashSync as jest.Mock).mockReturnValueOnce(hashedPassword);
        
        await updateUserPassword(req, res);

        expect(User.update).toHaveBeenCalledWith(
            { password: 'hashedpassword' }, // This is the hashed version of 'password123
            { where: { id: 1 } }
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update/password: User password updated' });
    })

    it('should return 400 status code if password is missing', async () => {
        const req = {
            body: {
                id: 1,
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        await updateUserPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update/password: Missing parameters' });
    })

    it('should return 401 status code if password is wrong format', async () => {
        const req = {
            body: {
                id: 1,
                password: 'testpassword'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        await updateUserPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update/password: Password wrong format' });
    })

    it('should return 404 status code if user is not found', async () => {
        const req = {
            body: {
                id: 1,
                password: 'Testpassword123!'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        (User.findByPk as jest.Mock).mockResolvedValueOnce(null);

        await updateUserPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update/password: User not found' });
    })  

    it('handle DB error if User.udpdate fails and return 500', async () => {
        const req = {
            body: {
                id: 1,
                password: 'Testpassword123!'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        (User.findByPk as jest.Mock).mockResolvedValueOnce({
            id: 1
        });

        (User.prototype.update as jest.Mock).mockRejectedValueOnce(new Error('Update method failed'));

        await updateUserPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: '/user/update/password: Internal Error' });
    })

    it('should handle errors', async () => {
        const req = {
            body: {
                id: 1,
                password: 'Testpassword123!'
            }
        } as Request;

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        (User.findByPk as jest.Mock).mockRejectedValueOnce(new Error('Test error'));

        await updateUserPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: `/user/update/password: Internal Error: Test error` });
    })
});
