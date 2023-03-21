import inquirer from "inquirer";
import chalk from "chalk";

import fs from "fs";

operation();

function operation() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "action",
        message: "O que você deseja fazer?",
        choices: [
          "Criar Conta",
          "Consultar Saldo",
          "Depositar",
          "Sacar",
          "Sair",
        ],
      },
    ])
    .then((answer) => {
      const action = answer["action"];

      switch (action) {
        case "Criar Conta":
          createAccount();
          break;
        case "Consultar Saldo":
          console.log("caca");
          break;
        case "Depositar":
          console.log("caca");
          break;
        case "Sacar":
          console.log("caca");
          break;
        case "Sair":
          exit();
          break;
        default:
      }
      // if (action === "Criar Conta") {
      //   createAccount();
      // }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  console.log(chalk.bgGreen.black("Parabens por escolher nosso banco 😍"));
  console.log(chalk.green("Defina as opções da sua conta "));

  buildAccount();
}

function exit() {
  console.log(chalk.bgBlue.black("Obrigado por escolher nosso banco"));
  process.exit();
}

function buildAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para sua conta!",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black(`A conta ${accountName}, ja exite!`));
        buildAccount();
        return;
      }

      fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}');
      console.log(
        chalk.green(
          `Parabéns ${chalk.bgBlue(
            accountName.slice(0)
          )}, sua conta foi criada!`
        )
      );
      operation();
    })
    .catch((err) => console.log(err));
}
