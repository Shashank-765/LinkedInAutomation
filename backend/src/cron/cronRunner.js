const cron = require("node-cron");

const {scheduledPostJob} = require("../jobs/scheduledPost.job");
const {industryAutoPostJob} = require("../jobs/industryAutoPost.job");
const {calendarAutoPostJob} = require("../jobs/calendarAutoPost.job");

// scheduled queue check every minute
cron.schedule("*/1 * * * *", () => {
    console.log('Running Scheduled Post Job...');
    scheduledPostJob(); 
});

// industry posting every minute
cron.schedule("*/1 * * * *", () => { 
    console.log('Running Industry Auto-Post Job...');
    industryAutoPostJob();
 });

// calendar posting once daily 8 AM
cron.schedule("*/1 * * * *", () => { 
    
    console.log('Running calendarposting Auto-Post Job...')
    
    calendarAutoPostJob();

});



// // Scheduling Cron Job (Runs every hour)
// cron.schedule("*/1 * * * *", () => {
//   console.log('Running Auto-Post Job...');
//   autoPostJob();
// });