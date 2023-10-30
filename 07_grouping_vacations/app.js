const { readFileSync } = require("fs");

const data = readFileSync("./db/data.json", "utf8");
const parsedData = JSON.parse(data);

const newData = {};

parsedData.forEach((item) => {
  const userId = item.user._id;
  const userName = item.user.name;

  if (!newData[userId]) {
    newData[userId] = {
      userId,
      userName,
      vacations: [],
    };
  }

  const vacation = {
    startDate: item.startDate,
    endDate: item.endDate,
  };

  newData[userId].vacations.push(vacation);
});

const result = Object.values(newData);

console.log(JSON.stringify(result, null, 2));
