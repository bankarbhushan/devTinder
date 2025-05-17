const cron = require("node-cron");

cron.schedule("17 18 * * *", () => {
  console.log("vicky is MC ", +new Date().toDateString());
});
