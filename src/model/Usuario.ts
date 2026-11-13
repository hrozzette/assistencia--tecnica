import { DatabaseModel } from './DatabaseModel.js';

const database = new DatabaseModel();

class Usuario {

    private id_usuario: number = 0;
    private nome: string;
    private email: string;
    private senha_hash: string;

    constructor(
        _nome: string,
        _email: string,
        _senha_hash: string
    ) {
        this.nome = _nome;
        this.email = _email;
        this.senha_hash = _senha_hash;
    }

    public getIdUsuario(): number {
        return this.id_usuario;
    }

    public setIdUsuario(id_usuario: number): void {
        this.id_usuario = id_usuario;
    }

    public getNome(): string {
        return this.nome;
    }

    public setNome(nome: string): void {
        this.nome = nome;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string): void {
        this.email = email;
    }

    public getSenhaHash(): string {
        return this.senha_hash;
    }

    public setSenhaHash(senha_hash: string): void {
        this.senha_hash = senha_hash;
    }

    public static async buscarPorEmail(email: string): Promise<any | null> {
        try {
            const resultado = await database.pool.query(
                'SELECT * FROM usuarios WHERE email = $1',
                [email]
            );

            return resultado.rows[0] || null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}

export default Usuario;