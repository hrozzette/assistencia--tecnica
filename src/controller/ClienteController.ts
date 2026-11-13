import type { Request, Response } from 'express';
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto';
import Cliente from '../model/Cliente.js';

class ClienteController {

    private static obterChave(): Buffer {
        const chave = process.env.CPF_ENCRYPTION_KEY;

        if (!chave) {
            throw new Error('Chave de criptografia não configurada.');
        }

        return createHash('sha256').update(chave).digest();
    }

    private static criptografarCpf(cpf: string): string {
        const chave = ClienteController.obterChave();
        const iv = randomBytes(16);
        const cifra = createCipheriv('aes-256-gcm', chave, iv);

        let criptografado = cifra.update(cpf, 'utf8', 'hex');
        criptografado += cifra.final('hex');

        const autenticacao = cifra.getAuthTag().toString('hex');

        return `${iv.toString('hex')}:${autenticacao}:${criptografado}`;
    }

    private static descriptografarCpf(cpf: string): string {
        try {
            const partes = cpf.split(':');
            const [ivTexto, autenticacaoTexto, conteudo] = partes;

            if (!ivTexto || !autenticacaoTexto || !conteudo) {
                return cpf;
            }

            const chave = ClienteController.obterChave();
            const iv = Buffer.from(ivTexto, 'hex');
            const autenticacao = Buffer.from(autenticacaoTexto, 'hex');

            const decifra = createDecipheriv('aes-256-gcm', chave, iv);
            decifra.setAuthTag(autenticacao);

            let descriptografado = decifra.update(conteudo, 'hex', 'utf8');
            descriptografado += decifra.final('utf8');

            return descriptografado;
        } catch {
            return cpf;
        }
    }

    public static async listar(req: Request, res: Response): Promise<void> {
        const clientes = await Cliente.listar();

        const resultado = clientes.map(cliente => ({
            ...cliente,
            cpf: ClienteController.descriptografarCpf(cliente.cpf_criptografado)
        }));

        res.status(200).json(resultado);
    }

    public static async buscar(req: Request, res: Response): Promise<void> {
        const termo = String(req.query.termo || '');
        const clientes = await Cliente.buscar(termo);

        const resultado = clientes.map(cliente => ({
            ...cliente,
            cpf: ClienteController.descriptografarCpf(cliente.cpf_criptografado)
        }));

        res.status(200).json(resultado);
    }

    public static async cadastrar(req: Request, res: Response): Promise<void> {
        const { nome, cpf, telefone, email } = req.body;

        if (!nome || !cpf) {
            res.status(400).json({ mensagem: 'Nome e CPF são obrigatórios.' });
            return;
        }

        const cpfCriptografado = ClienteController.criptografarCpf(cpf);

        const cliente = new Cliente(nome, cpfCriptografado, telefone, email);
        const resultado = await Cliente.cadastrar(cliente);

        if (resultado) {
            res.status(201).json({ mensagem: 'Cliente cadastrado com sucesso.' });
        } else {
            res.status(500).json({ mensagem: 'Erro ao cadastrar cliente.' });
        }
    }

    public static async editar(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const { nome, cpf, telefone, email } = req.body;

        if (!id || !nome || !cpf) {
            res.status(400).json({ mensagem: 'Dados inválidos.' });
            return;
        }

        const cpfCriptografado = ClienteController.criptografarCpf(cpf);

        const cliente = new Cliente(nome, cpfCriptografado, telefone, email);
        cliente.setIdCliente(id);

        const resultado = await Cliente.editar(cliente);

        if (resultado) {
            res.status(200).json({ mensagem: 'Cliente atualizado com sucesso.' });
        } else {
            res.status(404).json({ mensagem: 'Cliente não encontrado.' });
        }
    }

    public static async excluir(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);

        if (!id) {
            res.status(400).json({ mensagem: 'ID inválido.' });
            return;
        }

        const resultado = await Cliente.excluir(id);

        if (resultado) {
            res.status(200).json({ mensagem: 'Cliente excluído com sucesso.' });
        } else {
            res.status(404).json({ mensagem: 'Cliente não encontrado ou possui equipamentos vinculados.' });
        }
    }
}

export default ClienteController;