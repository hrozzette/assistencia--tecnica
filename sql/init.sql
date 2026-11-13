CREATE TABLE usuarios (
    id_usuario INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    senha_hash VARCHAR(255) NOT NULL
);

CREATE TABLE clientes (
    id_cliente INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf_criptografado VARCHAR(255) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100)
);

CREATE TABLE equipamentos (
    id_equipamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    nome VARCHAR(100) NOT NULL,
    marca VARCHAR(50),
    modelo VARCHAR(50),
    numero_serie VARCHAR(50),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE agendamentos (
    id_agendamento INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    id_equipamento INTEGER NOT NULL,
    data_agendamento TIMESTAMP NOT NULL,
    FOREIGN KEY (id_equipamento) REFERENCES equipamentos(id_equipamento)
);


INSERT INTO usuarios (nome, email, senha_hash) VALUES
('Ana Costa', 'ana.costa@email.com', 'HASH_NOVO_1'),
('Lucas Mendes', 'lucas.mendes@email.com', 'HASH_NOVO_2'),
('Beatriz Lima', 'beatriz.lima@email.com', 'HASH_NOVO_3');


INSERT INTO clientes (nome, cpf_criptografado, telefone, email) VALUES
('Gabriel Souza', 'CPF_NOVO_001', '16988880001', 'gabriel@email.com'),
('Juliana Ferreira', 'CPF_NOVO_002', '16988880002', 'juliana@email.com'),
('Rafael Almeida', 'CPF_NOVO_003', '16988880003', 'rafael@email.com');


INSERT INTO equipamentos (id_cliente, nome, marca, modelo, numero_serie) VALUES
(1, 'Impressora', 'HP', 'DeskJet 2774', 'HP001'),
(2, 'Tablet', 'Apple', 'iPad 10', 'APPLE002'),
(3, 'Notebook', 'Acer', 'Aspire 5', 'ACER003');


INSERT INTO agendamentos (id_equipamento, data_agendamento) VALUES
(1, '2026-11-15 08:30:00'),
(2, '2026-11-16 11:00:00'),
(3, '2026-11-17 15:30:00');


UPDATE usuarios
SET senha_hash = '$2b$10$9UiQzFw8lpwskfzzTCIJ6Oz0qBaW/THhVe1sUDzWsC0rkQlhFsguC'
WHERE email = 'ana.costa@email.com';


SELECT
    c.id_cliente,
    c.nome,
    e.id_equipamento,
    e.nome AS equipamento
FROM clientes c
LEFT JOIN equipamentos e
ON c.id_cliente = e.id_cliente
ORDER BY c.id_cliente;