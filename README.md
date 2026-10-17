# TrackCommerce-Desenvolvimento

## Cadastro automático de máquinas

Na página `cadastro-instancia.html`, o gestor pode baixar um agente Python já
associado à sua empresa. Ao executar o arquivo na máquina monitorada, o agente:

1. obtém um identificador estável do equipamento;
2. chama `POST /agente/ativar` usando o token de instalação no cabeçalho
   `Authorization`;
3. cadastra a máquina, ou reativa o cadastro existente sem duplicá-lo;
4. inicia a captura local das métricas.

O cadastro manual anterior continua disponível na mesma página.

### Preparação do banco

Em bancos existentes, execute uma vez:

```sql
SOURCE src/database/migrations/20261014_adicionar_token_instalacao.sql;
```

O script completo `src/database/Script_BD_V3.sql` já contém a nova coluna e o
índice único. O token é criado no primeiro download do agente e não é enviado em
URLs nem armazenado no navegador.

### Configuração da API

Defina `AGENT_API_URL` com a URL pública da aplicação, por exemplo:

```dotenv
AGENT_API_URL=https://api.trackcommerce.example
```

Sem essa variável, o download usa o protocolo e o host da própria requisição.
Na máquina monitorada, instale as dependências antes de executar o arquivo:

```bash
pip install psutil python-dotenv boto3
python trackcommerce-agente.py
```

As configurações de envio ao S3 continuam opcionais e podem ser informadas no
arquivo `.env` ao lado do agente (`AWS_ENVIAR`, `AWS_BUCKET`, `AWS_REGION`,
`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` e `AWS_SESSION_TOKEN`).
