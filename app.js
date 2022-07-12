const {myTables} = require("./backendConstants.js");
const {getRandomTweetMain} = require("./getRandomTweets.js");
const {storeResultAndUpdateVisitedMain} = require("./storeResultAndUpdateVisited.js");
console.log("Running app.js...");

// setting up app
const express = require("express");
const cors = require("cors");
const { json } = require("express");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/getTwitterUser/:presentedUserNumber", async (req, res) => {

    let twitterUserTable = myTables.twitterUserTable;
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


app.get("/put/:tweetUserNames/:tweetUserIds/:participantInput/:participantId/:tweetUserPrevVisitedTimes/:tweetUserRecordIds", async (req, res) => {

    let tweetUserNames = JSON.parse(req.params.tweetUserNames);
    let tweetUserIds = JSON.parse(req.params.tweetUserIds);
    let participantInput = JSON.parse(req.params.participantInput);
    let participantId = req.params.participantId;

    let tweetUserPrevVisitedTimes = JSON.parse(req.params.tweetUserPrevVisitedTimes);
    let tweetUserRecordIds = JSON.parse(req.params.tweetUserRecordIds);

    console.log(tweetUserNames, tweetUserIds, participantInput, participantId, tweetUserPrevVisitedTimes, tweetUserRecordIds)
    try {
        await storeResultAndUpdateVisitedMain(tweetUserNames, tweetUserIds, participantInput, participantId, myTables.collectedDataTable, tweetUserPrevVisitedTimes, tweetUserRecordIds, myTables.twitterUserTable);
    } catch (e) {
        console.log(e);
    }

    res.status(200).send("ok");

})
// app.listen(5500, "127.0.0.1");
app.listen(process.env.PORT || 5500);