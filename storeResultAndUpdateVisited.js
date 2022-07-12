function createSubmitData(tweetUserNames, tweetUserIds, participantInput, participantID) {
    // [[d1,d2,...,d10], [d11,...,d20], ..., [d51,d52]]
    // because the api only supports inserting ten records at one time
    let collected_data = [];

    for (let i = 0; i < tweetUserNames.length; i = i + 10) {
        let batch = [];
        for (let j = i; j < i + 10; j++) {
            if (j < tweetUserNames.length) {
                batch.push( 
                    { "fields" : {
                        "twitterUserName": tweetUserNames[j],
                        "twitterUserID": tweetUserIds[j],
                        "Choice": participantInput[j],
                        "participantID": participantID
                        }   
                    }
                );
            }
        }
        collected_data.push(batch);
    }

    return collected_data;
}


async function insert(targetTable, data) {
    try {
        for (let i = 0; i < data.length; i++) {
            await targetTable.create(data[i]);
        }
    } catch (e) {
        console.log(e);
        return;
    }

}

async function updateVisitedNum(targetTable, tweetUserPrevVisitedTimes, tweetUserRecordIds) {
    for (let i = 0; i < tweetUserRecordIds.length; i++) {
        await targetTable.update([{
            "id": tweetUserRecordIds[i],
            "fields": {
              "ratedTimes": tweetUserPrevVisitedTimes[i] + 1
            }
        }]);
    }
}

async function storeResultAndUpdateVisitedMain(tweetUserNames, tweetUserIds, participantInput, participantID, collectedDataTable, tweetUserPrevVisitedTimes, tweetUserRecordIds, twitterUserTable) {
    let collectedData = createSubmitData(tweetUserNames, tweetUserIds, participantInput, participantID);
    await insert(collectedDataTable, collectedData);

    await updateVisitedNum(twitterUserTable, tweetUserPrevVisitedTimes, tweetUserRecordIds);
}

exports.storeResultAndUpdateVisitedMain = storeResultAndUpdateVisitedMain;