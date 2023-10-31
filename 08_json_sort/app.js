const { readFileSync } = require("fs");
const axios = require("axios");

const data = readFileSync("./db/urlList.json", "utf8");
const endpoints = JSON.parse(data);

const fetchData = async (url, retry = 3) => {
  for (let i = 0; i < retry; i++) {
    try {
      const response = await axios.get(url);
      const data = JSON.parse(response.data);
      return data;
    } catch (error) {
      console.error(`[Retry ${i + 1}] ${url}: The endpoint is unavailable`);
    }
  }
  return null;
};

const getIsDoneCount = async () => {
  let trueCount = 0;
  let falseCount = 0;

  for (const endpoint of endpoints) {
    const data = await fetchData(endpoint);

    if (Array.isArray(data)) {
      data.forEach((item) => {
        if (item && item.hasOwnProperty("isDone")) {
          if (item.isDone === true) {
            console.log(`[Success] ${endpoint}: isDone - True`);
            trueCount++;
          } else {
            console.log(`[Success] ${endpoint}: isDone - False`);
            falseCount++;
          }
        }
      });
    } else {
      console.error(`[Error] ${endpoint}: Data is not an array.`);
    }
  }

  console.log(`Found True values: ${trueCount}`);
  console.log(`Found False values: ${falseCount}`);
};

getIsDoneCount();
