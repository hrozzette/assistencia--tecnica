import { DatabaseModel } from './DatabaseModel.js';

const database = new DatabaseModel();

class Cliente {

    private id_cliente: number = 0;
    private nome: string;
    private cpf_criptografado: string;
    private telefone: string;
    private email: string;

    constructor(
        _nome: string,
        _cpf_criptografado: string,
        _telefone: string,
        _email: string
    ) {
        this.nome = _nome;
        this.cpf_criptografado = _cpf_criptografado;
        this.telefone = _telefone;
        this.email = _email;
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

    public getCpfCriptografado(): string {
        return this.cpf_criptografado;
    }

    public setCpfCriptografado(cpf_criptografado: string): void {
        this.cpf_criptografado = cpf_criptografado;
    }

    public getTelefone(): string {
        return this.telefone;
    }

    public setTelefone(telefone: string): void {
        this.telefone = telefone;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public static async listar(): Promise<any[]> {
        try {
            const resultado = await database.pool.query(
                'SELECT * FROM clientes ORDER BY nome'
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
                'SELECT * FROM clientes WHERE nome ILIKE $1 OR telefone ILIKE $1 OR email ILIKE $1 ORDER BY nome',
                [`%${termo}%`]
            );

            return resultado.rows;
        } catch (error) {
            console.log(error);
            return [];
        }
    }

    public static async cadastrar(cliente: Cliente): Promise<boolean> {
        try {
            await database.pool.query(
                'INSERT INTO clientes (nome, cpf_criptografado, telefone, email) VALUES ($1, $2, $3, $4)',
                [
                    cliente.getNome(),
                    cliente.getCpfCriptografado(),
                    cliente.getTelefone(),
                    cliente.getEmail()
                ]
            );

            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public static async editar(cliente: Cliente): Promise<boolean> {
        try {
            const resultado = await database.pool.query(
                'UPDATE clientes SET nome = $1, cpf_criptografado = $2, telefone = $3, email = $4 WHERE id_cliente = $5',
                [
                    cliente.getNome(),
                    cliente.getCpfCriptografado(),
                    cliente.getTelefone(),
                    cliente.getEmail(),
                    cliente.getIdCliente()
                ]
            );

            return resultado.rowCount !== null && resultado.rowCount > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public static async excluir(id_cliente: number): Promise<boolean> {
        try {
            const resultado = await database.pool.query(
                'DELETE FROM clientes WHERE id_cliente = $1',
                [id_cliente]
            );

            return resultado.rowCount !== null && resultado.rowCount > 0;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

export default Cliente;