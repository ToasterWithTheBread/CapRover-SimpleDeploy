# CapRover-SimpleDeploy
Simple app to automatically poll GitHub repo's to redploy them on CapRover

# How to setup
Just deploy the GitHub repo inside Caprover, should be pretty simple

To deploy it normally just copy the repo and build the Dockerfile

App does not listen on any ports

# Enviroment Variables
```
TELEGRAM_BOT_TOKEN = "Sends notifications when it sends build successfully"
TELEGRAM_CHAT_ID = "Chat ID for the bot to use (Send a message to @getmyid_bot to get your chat ID)"

USER = "GitHub username where all the repos are"
REPOS = "List of repos to monitor (Eg: Test1,Test2,Test3)"
```

The Telegram bot token is optional, but its recommended.

# Repo Setup
Not only does every repo need to have a **captain-definition** file, but every repo also needs a **captain-webhook** file that looks like this:
```
{
    "url": "Webhook to post to (Can be gotten from the app inside CapRover, same way you would get the GitHub webhook URL)"
}
```
**DO NOT PUT A PUBLICALLY ACCESSIBLE WEBHOOK URL, PUT ONE THAT CAN ONLY BE ACCESSED VIA LOCAL NETWORK OR VPN (TailScale)**

# Contributing
All pull requests are welcome, any suggestions are welcome too.

For support send me a message on Telegram (https://t.me/ToasterWithTheBread)
