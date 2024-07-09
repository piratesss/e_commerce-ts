import jwt from 'jsonwebtoken';

export const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);

        req.user = user;

        const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '15m',
        });
        res.setHeader('Authorization', `Bearer ${newToken}`);

        next();
    });
};
