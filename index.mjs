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
          getAmountAccount();
          break;
        case "Depositar":
          deposit();
          break;
        case "Sacar":
          withDraw();
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
  console.clear();
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite um nome para sua conta!",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!accountName) {
        console.log(chalk.bgRed.black("Ocorreu um erro, tente mais tarde!"));
        operation();
        return;
      }
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

function deposit() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Digite o nome da sua conta",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!chechAccount(accountName)) {
        return deposit();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Qual o valor que deseja depositar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          addAmount(accountName, amount);

          operation();
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
}

function chechAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(chalk.bgRed.black("Esta conta não existe"));
    return false;
  }
  return true;
}

function addAmount(accountName, amount) {
  const account = getAccount(accountName);

  if (!amount) {
    console.log("Ocorreu um erro");
    return deposit();
  }

  account.balance = parseFloat(amount) + parseFloat(account.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(account),
    (err) => {
      console.log(err);
    }
  );

  console.log(chalk.bgGreen.black(`Foi depositado o valor de R$${amount} em sua conta`))
}

function getAccount(accountName) {
  const accountJSON = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf-8",
    flag: "r",
  });
  return JSON.parse(accountJSON);
}

function getAmountAccount() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome da sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];
      if (!chechAccount(accountName)) {
        return getAmountAccount();
      }

      const accountData = getAccount(accountName);

      console.log(
        chalk.bgBlue.black(
          `Olá ${accountName}, o saldo na sua conta é de R$${accountData.balance}`
        )
      );

      operation();
    })
    .catch((err) => {
      console.log(err);
    });
}

function withDraw() {
  inquirer
    .prompt([
      {
        name: "accountName",
        message: "Qual o nome de sua conta?",
      },
    ])
    .then((answer) => {
      const accountName = answer["accountName"];

      if (!chechAccount(accountName)) {
        return withDraw();
      }

      inquirer
        .prompt([
          {
            name: "amount",
            message: "Qual o valor deseja sacar?",
          },
        ])
        .then((answer) => {
          const amount = answer["amount"];

          removeAmountAccount(accountName, amount);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
}

function removeAmountAccount(accountName, amount) {
  const accountData = getAccount(accountName);
  if (!amount) {
    console.log(chalk.bgRed.black("Ocorreu um erro, tente mais tarde!"));
    return withDraw();
  }

  if (accountData.balance < amount) {
    console.log(chalk.bgRed.black("Valor indisponivel na sua conta, Digite outro valor"));
    return withDraw();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.log(err)
  );
  console.log(chalk.bgGreen.black(`Saque de R$${amount} realizado com sucesso`))
  return operation();
}
