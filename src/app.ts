import express from 'express';
import { DatabaseModel } from './model/DatabaseModel.js';
import router from './routes.js';

const server = express();
const port = 3333;

server.use(express.json());
server.use('/api', router);

new DatabaseModel().testeConexao().then((resbd: boolean) => {
    if (resbd) {
        server.listen(port, () => {
            console.log(`Servidor rodando em http://localhost:${port}`);
        });
    } else {
        console.log('Não foi possível conectar ao banco de dados');
    }
});