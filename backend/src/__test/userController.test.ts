import request from 'supertest';
import express, { Request, Response } from 'express';
import { User } from '../models/userModel';
 
const generateToken = require('../config/generateToken');

const {
  registerUser,
  loginUser,
  updateUser,
} = require('../controllers/userControllers');

const app = express();
app.use(express.json());
app.post('/api/user/register', (req: Request, res: Response) =>
  registerUser(req, res),
);
app.post('/api/user/login', (req: Request, res: Response) =>
  loginUser(req, res),
);
app.put('/api/user/update', (req: Request, res: Response) =>
  updateUser(req, res),
);

describe('User Controller', () => {
  describe('registerUser', () => {
    it('should register a new user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.create as jest.Mock).mockResolvedValue({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        pic: 'some-pic-url',
        isAdmin: false,
      });
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      const res = await request(app).post('/api/user/register').send({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
        pic: 'some-pic-url',
        token: 'mockToken',
      });
    });
  });

  describe('loginUser', () => {
    it('should log in an existing user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        isAdmin: false,
        matchPassword: jest.fn().mockResolvedValue(true),
        pic: 'some-pic-url',
      });
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      const res = await request(app).post('/api/user/login').send({
        email: 'john@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
        pic: 'some-pic-url',
        token: 'mockToken',
      });
    });
  });

  describe('updateUser', () => {
    it('should update user name and password', async () => {
      (User.findOne as jest.Mock).mockResolvedValue({
        _id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword',
        isAdmin: false,
        save: jest.fn().mockResolvedValue({
          _id: '123',
          name: 'Updated Name',
          email: 'john@example.com',
          password: 'updatedpassword',
          isAdmin: false,
          pic: 'some-pic-url',
        }),
      });
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      const res = await request(app)
        .put('/api/user/update')
        .query({
          updatedName: 'Updated Name',
          updatedPassword: 'updatedpassword',
        })
        .send({
          user: {
            payload: { email: 'john@example.com' },
          },
        });

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        _id: '123',
        name: 'Updated Name',
        email: 'john@example.com',
        isAdmin: false,
        pic: 'some-pic-url',
        token: 'mockToken',
      });
    });
  });
});
