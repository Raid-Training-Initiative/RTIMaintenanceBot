import { Collection } from "discord.js";
import Command from "src/commands/base/Command";

declare module "discord.js" {
    export interface Client {
      commands: Collection<string, Command>
    }
  }