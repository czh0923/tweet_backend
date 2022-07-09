const {myConstants} = require("./backendConstants.js");

function shuffle(o) {
    // using shuffle to avoid duplicate rowNum
    // source: https://stackoverflow.com/questions/15585216/how-to-randomly-generate-numbers-without-repetition-in-javascript
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function randomRowArrayGenerator(upperBound) {
    // [1, upperBound]
    // Array(5) -> [1,2,3,4,5]
    let randomRow = [...Array(upperBound).keys()];
    randomRow.shift(); // [0, 1, 2, ...] -> [1, 2, ...]
    randomRow = shuffle(randomRow);
    return randomRow;
}

function buildFormula(randomRowArray) {
    var formula = "OR("
    for (let i = 0; i < randomRowArray.length; i++) {
        if (i != randomRowArray.length - 1) {
            formula = formula + "{rowNum} = " + randomRowArray[i].toString() + ","
        } else {
            formula = formula + "{rowNum} = " + randomRowArray[i].toString() + ")"
        }
    }
    // console.log(formula)

    return formula;
}

function buildFormulaMain(presentedOriginalTweetNum, presentedLikedTweetNum, randomRowArray, originalTweetAmount) {
    let originalRowArray = [];
    let likedRowArray = [];
    for (let i = 0; i < randomRowArray.length; i++) {
        if (originalRowArray.length == presentedOriginalTweetNum && likedRowArray.length == presentedLikedTweetNum) {
            break;
        } else {
            if (randomRowArray[i] <= originalTweetAmount && originalRowArray.length < presentedOriginalTweetNum) {
                originalRowArray.push(randomRowArray[i]);
            } else if (randomRowArray[i] > originalTweetAmount && likedRowArray.length < presentedLikedTweetNum) {
                likedRowArray.push(randomRowArray[i]);
            }
        }
    }

    let formulaForOriginalTweets = buildFormula(originalRowArray);
    let formulaForLikedTweets = buildFormula(likedRowArray);

    return {formulaForOriginalTweets, formulaForLikedTweets}
}

function getOriginalTweetAmount(twitterUserName) {
    return myConstants.twitterUsernameAndTweetnumberMap[twitterUserName][0];
}

function getLikedTweetAmount(twitterUserName) {
    return myConstants.twitterUsernameAndTweetnumberMap[twitterUserName][1];
}

async function getRandomTweetMain(presentedOriginalTweetNum, presentedLikedTweetNum, twitterUserName, targetTweetsTable) {

    let originalTweetAmount = getOriginalTweetAmount(twitterUserName);
    let likedTweetAmount = getLikedTweetAmount(twitterUserName);

    let randomRowArray = randomRowArrayGenerator(originalTweetAmount + likedTweetAmount);

    let {formulaForOriginalTweets, formulaForLikedTweets} = buildFormulaMain(presentedOriginalTweetNum, presentedLikedTweetNum, randomRowArray, originalTweetAmount);

    try {
        var recordsForOriginalTweets = await targetTweetsTable.select({filterByFormula: formulaForOriginalTweets}).firstPage();
        var recordsForLikedTweets = await targetTweetsTable.select({filterByFormula: formulaForLikedTweets}).firstPage();
    } catch (e) {
        console.log(e);
    }

    // console.log("in getRandomTweetMain", recordsForOriginalTweets, recordsForLikedTweets);

    return [recordsForOriginalTweets, recordsForLikedTweets]
}

exports.getRandomTweetMain = getRandomTweetMain;