var database = require("../database/config");

function buscarCargos() {
  var instrucaoSql = `SELECT id_cargo, nome_cargo, nivel FROM cargo;`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPermissoes(idCargo) {
  var instrucaoSql = `
    SELECT p.id_permissao, p.nome_permissao 
    FROM cargo c
    JOIN cargo_permissao cp ON c.id_cargo = cp.fk_cargo
    JOIN permissao p ON p.id_permissao = cp.fk_permissao
    WHERE c.id_cargo = ${idCargo};
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

async function editarPermissoes(idCargo, permissoes) {
  if (idCargo == 1) {
    return Promise.reject({ sqlMessage: "Não é permitido alterar as permissões do cargo de Administrador." });
  }

  var deleteSql = `DELETE FROM cargo_permissao WHERE fk_cargo = ${idCargo};`;
  console.log("Executando a instrução SQL: \n" + deleteSql);
  var resultado = await database.executar(deleteSql);

  if (permissoes && permissoes.length > 0) {
    for (let i = 0; i < permissoes.length; i++) {
      var insertSql = `INSERT INTO cargo_permissao (fk_cargo, fk_permissao) VALUES (${idCargo}, ${permissoes[i]});`;
      console.log("Executando a instrução SQL: \n" + insertSql);
      resultado = await database.executar(insertSql);
    }
  }

  return resultado;
}

async function deletarCargo(idCargo) {
  if (idCargo == 1) {
    return Promise.reject({ sqlMessage: "Não é permitido excluir o cargo de Administrador." });
  }

  var deleteCpSql = `DELETE FROM cargo_permissao WHERE fk_cargo = ${idCargo};`;
  console.log("Executando a instrução SQL: \n" + deleteCpSql);
  await database.executar(deleteCpSql);

  var deleteUsuarioSql = `DELETE FROM usuario WHERE fk_cargo = ${idCargo};`;
  console.log("Executando a instrução SQL: \n" + deleteUsuarioSql);
  await database.executar(deleteUsuarioSql);

  var deleteCargoSql = `DELETE FROM cargo WHERE id_cargo = ${idCargo};`;
  console.log("Executando a instrução SQL: \n" + deleteCargoSql);
  return await database.executar(deleteCargoSql);
}

async function adicionarCargo(nome, experiencia, permissoes) {
  var instrucaoSql = `
    INSERT INTO cargo (nome_cargo, nivel)
    VALUES ('${nome}', '${experiencia}');
  `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  var resultado = await database.executar(instrucaoSql);
  var idCargo = resultado.insertId;

  if (permissoes && permissoes.length > 0) {
    for (let i = 0; i < permissoes.length; i++) {
      var insertCpSql = `INSERT INTO cargo_permissao (fk_cargo, fk_permissao) VALUES (${idCargo}, ${permissoes[i]});`;
      console.log("Executando a instrução SQL: \n" + insertCpSql);
      await database.executar(insertCpSql);
    }
  }

  return resultado;
}


function buscarPermissoesUsuario(idUsuario) {
  var instrucaoSql = `
    SELECT 
        cp.fk_cargo,
        c.nome_cargo,
        cp.fk_permissao,
        p.nome_permissao
    FROM cargo_permissao cp
    JOIN cargo c ON cp.fk_cargo = c.id_cargo
    JOIN permissao p ON cp.fk_permissao = p.id_permissao
    WHERE cp.fk_cargo = (
        SELECT fk_cargo FROM usuario WHERE id_usuario = ${idUsuario} LIMIT 1
    ) OR cp.fk_cargo = ${idUsuario};
  `;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  buscarCargos,
  buscarPermissoes,
  buscarPermissoesUsuario,
  editarPermissoes,
  deletarCargo,
  adicionarCargo
};
