USE `TrackCommerce`;

-- -----------------------------------------------------
-- Inserções: endereco
-- -----------------------------------------------------
INSERT INTO `endereco` (`id_endereco`, `cep`, `estado`, `cidade`, `bairro`, `logradouro`, `numero`, `complemento`) VALUES
(1, '04551060', 'SP', 'Sao Paulo', 'Vila Olimpia', 'Rua Funchal', '418', '12 Andar'),
(2, '13025320', 'SP', 'Campinas', 'Cambui', 'Avenida Norte-Sul', '1200', NULL),
(3, '22270000', 'RJ', 'Rio de Janeiro', 'Botafogo', 'Rua Voluntarios da Patria', '89', 'Sala 302');

-- -----------------------------------------------------
-- Inserções: empresa (TrackCommerce = ID 1)
-- -----------------------------------------------------
INSERT INTO `empresa` (`id_empresa`, `razao_social`, `cnpj`, `fk_endereco`) VALUES
(1, 'TrackCommerce', '00000000000000', NULL),
(2, 'LojaCerta Comercio Eletronico LTDA', '12345678000190', 1),
(3, 'Mercado Rapido E-commerce S.A.', '98765432000110', 2),
(4, 'BoraComprar Varejo Digital LTDA', '11222333000144', 3);

-- -----------------------------------------------------
-- Inserções: cargo
-- -----------------------------------------------------
INSERT INTO `cargo` (`id_cargo`, `nome_cargo`, `nivel`) VALUES
(1, 'Administrador', 'Alto'),
(2, 'Analista de Infraestrutura', 'Medio'),
(3, 'Suporte Tecnico', 'Baixo');

-- -----------------------------------------------------
-- Inserções: permissao (Alinhadas ao frontend e sidebar)
-- -----------------------------------------------------
INSERT INTO `permissao` (`id_permissao`, `nome_permissao`) VALUES
(1, 'visualizar_dashboard'),
(2, 'editar_servidores'),
(3, 'cadastrar_servidores');

-- -----------------------------------------------------
-- Inserções: cargo_permissao
-- -----------------------------------------------------
INSERT INTO `cargo_permissao` (`fk_cargo`, `fk_permissao`) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2),
(3, 1);

-- -----------------------------------------------------
-- Inserções: usuario
-- -----------------------------------------------------
INSERT INTO `usuario` (`id_usuario`, `nome`, `email`, `senha`, `celular`, `fk_empresa`, `fk_cargo`) VALUES
(1, 'Dev TrackCommerce', 'dev@trackcommerce.com', 'senha123', NULL, 1, 1),
(2, 'Bruno Alcantara', 'bruno.alcantara@lojacerta.com', 'senha123', '11991112222', 2, 1),
(3, 'Camila Duarte', 'camila.duarte@lojacerta.com', 'senha123', '11992223333', 2, 2),
(4, 'Diego Ferraz', 'diego.ferraz@mercadorapido.com', 'senha123', '19993334444', 3, 1),
(5, 'Fernanda Souza', 'fernanda.souza@mercadorapido.com', 'senha123', '19994445555', 3, 3),
(6, 'Gabriel Teixeira', 'gabriel.teixeira@boracomprar.com', 'senha123', '21995556666', 4, 1),
(7, 'Helena Vasconcelos', 'helena.vasconcelos@boracomprar.com', 'senha123', '21996667777', 4, 2);

-- -----------------------------------------------------
-- Inserções: integracao (Antiga apijira)
-- -----------------------------------------------------
INSERT INTO `integracao` (`id_integracao`, `codigo_api`, `fk_empresa`) VALUES
(1, 'JIRA-API-KEY-LOJACERTA-89213', 2),
(2, 'JIRA-API-KEY-MERCADORAPIDO-44123', 3),
(3, 'JIRA-API-KEY-BORACOMPRAR-77211', 4);

-- -----------------------------------------------------
-- Inserções: instancia
-- -----------------------------------------------------
INSERT INTO `instancia` (`id_instancia`, `fk_empresa`, `nome`, `identificador`, `ativo`) VALUES
(1, 2, 'VM Producao Web', 'ef7050f0-9d76-49ff-ae93-a7b5581ff629', 1),
(2, 2, 'VM Banco de Dados', 'lojacerta-prod-db-01', 1),
(3, 3, 'VM Producao Web', 'mercadorapido-prod-web-01', 1),
(4, 3, 'VM Cache/Redis', 'mercadorapido-prod-cache-01', 1),
(5, 4, 'VM Producao Web', 'boracomprar-prod-web-01', 1);

-- -----------------------------------------------------
-- Inserções: componente (9 métricas alinhadas ao frontend)
-- -----------------------------------------------------
INSERT INTO `componente` (`id_componente`, `nome`, `metrica`, `unidade_medida`, `alerta_moderado_padrao`, `alerta_critico_padrao`) VALUES
(1, 'CPU', 'Porcentagem de Uso', '%', 70.00, 85.00),
(2, 'CPU', 'Frequencia', 'GHz', 3.00, 4.00),
(3, 'Armazenamento', 'Porcentagem de Uso', '%', 70.00, 85.00),
(4, 'Armazenamento', 'Espaco Livre', 'GB', 50.00, 20.00),
(5, 'Memoria RAM', 'Porcentagem de Uso', '%', 75.00, 90.00),
(6, 'Memoria RAM', 'Memoria Livre', 'GB', 2.00, 1.00),
(7, 'Rede', 'Latencia', 'ms', 100.00, 250.00),
(8, 'Rede', 'Download', 'Mbps', 500.00, 1000.00),
(9, 'Rede', 'Upload', 'Mbps', 500.00, 1000.00);

-- -----------------------------------------------------
-- Inserções: instancia_componente (N:N com limites individuais)
-- -----------------------------------------------------
INSERT INTO `instancia_componente` (`fk_instancia`, `fk_componente`, `alerta_moderado`, `alerta_critico`, `ativo`) VALUES
(1, 1, 70.00, 85.00, 1),
(1, 5, 75.00, 90.00, 1),
(2, 3, 70.00, 85.00, 1),
(3, 1, 70.00, 85.00, 1),
(3, 7, 100.00, 250.00, 1),
(4, 5, 75.00, 90.00, 1),
(5, 1, 70.00, 85.00, 1);

-- -----------------------------------------------------
-- Consulta de Verificação Otimizada
-- -----------------------------------------------------
SELECT ic.id_instancia_componente,
       e.id_empresa,
       e.razao_social AS empresa_nome,
       i.nome AS instancia,
       i.identificador,
       c.nome AS componente,
       c.metrica,
       c.unidade_medida,
       ic.alerta_moderado,
       ic.alerta_critico,
       ig.jira_url,
       ig.jira_email,
       ig.codigo_api,
       ig.jira_project_key,
       ig.slack_webhook
FROM instancia_componente ic
JOIN instancia i        ON i.id_instancia = ic.fk_instancia
JOIN empresa e          ON e.id_empresa = i.fk_empresa
JOIN componente c       ON c.id_componente = ic.fk_componente
LEFT JOIN integracao ig ON ig.fk_empresa = e.id_empresa
WHERE ic.ativo = 1
  AND i.ativo = 1;