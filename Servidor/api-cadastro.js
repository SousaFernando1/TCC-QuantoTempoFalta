//api-cadastro.js
var http = require('http'); 
const express = require('express');
const app = express();

const bodyParser = require('body-parser');

const db = require('./database.js')

app.use(require("cors")());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.json({message: "Tudo ok por aqui!"});
})





//Listar rotas
app.get('/rotas', async (req, res, next) => { 
    console.log(req.body)

    const resposta = await db.query(
        
      "SELECT * FROM rota;"
    ).catch((error) => {
        console.log(error)
        throw error
    })
    console.log(resposta.rows)



  res.status(200).send({
      message: "Rotas recuperadas",
      body: {
        rotas: resposta.rows
      },
      
  })

})
//Listar paradas
app.get('/paradas', async (req, res, next) => { 
  console.log(req.query)
  const {rota} = req.query;

  const resposta = await db.query(
    "SELECT * FROM rota_parada WHERE codigo_rota = $1;",
    [rota]
  ).catch((error) => {
      console.log(error)
  })

    res.status(200).send({
        message: "Paradas recuperadas",
        body: {
          paradas: resposta.rows
        },
        
    })

  console.log(resposta.rows)
})

//Listar motoristas
app.get('/motoristas', async (req, res, next) => { 
  console.log(req.body)

  const resposta = await db.query(
      
    "SELECT * FROM motorista;"
  ).catch((error) => {
      console.log(error)
  })
  console.log(resposta.rows)

  res.status(200).send({
    message: "Motoristas recuperados",
    body: {
      motoristas: resposta.rows
    },
    
})

})

app.get('/transportePerto', async (req, res, next) => { 
  console.log(req.query)
 const { latitude, longitude, rota } = req.query;
 console.log(latitude,longitude, rota)


const dados = await db.query(
  "SELECT 6371 * acos( cos( radians(($1)) )  * cos( radians( latitude ) )   * cos( radians( ($2) ) - radians(longitude) )   + sin( radians(($1)) ) * sin( radians( latitude ) ) )  AS distance, latitude, longitude, codigo   from motorista  where codigo_rota = ($3)   order by distance limit 1",
  [latitude, longitude, rota]
)
console.log('Dados:',dados.rows)


if(dados.rows.length !== 0)
{
   res.status(200).send({
              body: {
                transporte: dados.rows 
              }
})

} else {
  res.status(201).send({
    message: "Falha!",

})
}
 

})

app.get('/paradaPerto', async (req, res, next) => { 


  console.log(req.query)
 const { latitude, longitude, rota } = req.query;
 console.log(latitude,longitude, rota)


const dados = await db.query(
  "SELECT 6371 * acos( cos( radians(($1)) ) * cos( radians( latitude ) ) * cos( radians( ($2) ) - radians(longitude) ) + sin( radians(($1)) ) * sin( radians( latitude ) ) ) AS distance, latitude, longitude, codigo from parada, rota_parada where parada.codigo = rota_parada.codigo_parada and rota_parada.codigo_rota = ($3) order by distance limit 1",
  [latitude, longitude, rota]
)
console.log('Dados:',dados.rows)


if(dados.rows.length !== 0)
{
   res.status(200).send({
              body: {
                paradas: dados.rows 
              }
})

} else {
  res.status(201).send({
    message: "Falha!",

})
}
 

})

// Cadastrar Rotas
    app.post('/cadastrarRota', async (req, res, next) => { 
        const { rota } = req.body;

        const inserir = await db.query(
          'INSERT INTO rota(rota) VALUES ($1)',
          [rota]
        ).then(
          res.status(201).send({
              message: "Rota Cadastrada",
              body: {
                
              },
              
          })).catch((error) => {
          console.log(error)
      })
}) 

// Cadastrar Paradas
    app.post('/cadastrarParada', async (req, res, next) => { 
        const { latitude, longitude, rota } = req.body;

        const inserir = await db.query(
          'INSERT INTO parada(latitude, longitude, codigo_rota) VALUES ($1, $2, $3)',
          [latitude, longitude, rota]
        ).then(
          res.status(201).send({
              message: "Parada Cadastrada",
              body: {
                
              },
              
          })).catch((error) => {
          console.log(error)
      })
}) 

// Cadastrar Parada na rota
app.post('/cadastrarParadaNaRota', async (req, res, next) => { 
  const { rota, parada } = req.body;

  const inserir = await db.query(
    'INSERT INTO rota_parada(codigo_rota, codigo_parada) VALUES ($1, $2)',
    [rota, parada]
  ).then(
    res.status(201).send({
        message: "Parada Cadastrada na Rota",
        body: {
          
        },
        
    })).catch((error) => {
    console.log(error)
})
}) 

// Cadastrar Motorista
app.post('/cadastrarMotorista', async (req, res, next) => { 
  const { rota, latitude, longitude, login, senha, status  } = req.body;

  const inserir = await db.query(
    'INSERT INTO motorista(rota, latitude, longitude, login, senha, status) VALUES ($1, $2, $3, $4, $5, $6)',
    [rota, latitude, longitude, login, senha, status]
  ).then(
    res.status(201).send({
        message: "Parada Cadastrada na Rota",
        body: {
          
        },
        
    })).catch((error) => {
    console.log(error)
})
}) 



var server = http.createServer(app); 
server.listen(3031);
console.log("Servidor escutando na porta 3031...")