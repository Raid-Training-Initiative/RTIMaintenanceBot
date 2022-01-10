# RTI Maintenance Bot
This is a repository for the RTI Maintenance Bot, which is a bot used to perform general maintenance tasks on the [RTI Discord](https://discord.gg/rti).

## Configuring
Before you run the bot you need to provide it with an API token and (optionally) invite it to a server.
To provide an API token:
  * Create an application at the [Discord Developer Portal](https://discord.com/developers/applications).
  * Click the bot settings for your application and add a bot.
  * Copy the generated bot token.
  * Create a file called `Config.json` in the root directory, with the following contents:
```json
{
    "apiKey": "paste the bot token here"
}
```

To invite the bot, copy your Client ID from the General Information page on the discord developer portal.
Then insert it into the `client_id` parameter in the following URL:
https://discord.com/api/oauth2/authorize?client_id=INSERT_CLIENT_ID_HERE&permissions=545394785521&scope=bot

Then, open the link and select the server you want to invite the bot to.

## Installing
* Clone the repo:
```bash
git clone https://github.com/StephanWells/RTIMaintenanceBot.git
```

## Running
#### Installation
* [Install Node.js](https://nodejs.org/en/download/) if you haven't already.
* Open a terminal at the root folder and install Node dependencies:
```bash
npm install
```

#### Execution
* Transpile TypeScript files into JavaScript code:
```bash
npm run tsc
```
* Run the app:
```bash
node dist/src/App.js Debug
```

#### Execution with VS Code
* If using VS Code, put the following JSON files in a folder called `.vscode` placed in the root directory:

`launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "cwd": "${workspaceFolder}",
            "type": "node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "program": "${workspaceFolder}/dist/src/App.js",
            "preLaunchTask": "npm: tsc",
            "outFiles": [
                "${workspaceFolder}/dist/**/*.js"
            ],
            "args": [ "Debug"
            ]
        }
    ]
}
```

`tasks.json`

```json
{
    "tasks": [
        {
            "type": "npm",
            "script": "tsc",
            "problemMatcher": [],
            "label": "npm: tsc",
            "detail": "tsc",
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "options": {
                "cwd": "${workspaceFolder}"
            }
        }
    ]
}
```
* Press F5 to run & debug.