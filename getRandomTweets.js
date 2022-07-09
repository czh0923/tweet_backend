const {myConstants} = require("./backendConstants.js");

function randomNumberGenerator(tableSize) {
    // [1, tableSize]
    let min = 1;
    let max = tableSize;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomRowArrayGenerator(presentedNumber, tweetTableSize) {
    let result = [];
    for (let i = 0; i < presentedNumber; i++) {
        result.push(randomNumberGenerator(tweetTableSize));
    }
    return result;
}

function buildFormula(presentedNumber, randomRowArray) {
    var formula = "OR("
    for (let i = 0; i < presentedNumber; i++) {
        if (i != presentedNumber - 1) {
            formula = formula + "{rowNum} = " + randomRowArray[i].toString() + ","
        } else {
            formula = formula + "{rowNum} = " + randomRowArray[i].toString() + ")"
        }
        // console.log(formula);
    }

    return formula;
}

function getRandomTweetMain(presentedNumber, twitterUserName) {
    let tweetTableSize = myConstants.twitterUsernameAndTweetnumberMap[twitterUserName];
    console.log(tweetTableSize);
}

getRandomTweetMain(1, "user1");