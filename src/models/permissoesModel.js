var database = require("../database/config");

function buscarCargos() {
  var instrucaoSql = `SELECT * FROM cargo;`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function buscarPermissoes(idCargo) {
  var instrucaoSql = `SELECT id_permissao FROM cargo 
	JOIN cargo_permissao ON cargo.id_cargo = cargo_permissao.fk_cargo
    JOIN permissao ON permissao.id_permissao = cargo_permissao.fk_permissao
    WHERE cargo.id_cargo = ${idCargo};`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function editarPermissoes(idCargo, permissoes) {
  if (permissoes.length == 0) {
    var instrucaoSql = `DELETE FROM cargo_permissao WHERE fk_cargo = ${idCargo};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
  } else {
    var instrucaoSql = `DELETE FROM cargo_permissao WHERE fk_cargo = ${idCargo};`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    database.executar(instrucaoSql);

    for (let i = 0; i < permissoes.length; i++) {
      if (i == permissoes.length - 1) {
        var instrucaoSql = `INSERT INTO cargo_permissao (fk_cargo, fk_permissao) VALUES (${idCargo}, ${permissoes[i]});`;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
      }

      var instrucaoSql = `INSERT INTO cargo_permissao (fk_cargo, fk_permissao) VALUES (${idCargo}, ${permissoes[i]});`;
      console.log("Executando a instrução SQL: \n" + instrucaoSql);
      database.executar(instrucaoSql);
    }
  }
}

function deletarCargo(idCargo) {
    var instrucaoSql = `
        DELETE FROM cargo_permissao WHERE fk_cargo = ${idCargo};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    database.executar(instrucaoSql);

    var instrucaoSql = `DELETE FROM cargo WHERE id_cargo = ${idCargo};`
    return database.executar(instrucaoSql);
}

async function adicionarCargo(nome, experiencia, permissoes) {

    var instrucaoSql = `
        INSERT INTO cargo (nome_cargo, nivel)
        VALUES ('${nome}', '${experiencia}');
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);

    var resultado = await database.executar(instrucaoSql);

    var idCargo = resultado.insertId;

    if(permissoes.length == 0){
        return resultado;
    }else{
        for (let i = 0; i < permissoes.length; i++) {
      if (i == permissoes.length - 1) {
        var instrucaoSql = `INSERT INTO cargo_permissao (fk_cargo, fk_permissao) VALUES (${idCargo}, ${permissoes[i]});`;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
      }

      var instrucaoSql = `INSERT INTO cargo_permissao (fk_cargo, fk_permissao) VALUES (${idCargo}, ${permissoes[i]});`;
      console.log("Executando a instrução SQL: \n" + instrucaoSql);
      database.executar(instrucaoSql);
    }
    }
}


module.exports = {
  buscarCargos,
  buscarPermissoes,
  editarPermissoes,
  deletarCargo,
  adicionarCargo
};
