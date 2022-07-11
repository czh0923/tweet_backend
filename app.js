const {myTables} = require("./backendConstants.js");
const {getRandomTweetMain} = require("./getRandomTweets.js");
console.log("Running app.js...");

// setting up app
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/getTwitterUser/:presentedUserNumber/:mainTableName", async (req, res) => {

    let twitterUserTable = myTables.baseMain(req.params.mainTableName);
    try {
        var records = await twitterUserTable.select({maxRecords: parseInt(req.params.presentedUserNumber), view: "Grid view"}).firstPage();
    } catch (e) {
        console.log(e);
    }

    let tweetUserRecordIds = [];
    let tweetUserNames = [];
    let tweetUserIds = [];
    let tweetUserPrevVisitedTimes = [];

    records.forEach(function(record) {
        tweetUserRecordIds.push(record.getId());
        tweetUserNames.push(record.get('Name'));
        tweetUserIds.push(record.get('userID'));
        tweetUserPrevVisitedTimes.push(record.get('ratedTimes'));
    })

    res.send({tweetUserRecordIds, tweetUserNames, tweetUserIds, tweetUserPrevVisitedTimes});
})

app.get("/get/:userName/:originalAmount/:likesAmount", async (req, res) => {
    let targetTweetsTable = myTables.baseMain(req.params.userName);
    try {
        var records = await getRandomTweetMain(req.params.originalAmount, req.params.likesAmount, req.params.userName, targetTweetsTable);

        // console.log(records[0], records[1]);
    } catch (e) {
        console.log(e);
    }
    
    let originalTweetRecords = records[0];
    let likesTweetRecords = records[1];


    let retrievedOriginalRecordContent = [];
    originalTweetRecords.forEach(function(record) {
        retrievedOriginalRecordContent.push(record.get("content"));
    })

    let retrievedLikesRecordContent = [];
    likesTweetRecords.forEach(function(record) {
        retrievedLikesRecordContent.push(record.get("content"));
    })

    res.send({retrievedOriginalRecordContent, retrievedLikesRecordContent});
})

// app.listen(5500, "127.0.0.1");
app.listen(process.env.PORT || 5500);