// local: run npx nodemon app.js

const {myTables} = require("./backendConstants.js");
const {getRandomTweetMain} = require("./getRandomTweets.js");
const {shuffleArray, getRandomNumber} = require("./getRandomTweets.js");
const {updateResult} = require("./storeResultAndUpdateVisited.js");
console.log("Running app.js...");

// setting up app
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
    res.send("hello");
})

app.get("/home", (req, res) => {
    res.send("this is home page");
})


app.get("/getTwitterUser/:presentedUserNumber", async (req, res) => {

    const table = myTables.tableTweets;

    console.log(table);

    var allRecordData = []; // [[reocrdID, tweetId, rated, tweet1, type1, ....], [], []]

    const formula = `{Rated} < ${req.params.presentedUserNumber}`;

    table.select({
        view: "Grid view",
        filterByFormula: formula
    }).eachPage(function page(records, fetchNextPage) {
    
        records.forEach(function(record) {
            allRecordData.push([record.getId(), record.get('TweetID'), record.get('Rated'), 
            record.get('Tweet1'), record.get('Type1'), // index: 3, 4
            record.get('Tweet2'), record.get('Type2'), // 5, 6
            record.get('Tweet3'), record.get('Type3'), 
            record.get('Tweet4'), record.get('Type4'),
            record.get('Tweet5'), record.get('Type5'), 
            record.get('Tweet6'), record.get('Type6'), 
            record.get('Tweet7'), record.get('Type7'), 
            record.get('Tweet8'), record.get('Type8'),
            record.get('Tweet9'), record.get('Type9'), // 19
            record.get('Tweet10'), record.get('Type10') // 21, 22
            ]);
        });

        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); return; }

        let randomNumber = getRandomNumber(parseInt(req.params.presentedUserNumber), allRecordData.length);

        let tweetUserRecordIds = [];
        let tweetUserNames = [];
        let tweets = [];
        let types = [];

        for (let i = 0; i < randomNumber.length; i++) {
            tweetUserRecordIds.push(allRecordData[randomNumber[i]][0]);
            tweetUserNames.push(allRecordData[randomNumber[i]][1]);

            for (var j = 1; j <= 10; j++) {
                tweets.push(allRecordData[randomNumber[i]][j * 2 + 1]);
                types.push(allRecordData[randomNumber[i]][j * 2 + 2]);
            }
        }

        res.send({tweetUserRecordIds, tweetUserNames, tweets, types});
    });

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


app.get("/submit/:tweetUserRecordIds/:participantInput/:participantID", async (req, res) => {

    let tweetUserRecordIds = JSON.parse(req.params.tweetUserRecordIds);

    let participantInput = JSON.parse(req.params.participantInput);
    let participantID = req.params.participantID;

    try {
        await updateResult(tweetUserRecordIds, participantInput, participantID, myTables.tableTweets);
    } catch (e) {
        console.log(e);
    }

    res.status(200).send("ok");

})

// app.listen(5500, "127.0.0.1");
app.listen(process.env.PORT || 5500);

