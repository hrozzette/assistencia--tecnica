
import { DatabaseModel } from './DatabaseModel.js';

const database = new DatabaseModel();

class Equipamento {

    private id_equipamento: number = 0;
    private id_cliente: number;
    private nome: string;
    private marca: string;
    private modelo: string;
    private numero_serie: string;

    constructor(
        _id_cliente: number,
        _nome: string,
        _marca: string,
        _modelo: string,
        _numero_serie: string
    ) {
        this.id_cliente = _id_cliente;
        this.nome = _nome;
        this.marca = _marca;
        this.modelo = _modelo;
        this.numero_serie = _numero_serie;
    }

    public getIdEquipamento(): number {
        return this.id_equipamento;
    }

    public setIdEquipamento(id_equipamento: number): void {
        this.id_equipamento = id_equipamento;
    }

    public getIdCliente(): number {
        return this.id_cliente;
    }

    public setIdCliente(id_cliente: number): void {
        this.id_cliente = id_cliente;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getMarca(): string {
        return this.marca;
    }

    public setMarca(marca: string): void {
        this.marca = marca;
    }

    public getModelo(): string {
        return this.modelo;
    }

    public setModelo(modelo: string): void {
        this.modelo = modelo;
    }

    public getNumeroSerie(): string {
        return this.numero_serie;
    }

    public setNumeroSerie(numero_serie: string): void {
        this.numero_serie = numero_serie;
    }

    public static async listar(): Promise<any[]> {
        try {
            const resultado = await database.pool.query(
                `SELECT equipamentos.*, clientes.nome AS nome_cliente
                FROM equipamentos
                INNER JOIN clientes ON equipamentos.id_cliente = clientes.id_cliente
                ORDER BY equipamentos.nome`
            );

            return resultado.rows;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public static async buscar(termo: string): Promise<any[]> {
        try {
            const resultado = await database.pool.query(
                `SELECT equipamentos.*, clientes.nome AS nome_cliente
                FROM equipamentos
                INNER JOIN clientes ON equipamentos.id_cliente = clientes.id_cliente
                WHERE equipamentos.nome ILIKE $1
                OR equipamentos.marca ILIKE $1
                OR equipamentos.modelo ILIKE $1
                OR equipamentos.numero_serie ILIKE $1
                ORDER BY equipamentos.nome`,
                [`%${termo}%`]
            );

            return resultado.rows;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public static async cadastrar(equipamento: Equipamento): Promise<boolean> {
        try {
            await database.pool.query(
                'INSERT INTO equipamentos (id_cliente, nome, marca, modelo, numero_serie) VALUES ($1, $2, $3, $4, $5)',
                [
                    equipamento.getIdCliente(),
                    equipamento.getNome(),
                    equipamento.getMarca(),
                    equipamento.getModelo(),
                    equipamento.getNumeroSerie()
                ]
            );

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public static async editar(equipamento: Equipamento): Promise<boolean> {
        try {
            const resultado = await database.pool.query(
                `UPDATE equipamentos
                SET id_cliente = $1, nome = $2, marca = $3, modelo = $4, numero_serie = $5
                WHERE id_equipamento = $6`,
                [
                    equipamento.getIdCliente(),
                    equipamento.getNome(),
                    equipamento.getMarca(),
                    equipamento.getModelo(),
                    equipamento.getNumeroSerie(),
                    equipamento.getIdEquipamento()
                ]
            );

            return resultado.rowCount !== null && resultado.rowCount > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public static async excluir(id_equipamento: number): Promise<boolean> {
        try {
            const resultado = await database.pool.query(
                'DELETE FROM equipamentos WHERE id_equipamento = $1',
                [id_equipamento]
            );

            return resultado.rowCount !== null && resultado.rowCount > 0;

        } catch (error: any) {
            if (error.code === '23503') {
                throw new Error('EQUIPAMENTO_POSSUI_AGENDAMENTOS');
            }

            console.log(error);
            return false;
        }
    }
}

export default Equipamento;
