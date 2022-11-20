async function getPrevVisitedTimes(finalTable, recordID) {
    const record = await finalTable.find(recordID);
    return parseInt(record.get('Rated'));
}

async function updateResult(tweetUserRecordIds, participantInput, participantID, finalTable) {

    for (let i = 0; i < tweetUserRecordIds.length; i++) {

        const prevVisitedTimes = await getPrevVisitedTimes(finalTable, tweetUserRecordIds[i]);

        const columnC = "C" + (prevVisitedTimes + 1).toString();
        const columnP = "P" + (prevVisitedTimes + 1).toString();

        await finalTable.update([{
            "id": tweetUserRecordIds[i],
            "fields": {
              "Rated": prevVisitedTimes + 1,
              [columnC]: participantInput[i],
              [columnP]: participantID
            }
        }]);

        console.log("updating record", tweetUserRecordIds[i]);

    }

}

exports.updateResult = updateResult;