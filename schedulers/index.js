var schedule = require('node-schedule');
var productpopularityjob = require('./productpopularityjob');
var onsiteordernoticejob = require('./onsiteordernoticejob');
var orderstatusupdatejob = require('./orderstatusupdatejob');
var lovematchnoticejob = require('./lovematchnoticejob');

exports.kickoff = function () {
    console.log("kick off schedulers")

    schedule.scheduleJob('0 0 0,12,18 * * *', productpopularityjob.do);
    schedule.scheduleJob('0 */15 * * * *', onsiteordernoticejob.do);
    schedule.scheduleJob('0 0 0 */1 * *', orderstatusupdatejob.do);
    schedule.scheduleJob('0 0 20 * * *', lovematchnoticejob.do);
}