import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)

  if (!token) {
    return res.status(401).send('Unauthorized');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log(err.message);
      return res.sendStatus(403);
    }
    req.body.user = user;
    next();
  });
};

module.exports = authenticateToken;

















// import { Request, Response, NextFunction } from 'express';
// import jwt, { VerifyErrors } from 'jsonwebtoken';

// const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers['authorization'];

//   if (!authHeader) {
//     return res.status(401).send('Unauthorized');
//   }

//   const token = authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).send('Unauthorized');
//   }

//   jwt.verify(
//     token,
//     process.env.JWT_SECRET as string,
//     (err: VerifyErrors | null, user: any) => {
//       if (err) {
//         console.error('JWT Verification Error:', err.message);
//         return res.sendStatus(403);
//       }

//       req.body.user = user;
//       next();
//     },
//   );
// };

// export default authenticateToken;


