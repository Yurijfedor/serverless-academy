const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function main() {
  rl.question(
    "Hello! Enter 10 words or digits deviding them in spaces: ",
    (input) => {
      if (!input || input.toLowerCase() === "exit") {
        rl.close();
      } else {
        const userInput = input.split(" ").filter((item) => item.trim() !== "");

        rl.question(
          `
          
          How would you like to sort values:
1. Sort words alphabetically
2. Show numbers from lesser to greater
3. Show numbers from bigger to smaller
4. Display words in ascending order by number of letters in the word
5. Show only unique words
6. Display only unique values from the set of words and numbers entered by the user
7. To exit the program

`,
          (choice) => {
            switch (choice) {
              case "1":
                const sortedWords = userInput
                  .filter((item) => isNaN(item))
                  .sort();
                console.log(sortedWords);
                main();
                break;

              case "2":
                const sortedNumbersAsc = userInput
                  .filter((item) => !isNaN(item))
                  .map((item) => Number(item))
                  .sort((a, b) => a - b);
                console.log(sortedNumbersAsc);
                main();
                break;

              case "3":
                const sortedNumbersDesc = userInput
                  .filter((item) => !isNaN(item))
                  .map((item) => Number(item))
                  .sort((a, b) => b - a);
                console.log(sortedNumbersDesc);
                main();
                break;

              case "4":
                const sortedWordsByLength = userInput
                  .filter((item) => isNaN(item))
                  .sort((a, b) => a.length - b.length);
                console.log(sortedWordsByLength);
                main();
                break;

              case "5":
                const uniqArrOfWords = [];
                const onlyWords = userInput.filter((item) => isNaN(item));
                for (const item of onlyWords) {
                  if (!uniqArrOfWords.includes(item)) {
                    uniqArrOfWords.push(item);
                  }
                }

                console.log(uniqArrOfWords);
                main();
                break;

              case "6":
                const uniqArr = [];
                for (const item of userInput) {
                  if (!uniqArr.includes(item)) {
                    uniqArr.push(item);
                  }
                }

                console.log(uniqArr);
                main();
                break;

              case "7":
                console.log("Good bye! Come back again!");
                rl.close();
                break;

              default:
                console.log("Sorry! This is the wrong choice. Try again");
                processInput(input);
                break;
            }
          }
        );
      }
    }
  );
}

main();
