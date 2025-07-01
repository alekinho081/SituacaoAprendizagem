import jwt from 'jsonwebtoken';

function autenticar(req, res, next) {
    const rotasPublicas = ['/login', '/pacientes', '/medicos'];

    if (rotasPublicas.includes(req.path)) {
        return next();
    }

    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];


    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = {
            id: decoded.id,
            tipo: decoded.tipo,
            email: decoded.email
        };

        next();
    } catch (error) {
        console.error('Erro na verificação do token:', error);
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

export default autenticar;