const { promises: fsPromises } = require("fs");

const countUniqueValues = async (cache) => {
  const userSet = new Set();

  try {
    for (let i = 0; i <= 19; i++) {
      const filePath = `./db/out${i}.txt`;
      if (cache.has(filePath)) {
        const fileUserSet = cache.get(filePath);
        fileUserSet.forEach((value) => {
          userSet.add(value);
        });
      } else {
        const fileContent = await fsPromises.readFile(filePath, "utf8");
        const lines = fileContent.split("\n");
        const fileUserSet = new Set();

        lines.forEach((line) => {
          fileUserSet.add(line.trim());
        });

        cache.set(filePath, fileUserSet);
        fileUserSet.forEach((value) => {
          userSet.add(value);
        });
      }
    }

    return userSet.size;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const countCommonLines = async (cache) => {
  const sets = [];

  try {
    for (let i = 0; i <= 19; i++) {
      const filePath = `./db/out${i}.txt`;
      const fileUserSet = cache.get(filePath);
      sets.push(fileUserSet);
    }

    let intersectionSet = sets[0];

    for (let i = 1; i < sets.length; i++) {
      intersectionSet = new Set(
        [...intersectionSet].filter((value) => sets[i].has(value))
      );
    }

    return intersectionSet.size;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

const countUniqueInAtLeastTen = async (cache) => {
  const fileCounts = new Map();

  try {
    for (let i = 0; i <= 19; i++) {
      const filePath = `./db/out${i}.txt`;
      const userSet = cache.get(filePath);

      userSet.forEach((line) => {
        if (!fileCounts.has(line)) {
          fileCounts.set(line, 1);
        } else {
          fileCounts.set(line, fileCounts.get(line) + 1);
        }
      });
    }

    const commonLines = [...fileCounts.entries()].filter(
      ([_, count]) => count >= 10
    );

    return commonLines.length;
  } catch (err) {
    console.error(err);
    return 0;
  }
};

(async () => {
  const cache = new Map();
  const startTime = new Date();

  const countUniqueValuesResult = await countUniqueValues(cache);
  const countCommonLinesResult = await countCommonLines(cache);
  const countUniqueInAtLeastTenResult = await countUniqueInAtLeastTen(cache);
  const endTime = new Date();

  console.log(`Unique values in file: ${countUniqueValuesResult}`);
  console.log(`Common lines in all files: ${countCommonLinesResult}`);
  console.log(
    `Unique lines in at least ten files: ${countUniqueInAtLeastTenResult}`
  );
  console.log(`Execution time: ${endTime - startTime}ms`);
})();
