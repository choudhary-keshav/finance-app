import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403);
    }
    req.body.user = user;

    next();
  });
};

module.exports = authenticateToken;
