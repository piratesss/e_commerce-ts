import jwt from 'jsonwebtoken';

import { APP_USER_TYPE } from '../config';

export const authenticateUserToken = (req: any, res: any, next: any) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
            if (err) return res.sendStatus(403);
            if (decoded.role !== APP_USER_TYPE.USER) return res.sendStatus(403);

            req.user = decoded;

            const newToken = jwt.sign(
                { id: decoded.id, role: APP_USER_TYPE.USER },
                process.env.JWT_SECRET,
                {
                    expiresIn: '15m',
                }
            );
            res.setHeader('Authorization', `Bearer ${newToken}`);

            next();
        });
    } catch (error) {
        return res.status(500).send('You do not have the rights to visit this route');
    }
};

export const authenticateAgentToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err: any, decoded: any) => {
        if (err) return res.sendStatus(403);
        if (decoded.role !== APP_USER_TYPE.AGENT) return res.sendStatus(403);

        req.agent = decoded;

        const newToken = jwt.sign(
            { id: decoded.id, role: APP_USER_TYPE.AGENT },
            process.env.JWT_SECRET,
            {
                expiresIn: '15m',
            }
        );
        res.setHeader('Authorization', `Bearer ${newToken}`);

        next();
    });
};
