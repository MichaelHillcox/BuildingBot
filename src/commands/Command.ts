import { Message } from 'discord.js';

export default interface Command {
  command: string;
  description: string;
  requiresAdmin?: boolean;

  parse(message: Message, content: string, command: string): Promise<void>;
}
