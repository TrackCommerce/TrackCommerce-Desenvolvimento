-- MySQL Script
-- TrackCommerce
-- Modelagem Refatorada e Otimizada

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema TrackCommerce
-- -----------------------------------------------------
DROP DATABASE IF EXISTS `TrackCommerce`;
CREATE DATABASE IF NOT EXISTS `TrackCommerce`
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

USE `TrackCommerce`;

-- -----------------------------------------------------
-- Table `cargo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cargo`;

CREATE TABLE IF NOT EXISTS `cargo` (
  `id_cargo` INT NOT NULL AUTO_INCREMENT,
  `nome_cargo` VARCHAR(45) NOT NULL,
  `nivel` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_cargo`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `permissao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `permissao`;

CREATE TABLE IF NOT EXISTS `permissao` (
  `id_permissao` INT NOT NULL AUTO_INCREMENT,
  `nome_permissao` VARCHAR(60) NOT NULL,
  PRIMARY KEY (`id_permissao`),
  UNIQUE INDEX `uq_permissao_nome` (`nome_permissao`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `cargo_permissao`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cargo_permissao`;

CREATE TABLE IF NOT EXISTS `cargo_permissao` (
  `fk_cargo` INT NOT NULL,
  `fk_permissao` INT NOT NULL,
  PRIMARY KEY (`fk_cargo`, `fk_permissao`),
  CONSTRAINT `fk_cp_cargo`
    FOREIGN KEY (`fk_cargo`)
    REFERENCES `cargo` (`id_cargo`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_cp_permissao`
    FOREIGN KEY (`fk_permissao`)
    REFERENCES `permissao` (`id_permissao`)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_cp_permissao_idx` ON `cargo_permissao` (`fk_permissao` ASC);

-- -----------------------------------------------------
-- Table `endereco`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `endereco`;

CREATE TABLE IF NOT EXISTS `endereco` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `cep` CHAR(8) NOT NULL,
  `estado` CHAR(2) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `logradouro` VARCHAR(100) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,
  `complemento` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`id_endereco`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `empresa`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `empresa`;

CREATE TABLE IF NOT EXISTS `empresa` (
  `id_empresa` INT NOT NULL AUTO_INCREMENT,
  `razao_social` VARCHAR(100) NOT NULL,
  `cnpj` CHAR(14) NOT NULL,
  `token_instalacao` CHAR(64) NULL DEFAULT NULL,
  `fk_endereco` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id_empresa`),
  UNIQUE INDEX `uq_empresa_cnpj` (`cnpj` ASC),
  UNIQUE INDEX `uq_empresa_token_instalacao` (`token_instalacao` ASC),
  CONSTRAINT `fk_empresa_endereco`
    FOREIGN KEY (`fk_endereco`)
    REFERENCES `endereco` (`id_endereco`)
    ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_empresa_endereco_idx` ON `empresa` (`fk_endereco` ASC);

-- -----------------------------------------------------
-- Table `usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `usuario`;

CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `celular` CHAR(11) NULL DEFAULT NULL,
  `fk_empresa` INT NOT NULL,
  `fk_cargo` INT NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `uq_usuario_email` (`email` ASC),
  CONSTRAINT `fk_usuario_cargo`
    FOREIGN KEY (`fk_cargo`)
    REFERENCES `cargo` (`id_cargo`)
    ON DELETE RESTRICT,
  CONSTRAINT `fk_usuario_empresa`
    FOREIGN KEY (`fk_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_usuario_empresa_idx` ON `usuario` (`fk_empresa` ASC);
CREATE INDEX `fk_usuario_cargo_idx` ON `usuario` (`fk_cargo` ASC);

-- -----------------------------------------------------
-- Table `integracao` (Antiga `apijira`)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `integracao`;

CREATE TABLE IF NOT EXISTS `integracao` (
  `id_integracao` INT NOT NULL AUTO_INCREMENT,
  `fk_empresa` INT NOT NULL,
  `jira_url` VARCHAR(255) NULL DEFAULT NULL,
  `jira_email` VARCHAR(100) NULL DEFAULT NULL,
  `codigo_api` VARCHAR(500) NOT NULL,
  `jira_project_key` VARCHAR(50) NULL DEFAULT NULL,
  `slack_webhook` VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_integracao`),
  UNIQUE INDEX `uq_integracao_empresa` (`fk_empresa` ASC),
  CONSTRAINT `fk_integracao_empresa`
    FOREIGN KEY (`fk_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `instancia`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `instancia`;

CREATE TABLE IF NOT EXISTS `instancia` (
  `id_instancia` INT NOT NULL AUTO_INCREMENT,
  `fk_empresa` INT NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(200) NULL DEFAULT NULL,
  `identificador` VARCHAR(255) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (`id_instancia`),
  UNIQUE INDEX `uq_instancia_identificador` (`identificador` ASC),
  CONSTRAINT `fk_instancia_empresa`
    FOREIGN KEY (`fk_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_instancia_empresa_idx` ON `instancia` (`fk_empresa` ASC);

-- -----------------------------------------------------
-- Table `componente` (Catálogo unificado com padrões)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `componente`;

CREATE TABLE IF NOT EXISTS `componente` (
  `id_componente` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `metrica` VARCHAR(50) NOT NULL,
  `unidade_medida` VARCHAR(15) NOT NULL,
  `alerta_moderado_padrao` DECIMAL(10,2) NOT NULL,
  `alerta_critico_padrao` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id_componente`),
  UNIQUE INDEX `uq_componente_nome_metrica` (`nome`, `metrica`)
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- -----------------------------------------------------
-- Table `instancia_componente` (N:N com limites próprios)
-- -----------------------------------------------------
DROP TABLE IF EXISTS `instancia_componente`;

CREATE TABLE IF NOT EXISTS `instancia_componente` (
  `id_instancia_componente` INT NOT NULL AUTO_INCREMENT,
  `fk_instancia` INT NOT NULL,
  `fk_componente` INT NOT NULL,
  `alerta_moderado` DECIMAL(10,2) NOT NULL,
  `alerta_critico` DECIMAL(10,2) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,
  `dt_edicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_instancia_componente`),
  UNIQUE INDEX `uq_instancia_componente` (`fk_instancia`, `fk_componente`),
  CONSTRAINT `fk_ic_instancia`
    FOREIGN KEY (`fk_instancia`)
    REFERENCES `instancia` (`id_instancia`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_ic_componente`
    FOREIGN KEY (`fk_componente`)
    REFERENCES `componente` (`id_componente`)
    ON DELETE RESTRICT
) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_ic_instancia_idx` ON `instancia_componente` (`fk_instancia` ASC);
CREATE INDEX `fk_ic_componente_idx` ON `instancia_componente` (`fk_componente` ASC);

-- -----------------------------------------------------
-- Restore settings
-- -----------------------------------------------------
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;