
import type { Request, Response } from 'express';
import Equipamento from '../model/Equipamento.js';

class EquipamentoController {

    public static async listar(req: Request, res: Response): Promise<void> {
        const equipamentos = await Equipamento.listar();

        res.status(200).json(equipamentos);
    }

    public static async buscar(req: Request, res: Response): Promise<void> {
        const termo = String(req.query.termo || '');
        const equipamentos = await Equipamento.buscar(termo);

        res.status(200).json(equipamentos);
    }

    public static async cadastrar(req: Request, res: Response): Promise<void> {
        const { id_cliente, nome, marca, modelo, numero_serie } = req.body;

        if (!id_cliente || !nome) {
            res.status(400).json({
                mensagem: 'Cliente e nome do equipamento são obrigatórios.'
            });
            return;
        }

        const equipamento = new Equipamento(
            Number(id_cliente),
            nome,
            marca,
            modelo,
            numero_serie
        );

        const resultado = await Equipamento.cadastrar(equipamento);

        if (resultado) {
            res.status(201).json({
                mensagem: 'Equipamento cadastrado com sucesso.'
            });
        } else {
            res.status(400).json({
                mensagem: 'Não foi possível cadastrar o equipamento. Verifique o cliente informado.'
            });
        }
    }

    public static async editar(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const { id_cliente, nome, marca, modelo, numero_serie } = req.body;

        if (!id || !id_cliente || !nome) {
            res.status(400).json({
                mensagem: 'Dados inválidos.'
            });
            return;
        }

        const equipamento = new Equipamento(
            Number(id_cliente),
            nome,
            marca,
            modelo,
            numero_serie
        );

        equipamento.setIdEquipamento(id);

        const resultado = await Equipamento.editar(equipamento);

        if (resultado) {
            res.status(200).json({
                mensagem: 'Equipamento atualizado com sucesso.'
            });
        } else {
            res.status(404).json({
                mensagem: 'Equipamento não encontrado.'
            });
        }
    }

    public static async excluir(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);

        if (!id || !Number.isInteger(id) || id <= 0) {
            res.status(400).json({
                mensagem: 'ID do equipamento inválido.'
            });
            return;
        }

        try {
            const resultado = await Equipamento.excluir(id);

            if (resultado) {
                res.status(200).json({
                    mensagem: 'Equipamento excluído com sucesso.'
                });
            } else {
                res.status(404).json({
                    mensagem: 'Equipamento não encontrado.'
                });
            }

        } catch (error: any) {
            if (error.message === 'EQUIPAMENTO_POSSUI_AGENDAMENTOS') {
                res.status(409).json({
                    mensagem: 'Não é possível excluir este equipamento porque existem agendamentos vinculados a ele.'
                });
                return;
            }

            res.status(500).json({
                mensagem: 'Erro ao excluir equipamento.'
            });
        }
    }
}

export default EquipamentoController;
