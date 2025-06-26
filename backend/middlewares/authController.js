import jwt from 'jsonwebtoken';

function autenticar(req, res, next) {
    const rotasPublicas = ['/login', '/pacientes'];
    
    if (rotasPublicas.includes(req.path)) {
        return next();
    }
    
    const token = req.headers.authorization?.split(' ')[1]; 


    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.pacienteId = decoded.id; 
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido ou expirado' });
    }
}

export default autenticar;