require("dotenv").config();

const cron = require("node-cron");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");

async function log(text) {
    let bot;

    if (process.env.TELEGRAM_BOT_TOKEN !== undefined) {
        bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    }

    if (process.env.TELEGRAM_BOT_TOKEN !== undefined) {
        bot.sendMessage(process.env.TELEGRAM_CHAT_ID, text);
        console.log(text);
    } else {
        console.log(text);
    }
}

async function isWithinTime(isoTimestamp) {
    // Ugly function to decide if the commit is within or is the specified poll rate
    const within = new Date() - new Date(isoTimestamp) <= parseInt(process.env.POLL_RATE) * 60 * 1000;
    return within;
}

async function run() {
    let user = process.env.GITHUB_USERNAME;
    let recent_commit_list = await axios({ method: "get", url: `https://api.github.com/users/${user}/events/public` });

    for (const data of recent_commit_list.data) {
        if (data.type === "PushEvent") {
            // Getting the repo name from the request (kinda ugly)
            let repo_name = data.repo.name.split("/")[1].trim();

            if ((await isWithinTime(data.created_at)) === true) {
                console.log(`🎯 Detected commit from ${repo_name}`);

                try {
                    // Getting the webhook URL from the file in the repo
                    let webhook_file = await axios({method: "get", url: `https://raw.githubusercontent.com/${user}/${repo_name}/main/captain-webhook` });
                    let webhook_request = await axios({ method: "post", url: webhook_file.data.url });

                    if (webhook_request.data.status === 100) {
                        log(`✔ Sent deploy request for ${repo_name} successfully`);
                    } else {
                        log(`❌ Error sending deploy request for ${repo_name}`);
                    }
                } catch {
                    log(`💀 No captain-webhook file found in ${repo_name}`);
                }
            }
        }
    }
}

console.log(`🎉 Successfully started the monitor on account ${process.env.GITHUB_USERNAME}!`);

cron.schedule(`*/${process.env.POLL_RATE} * * * *`, () => {
    console.log("⌚ Polling for new commits!");
    run();
});
