# Description

This app.js is a Node.js program that performs various analytical operations on text files. It is designed to process a set of text files in the .txt format. The program uses an asynchronous approach and distributed computing to perform the following tasks:

1. Counting Unique Values: The program reads each file and counts the number of unique values (lines) across all the files.
2. Finding Common Lines: The program determines which lines are present in all files and outputs their count.
3. Finding Unique Lines in at Least Ten Files: The program searches for lines that appear in at least ten different files and outputs their count.

The program uses caching to avoid unnecessary reading of files that have already been processed. The executed operations and results are displayed in the console.

# Requirements

To run the program successfully, you need to have Node.js and the fs module, which is part of the Node.js standard library, installed.

# Usage

1. Download the program to your local directory.
2. Open the command prompt and navigate to the directory where the program is located.
3. Execute the program using the node app.js command.
4. The results will be displayed in the console, including the count of unique values, common lines count, and the count of unique lines appearing in at least ten files.
