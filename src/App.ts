import { IConfig } from "./util/interface/IConfig";
import { Logger, Severity } from "./util/Logger";
import { Client, Collection, Intents } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import Command from "./commands/base/Command";
import RefreshThreadHandler from "./util/handler/RefreshThreadHandler";

type CommandsClient = Client & { commands?: Collection<string, Command> };

export class App {
    private static _app: App | undefined;
    private _config: IConfig;
    private _client: CommandsClient;
    public get client() {
        return this._client;
    }
    
    public static initiate(config: IConfig) {
        if (!this._app) {
            this._app = new App(config);
        }
    }

    public static instance() {
        if (!this._app) {
            throw Error("App instance not defined");
        }
        return this._app;
    }

    constructor(_config: IConfig) {
        this._config = _config;
    }

    /**
     * Runs the Discord bot.
     */
    public async run() { 
        this._client = new Client({intents: [Intents.FLAGS.GUILDS]});
        this._client.commands = new Collection();
        const commandFiles = fs.readdirSync(path.join(__dirname, "./commands")).filter(commandFile => commandFile.endsWith(".js"));
 
        for (const commandFile of commandFiles) {
            const command = require(path.join(__dirname, `./commands/${commandFile}`));
            const importedCommand: Command = new command.default() as Command;
            this._client.commands.set(importedCommand.data.name, importedCommand);
        }

        this._client.once("ready", () => {
            Logger.log(Severity.Info, "Initiated!");
        })

        this._client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()) return;
        
            const command = this._client.commands?.get(interaction.commandName);
        
            if (!command) return;
        
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        });

        this._client.login(this._config.apiKey);

        RefreshThreadHandler.scheduleJobs();
    }
}

/**
 * Loads the correct config file depending on the argument passed / environment property value.
 * @returns Returns the config file that will be in use.
 */
function loadConfiguration(): IConfig | null {
    let config: string | undefined = process.argv[2];
    if (!config) {
        config = process.env.CONFIG;
    }
    if (!config) {
        Logger.log(Severity.Error, "No configuration specified");
        return null;
    }
    Logger.log(Severity.Info, `Using config '${config}'.`);

    let confFile: string;
    switch (config) {
        case "Release":
            confFile = "../../Config.json";
        break;
        case "Debug":
            confFile = "../../Config.json";
        break;
        case "Guild":
            return null;
        case "Global":
            return null;
        default:
            Logger.log(Severity.Error, "Invalid configuration name");
            return null;
    }

    return require(confFile);
}

process.on("uncaughtException", (error) => Logger.logError(Severity.Error, error));
const conf = loadConfiguration();
require("source-map-support").install();

if (conf) {
    App.initiate(conf);
    App.instance().run();
}