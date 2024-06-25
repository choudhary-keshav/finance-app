jest.mock('./src/models/userModel', () => ({
  User: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('./src/config/generateToken', () => jest.fn());
