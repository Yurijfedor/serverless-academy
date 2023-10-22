const { readFileSync, writeFileSync } = require("fs");
const inquirer = require("inquirer");

const dbFile = "db.txt";
let db = [];

const saveDb = () => {
  writeFileSync(dbFile, JSON.stringify(db), "utf8");
};

const loadDb = () => {
  try {
    const data = readFileSync(dbFile, "utf8");
    db = JSON.parse(data);
  } catch (error) {
    console.log(error);
  }
};

const questenAddUser = [
  {
    type: "input",
    name: "name",
    message: "Enter a username or press Enter to cancel:",
  },
  {
    type: "list",
    name: "gender",
    message: "Select the gender of the user:",
    choices: ["male", "female"],
    when: (answers) => answers.name.trim() !== "",
  },
  {
    type: "input",
    name: "age",
    message: "Enter the user's age:",
    validate: (input) => {
      const age = parseInt(input);
      return !isNaN(age) && age > 0 ? true : "Please enter the correct age";
    },
    when: (answers) => answers.name.trim() !== "",
  },
];

const questenFindUser = [
  {
    type: "confirm",
    name: "continue",
    message: "Continue searching for users?",
    default: true,
  },
];

const questenSearchName = [
  {
    type: "input",
    name: "searchName",
    message: "Enter the name of the user you want to find in the database:",
    validate: (input) => {
      return input === "" ? "Please enter a valid name" : true;
    },
  },
];

const addUser = () => {
  inquirer.prompt(questenAddUser).then((answers) => {
    if (answers.name.trim() !== "") {
      db.push(answers);
      saveDb();
      console.log("The user is added to the database.");
      addUser();
    } else {
      findUser();
    }
  });
};

function findUser() {
  inquirer.prompt(questenFindUser).then((answers) => {
    if (answers.continue) {
      inquirer.prompt(questenSearchName).then((answers) => {
        const searchName = answers.searchName.trim().toLowerCase();
        const foundUsers = db.filter((user) =>
          user.name.toLowerCase().includes(searchName)
        );

        if (foundUsers.length > 0) {
          console.log("Found users:");
          foundUsers.forEach((user) => {
            console.log(
              `Name: ${user.name}, Gender: ${user.gender}, Age: ${user.age}`
            );
          });
        } else {
          console.log("No users with this name were found.");
        }
        console.log("Thank you for using the program.");
      });
    } else {
      console.log("Thank you for using the program.");
    }
  });
}

function main() {
  loadDb();
  addUser();
}

main();
