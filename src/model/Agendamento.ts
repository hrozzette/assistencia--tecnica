import { DatabaseModel } from './DatabaseModel.js';

const database = new DatabaseModel();

class Agendamento {

    private id_agendamento: number = 0;
    private id_equipamento: number;
    private data_agendamento: Date;

    constructor(
        _id_equipamento: number,
        _data_agendamento: Date
    ) {
        this.id_equipamento = _id_equipamento;
        this.data_agendamento = _data_agendamento;
    }

    public getIdAgendamento(): number {
        return this.id_agendamento;
    }

    public setIdAgendamento(id_agendamento: number): void {
        this.id_agendamento = id_agendamento;
    }

    public getIdEquipamento(): number {
        return this.id_equipamento;
    }

    public setIdEquipamento(id_equipamento: number): void {
        this.id_equipamento = id_equipamento;
    }

    public getDataAgendamento(): Date {
        return this.data_agendamento;
    }

    public setDataAgendamento(data_agendamento: Date): void {
        this.data_agendamento = data_agendamento;
    }

    public static async listar(): Promise<any[]> {
        try {
            const resultado = await database.pool.query(
                `SELECT 
                    agendamentos.id_agendamento,
                    agendamentos.data_agendamento,
                    equipamentos.nome AS nome_equipamento,
                    equipamentos.marca,
                    equipamentos.modelo,
                    clientes.nome AS nome_cliente
                FROM agendamentos
                INNER JOIN equipamentos ON agendamentos.id_equipamento = equipamentos.id_equipamento
                INNER JOIN clientes ON equipamentos.id_cliente = clientes.id_cliente
                ORDER BY agendamentos.data_agendamento`
            );

            return resultado.rows;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public static async atualizarData(
        id_agendamento: number,
        data_agendamento: Date
    ): Promise<boolean> {
        try {
            const resultado = await database.pool.query(
                'UPDATE agendamentos SET data_agendamento = $1 WHERE id_agendamento = $2',
                [data_agendamento, id_agendamento]
            );

            return resultado.rowCount !== null && resultado.rowCount > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export default Agendamento;