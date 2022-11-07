const { Pool } = require('pg');

// ==> Conexão com a Base de Dados:

/* console.log(process.env) */

const pool = new Pool({
  connectionString: "postgres://postgres:sousa@localhost:5432/TCC"

});

pool.on('connect', () => {
  console.log('Base de Dados conectado com sucesso!');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
