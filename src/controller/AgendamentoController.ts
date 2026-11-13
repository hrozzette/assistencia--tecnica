import type { Request, Response } from 'express';
import Agendamento from '../model/Agendamento.js';

class AgendamentoController {

    public static async listar(req: Request, res: Response): Promise<void> {
        const agendamentos = await Agendamento.listar();

        res.status(200).json(agendamentos);
    }

    public static async atualizarData(req: Request, res: Response): Promise<void> {
        const id = Number(req.params.id);
        const { data_agendamento } = req.body;

        if (!id || !data_agendamento || isNaN(Date.parse(data_agendamento))) {
            res.status(400).json({ mensagem: 'ID ou data inválidos.' });
            return;
        }

        const resultado = await Agendamento.atualizarData(
            id,
            new Date(data_agendamento)
        );

        if (resultado) {
            res.status(200).json({ mensagem: 'Data do agendamento atualizada com sucesso.' });
        } else {
            res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
        }
    }
}

export default AgendamentoController