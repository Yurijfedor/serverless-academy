Description
app.js is a Node.js script that performs various operations on a set of text files located in the ./db directory. It uses asynchronous file operations and caching to efficiently process and analyze the data from these text files.

The script includes the following main functions:

countUniqueValues: This function reads multiple text files, extracts unique values from each file, and stores them in a cache. It then returns the total count of unique values across all files.

countCommonLines: It retrieves previously cached unique values, compares them among files, and identifies common lines present in all files. The function returns the count of common lines.

countUniqueInAtLeastTen: This function counts how many lines appear in at least ten different files among the set of text files.
