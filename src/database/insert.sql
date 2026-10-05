USE `TrackCommerce`;

-- -----------------------------------------------------
-- Inserção na Tabela endereco
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`endereco`
(`id_endereco`, `estado`, `cidade`, `bairro`, `logradouro`, `numero`) VALUES
(1, 'SP', 'Sao Paulo', 'Vila Olimpia', 'Rua Funchal', '418'),
(2, 'SP', 'Campinas', 'Cambui', 'Avenida Norte-Sul', '1200'),
(3, 'RJ', 'Rio de Janeiro', 'Botafogo', 'Rua Voluntarios da Patria', '89');


-- -----------------------------------------------------
-- Inserção na Tabela empresa
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`empresa`
(`id_empresa`, `razao_social`, `cnpj`, `fk_endereco`) VALUES
(1, 'LojaCerta Comercio Eletronico LTDA', '12345678000190', 1),
(2, 'Mercado Rapido E-commerce S.A.', '98765432000110', 2),
(3, 'BoraComprar Varejo Digital LTDA', '11222333000144', 3);


-- -----------------------------------------------------
-- Inserção na Tabela cargo
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`cargo`
(`id_cargo`, `nome_cargo`, `nivel`) VALUES
(1, 'Administrador', 'Alto'),
(2, 'Analista de Infraestrutura', 'Medio'),
(3, 'Suporte Tecnico', 'Baixo');


-- -----------------------------------------------------
-- Inserção na Tabela permissao
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`permissao`
(`id_permissao`, `nome_permissao`) VALUES
(1, 'gerenciar_usuarios'),
(2, 'gerenciar_instancias'),
(3, 'visualizar_dashboard'),
(4, 'visualizar_historico_alertas'),
(5, 'gerenciar_parametros_monitoramento');


-- -----------------------------------------------------
-- Inserção na Tabela cargo_permissao
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`cargo_permissao`
(`fk_cargo`, `fk_permissao`) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 2),
(2, 3),
(2, 4),
(2, 5),
(3, 3),
(3, 4);


-- -----------------------------------------------------
-- Inserção na Tabela usuario
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`usuario`
(`id_usuario`, `nome`, `email`, `senha`, `celular`, `fk_empresa`, `fk_cargo`) VALUES
(1, 'Bruno Alcantara', 'bruno.alcantara@lojacerta.com', 'senha123', '11991112222', 1, 1),
(2, 'Camila Duarte', 'camila.duarte@lojacerta.com', 'senha123', '11992223333', 1, 2),
(3, 'Diego Ferraz', 'diego.ferraz@mercadorapido.com', 'senha123', '19993334444', 2, 1),
(4, 'Fernanda Souza', 'fernanda.souza@mercadorapido.com', 'senha123', '19994445555', 2, 3),
(5, 'Gabriel Teixeira', 'gabriel.teixeira@boracomprar.com', 'senha123', '21995556666', 3, 1),
(6, 'Helena Vasconcelos', 'helena.vasconcelos@boracomprar.com', 'senha123', '21996667777', 3, 2);


INSERT INTO `TrackCommerce`.`usuario`
(`id_usuario`, `nome`, `email`, `senha`, `celular`, `fk_empresa`, `fk_cargo`) VALUES
(7, 'Bruno Alcantara', 'bruno.alcantara@loja.com', '2178706529846735', '11991112222', 1, 1);

-- -----------------------------------------------------
-- Inserção na Tabela instancia
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`instancia`
(`id_instancia`, `fk_empresa`, `nome`, `identificador`, `ativo`) VALUES
(1, 1, 'VM Producao Web', 'lojacerta-prod-web-01', 1),
(2, 1, 'VM Banco de Dados', 'lojacerta-prod-db-01', 1),
(3, 2, 'VM Producao Web', 'mercadorapido-prod-web-01', 1),
(4, 2, 'VM Cache/Redis', 'mercadorapido-prod-cache-01', 1),
(5, 3, 'VM Producao Web', 'boracomprar-prod-web-01', 1);


-- -----------------------------------------------------
-- Inserção na Tabela componente
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`componente`
(`id_componente`, `nome`, `dt_atribuicao`) VALUES
(1, 'CPU', NOW()),
(2, 'Memoria RAM', NOW()),
(3, 'Armazenamento', NOW()),
(4, 'Leitura de Disco', NOW()),
(5, 'Escrita de Disco', NOW()),
(6, 'Rede - Download', NOW()),
(7, 'Rede - Upload', NOW()),
(8, 'Latencia API Pagamento', NOW());


-- -----------------------------------------------------
-- Inserção na Tabela parametro
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`parametro`
(`id_parametro`, `nome`, `unidade_medida`, `dt_atribuicao`, `fk_componente`) VALUES
(1, 'Uso de Processador', '%', NOW(), 1),
(2, 'Consumo de Memoria', '%', NOW(), 2),
(3, 'Espaco em Disco', '%', NOW(), 3),
(4, 'Taxa de Leitura', 'MB/s', NOW(), 4),
(5, 'Taxa de Escrita', 'MB/s', NOW(), 5),
(6, 'Banda de Download', 'Mbps', NOW(), 6),
(7, 'Banda de Upload', 'Mbps', NOW(), 7),
(8, 'Tempo de Resposta', 'ms', NOW(), 8);


-- -----------------------------------------------------
-- Inserção na Tabela parametro_alerta
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`parametro_alerta`
(`id_parametro_alerta`, `alerta_moderado`, `alerta_critico`, `dt_edicao`, `fk_parametro`) VALUES
(1, 70.0, 85.0, NOW(), 1),
(2, 75.0, 90.0, NOW(), 2),
(3, 70.0, 80.0, NOW(), 3),
(4, 50.0, 100.0, NOW(), 4),
(5, 50.0, 100.0, NOW(), 5),
(6, 500.0, 1000.0, NOW(), 6),
(7, 500.0, 1000.0, NOW(), 7),
(8, 500.0, 1000.0, NOW(), 8);


-- -----------------------------------------------------
-- Inserção na Tabela componente_instancia
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`componente_instancia`
(`fk_instancia`, `fk_componente`, `fk_parametro_alerta`, `ativo`, `dt_edicao`) VALUES
(1, 1, 1, 1, NOW()),
(1, 2, 2, 1, NOW()),
(2, 3, 3, 1, NOW()),
(3, 1, 1, 1, NOW()),
(3, 8, 8, 1, NOW()),
(4, 2, 2, 1, NOW()),
(5, 1, 1, 1, NOW());


-- -----------------------------------------------------
-- Inserção na Tabela api_jira
-- -----------------------------------------------------

INSERT INTO `TrackCommerce`.`api_jira`
(`id_api_jira`, `codigo_api`, `fk_empresa`) VALUES
(1, 'JIRA-API-KEY-LOJACERTA-89213', 1),
(2, 'JIRA-API-KEY-MERCADORAPIDO-44123', 2),
(3, 'JIRA-API-KEY-BORACOMPRAR-77211', 3);


-- -----------------------------------------------------
-- Consultas para teste
-- -----------------------------------------------------

SELECT * FROM `endereco`;
SELECT * FROM `empresa`;
SELECT * FROM `cargo`;
SELECT * FROM `permissao`;
SELECT * FROM `cargo_permissao`;
SELECT * FROM `usuario`;
SELECT * FROM `instancia`;
SELECT * FROM `componente`;
SELECT * FROM `parametro`;
SELECT * FROM `parametro_alerta`;
SELECT * FROM `componente_instancia`;
SELECT * FROM `api_jira`;