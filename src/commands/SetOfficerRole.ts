import { SlashCommandBuilder, SlashCommandRoleOption } from "@discordjs/builders";
import { CommandInteraction, Permissions } from "discord.js";
import FileHandling from "src/util/handler/FileHandler";
import { Logger, Severity } from "../util/Logger";
import Command from "./base/Command";

export default class SetOfficerRole extends Command {
    constructor() {
        super();
        this._data = new SlashCommandBuilder()
            .setName('setofficerrole')
            .setDescription('Sets the role that can run maintenance commands with this bot')
            .addRoleOption((option: SlashCommandRoleOption) => {
                return option.setName("officer_role")
                    .setDescription("The role that has access to maintenance commands")
                    .setRequired(true);
            })
    }
        
    public async execute(interaction: CommandInteraction): Promise<void> {
        if (!interaction.memberPermissions?.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return interaction.reply("You need Administrator permissions to use this command!");
        }

        const guildId: string | null = interaction.guildId;
        const roleId: string | undefined = interaction.options.getRole("officer_role")?.id;

        if (!guildId || !roleId) {
            return interaction.reply("Error! Thread not found");
        }

        const success = await FileHandling.setOfficerRole(guildId, roleId);

        if (success) {
            return interaction.reply("Successfully set officer role");
        } else {
            return interaction.reply("Error setting the officer role")
        }
    }
}