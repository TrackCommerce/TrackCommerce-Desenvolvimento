
//  var ambiente_processo = 'producao';
var ambiente_processo = 'desenvolvimento';

//var ambiente_processo = 'producao';

// var ambiente_processo = 'desenvolvimento';

//var ambiente_processo = 'desenvolvimento';



var caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';
// Acima, temos o uso do operador ternário para definir o caminho do arquivo .env
// A sintaxe do operador ternário é: condição ? valor_se_verdadeiro : valor_se_falso

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
    region: process.env.AWS_REGION
});
var PORTA_APP = process.env.APP_PORT;
var HOST_APP = process.env.APP_HOST;

var app = express();

var cargoRouter = require("./src/routes/cargo");
var permissoesRouter = require("./src/routes/permissoes")
var usuariosRouter = require("./src/routes/usuario")
var instanciaRouter = require("./src/routes/instancia");
var agenteRouter = require("./src/routes/agente");
let cadastrarInstanciaRouter = require("./src/routes/cadastro-instancia");
let buscarInstancia = require("./src/routes/lista-instancia")
var gestorRouter = require("./src/routes/gestor");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/permissoes", permissoesRouter)
app.use("/usuario", usuariosRouter)
app.use("/instancia", instanciaRouter);
app.use("/agente", agenteRouter);
app.use("/cadastrarInstancia", cadastrarInstanciaRouter);
app.use("/listarInstancias", buscarInstancia);
app.use("/cargo", cargoRouter);
app.use("/gestor", gestorRouter);
app.use("/gestores", gestorRouter);

app.get("/api/dashboard/local", async (req, res) => {
    try {
        const identificador = req.query.identificador;

        if (!identificador ||
            !/^[a-f0-9]{8}(?:[-_][a-f0-9]{4}){3}[-_][a-f0-9]{12}$/i.test(identificador)) {
            return res.status(400).json({
                erro: "Identificador inválido"
            });
        }

        const nomeArquivo =
            `${identificador.replace(/-/g, "_")}_metricas.json`;

        const prefixo = (
            process.env.AWS_GOLD_PREFIX || "track-commerce/gold"
        ).replace(/^\/+|\/+$/g, "");

        const resposta = await s3.send(
            new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET,
                Key: `${prefixo}/${nomeArquivo}`
            })
        );

        const conteudo = await resposta.Body.transformToString();

        return res.json(JSON.parse(conteudo));

    } catch (erro) {
        console.error("Erro ao consultar Gold:", erro);

        return res.status(500).json({
            erro: "Erro ao buscar dados do S3"
        });
    }
});

//app.get("/api/dashboard/local", (req, res) => {
   // const arquivo = path.join(
        //__dirname,
        //"dados-locais",
      //  "dashboard-local.json"
    //);

  //  res.sendFile(arquivo);
//});


app.listen(PORTA_APP, function () {
    console.log(`
########  #####     ##      ######  ##   ##   ####    ######   ##   ##  ##   ##  ######  #####    ######  ######
   ##     ##  ##   ####    ##       ##  ##   ##  ##   ##  ##  ### ###  ### ###  ##      ##  ##  ##      ##
   ##     ##  ##  ##  ##   ##       ## ##   ##        ##  ##  #######  #######  ##      #####   ##      ##
   ##     #####   ######   ##       ####    ##        ##  ##  ## # ##  ## # ##  #####   ##  ##  ##      #####
   ##     ## ##   ##  ##   ##       ## ##   ##        ##  ##  ##   ##  ##   ##  ##      ##  ##  ##      ##
   ##     ##  ##  ##  ##   ##       ##  ##   ##  ##   ##  ##  ##   ##  ##   ##  ##      ##  ##  ##      ##
   ##     ##  ##  ##  ##    ######  ##   ##   ####    ######  ##   ##  ##   ##  ######  ##  ##   ######  ######
    \n\n\n                                                                                                 
    Servidor do seu site já está rodando! Acesse o caminho a seguir para visualizar .: http://${HOST_APP}:${PORTA_APP} :. \n\n
    Você está rodando sua aplicação em ambiente de .:${process.env.AMBIENTE_PROCESSO}:. \n\n
    \tSe .:desenvolvimento:. você está se conectando ao banco local. \n
    \tSe .:producao:. você está se conectando ao banco remoto. \n\n
    \t\tPara alterar o ambiente, comente ou descomente as linhas 1 ou 2 no arquivo 'app.js'\n\n`);
});
