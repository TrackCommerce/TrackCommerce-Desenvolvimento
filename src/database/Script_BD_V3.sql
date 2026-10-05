-- MySQL Script
-- TrackCommerce
-- Tabelas padronizadas em letras minúsculas

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
)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `permissao`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `permissao`;

CREATE TABLE IF NOT EXISTS `permissao` (
  `id_permissao` INT NOT NULL AUTO_INCREMENT,
  `nome_permissao` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_permissao`)
)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


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
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_cp_permissao`
ON `cargo_permissao` (`fk_permissao` ASC);


-- -----------------------------------------------------
-- Table `componentes`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `componentes`;

CREATE TABLE IF NOT EXISTS `componentes` (
  `id_componente` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `dt_atribuicao` DATETIME NOT NULL,

  PRIMARY KEY (`id_componente`)
)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `endereco`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `endereco`;

CREATE TABLE IF NOT EXISTS `endereco` (
  `id_endereco` INT NOT NULL AUTO_INCREMENT,
  `estado` CHAR(2) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `logradouro` VARCHAR(100) NOT NULL,
  `numero` VARCHAR(10) NOT NULL,

  PRIMARY KEY (`id_endereco`)
)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `empresa`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `empresa`;

CREATE TABLE IF NOT EXISTS `empresa` (
  `id_empresa` INT NOT NULL AUTO_INCREMENT,
  `razao_social` VARCHAR(100) NOT NULL,
  `cnpj` CHAR(14) NOT NULL,
  `fk_endereco` INT NULL DEFAULT NULL,

  PRIMARY KEY (`id_empresa`),

  CONSTRAINT `fk_empresa_endereco`
    FOREIGN KEY (`fk_endereco`)
    REFERENCES `endereco` (`id_endereco`)
    ON DELETE SET NULL
)
ENGINE = InnoDB
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `uq_empresa_cnpj`
ON `empresa` (`cnpj` ASC);

CREATE INDEX `fk_empresa_endereco`
ON `empresa` (`fk_endereco` ASC);


-- -----------------------------------------------------
-- Table `instancias`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `instancias`;

CREATE TABLE IF NOT EXISTS `instancias` (
  `id_instancia` INT NOT NULL AUTO_INCREMENT,
  `fk_empresa` INT NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `descricao` VARCHAR(200),
  `identificador` VARCHAR(500) NOT NULL,
  `ativo` TINYINT NOT NULL DEFAULT 1,

  PRIMARY KEY (`id_instancia`),

  CONSTRAINT `fk_instancia_empresa`
    FOREIGN KEY (`fk_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
)
ENGINE = InnoDB
AUTO_INCREMENT = 6
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `uq_instancia_identificador`
ON `instancias` (`identificador` ASC);

CREATE INDEX `fk_instancia_empresa`
ON `instancias` (`fk_empresa` ASC);


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

  CONSTRAINT `fk_usuario_cargo`
    FOREIGN KEY (`fk_cargo`)
    REFERENCES `cargo` (`id_cargo`)
    ON DELETE RESTRICT,

  CONSTRAINT `fk_usuario_empresa`
    FOREIGN KEY (`fk_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE RESTRICT
)
ENGINE = InnoDB
AUTO_INCREMENT = 7
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE UNIQUE INDEX `uq_usuario_email`
ON `usuario` (`email` ASC);

CREATE INDEX `fk_usuario_empresa`
ON `usuario` (`fk_empresa` ASC);

CREATE INDEX `fk_usuario_cargo`
ON `usuario` (`fk_cargo` ASC);


-- -----------------------------------------------------
-- Table `parametros`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `parametros`;

CREATE TABLE IF NOT EXISTS `parametros` (
  `id_parametro` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `unidade_medida` VARCHAR(15) NOT NULL,
  `dt_atribuicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Componentes_id_componente` INT NOT NULL,

  PRIMARY KEY (`id_parametro`),

  CONSTRAINT `fk_parametros_componentes`
    FOREIGN KEY (`Componentes_id_componente`)
    REFERENCES `componentes` (`id_componente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_parametros_componentes_idx`
ON `parametros` (`Componentes_id_componente` ASC);


-- -----------------------------------------------------
-- Table `parametros_alertas`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `parametros_alertas`;

CREATE TABLE IF NOT EXISTS `parametros_alertas` (
  `id_parametro_alerta` INT NOT NULL AUTO_INCREMENT,
  `alerta_moderado` DOUBLE NOT NULL,
  `alerta_critico` DOUBLE NOT NULL,
  `dt_edicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fk_parametro` INT NOT NULL,

  PRIMARY KEY (`id_parametro_alerta`),

  CONSTRAINT `fk_parametros_alertas_parametros`
    FOREIGN KEY (`fk_parametro`)
    REFERENCES `parametros` (`id_parametro`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
AUTO_INCREMENT = 9
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_parametros_alertas_parametros_idx`
ON `parametros_alertas` (`fk_parametro` ASC);


-- -----------------------------------------------------
-- Table `instancias_componentes`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `instancias_componentes`;

CREATE TABLE IF NOT EXISTS `instancias_componentes` (
  `id_instancia_componente` INT NOT NULL,
  `fk_instancia` INT NOT NULL,
  `fk_componentes` INT NOT NULL,
  `fk_parametros_alertas` INT NOT NULL,
  `Status` TINYINT NOT NULL DEFAULT 1,
  `dt_edicao` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (
    `id_instancia_componente`,
    `fk_instancia`,
    `fk_componentes`,
    `fk_parametros_alertas`
  ),

  CONSTRAINT `fk_instancias_componentes_instancias`
    FOREIGN KEY (`fk_instancia`)
    REFERENCES `instancias` (`id_instancia`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

  CONSTRAINT `fk_instancias_componentes_componentes`
    FOREIGN KEY (`fk_componentes`)
    REFERENCES `componentes` (`id_componente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,

  CONSTRAINT `fk_instancias_componentes_parametros_alertas`
    FOREIGN KEY (`fk_parametros_alertas`)
    REFERENCES `parametros_alertas` (`id_parametro_alerta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_instancias_componentes_componentes_idx`
ON `instancias_componentes` (`fk_componentes` ASC);

CREATE INDEX `fk_instancias_componentes_instancias_idx`
ON `instancias_componentes` (`fk_instancia` ASC);

CREATE INDEX `fk_instancias_componentes_parametros_alertas_idx`
ON `instancias_componentes` (`fk_parametros_alertas` ASC);


-- -----------------------------------------------------
-- Table `apijira`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `apijira`;

CREATE TABLE IF NOT EXISTS `apijira` (
  `id_api_jira` INT NOT NULL,
  `codigo_api` VARCHAR(500) NOT NULL,
  `fk_empresa` INT NOT NULL,

  PRIMARY KEY (`id_api_jira`),

  CONSTRAINT `fk_apijira_empresa`
    FOREIGN KEY (`fk_empresa`)
    REFERENCES `empresa` (`id_empresa`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE INDEX `fk_apijira_empresa_idx`
ON `apijira` (`fk_empresa` ASC);


-- -----------------------------------------------------
-- Restore settings
-- -----------------------------------------------------

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;