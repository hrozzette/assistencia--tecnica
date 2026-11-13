import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Usuario from '../model/Usuario.js';

class UsuarioController {

    public static async login(req: Request, res: Response): Promise<void> {
        const { email, senha } = req.body;

        if (!email || !senha) {
            res.status(400).json({ mensagem: 'Informe o email e a senha.' });
            return;
        }

        const usuario = await Usuario.buscarPorEmail(email);

        if (!usuario) {
            res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
            return;
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaValida) {
            res.status(401).json({ mensagem: 'Email ou senha incorretos.' });
            return;
        }

        const chave = process.env.JWT_SECRET;

        if (!chave) {
            res.status(500).json({ mensagem: 'Chave de autenticação não configurada.' });
            return;
        }

        const token = jwt.sign(
            {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome
            },
            chave,
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            mensagem: 'Login realizado com sucesso.',
            token,
            usuario: {
                id_usuario: usuario.id_usuario,
                nome: usuario.nome,
                email: usuario.email
            }
        });
    }

    public static verificarToken(req: Request, res: Response, next: NextFunction): void {
        const autorizacao = req.headers.authorization;

        if (!autorizacao) {
            res.status(401).json({ mensagem: 'Acesso não autorizado.' });
            return;
        }

        const token = autorizacao.split(' ')[1];
        const chave = process.env.JWT_SECRET;

        if (!token || !chave) {
            res.status(401).json({ mensagem: 'Token inválido.' });
            return;
        }

        try {
            jwt.verify(token, chave);
            next();
        } catch {
            res.status(401).json({ mensagem: 'Token inválido ou expirado.' });
        }
    }
}

export default UsuarioController;