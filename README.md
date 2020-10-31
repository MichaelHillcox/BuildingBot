# BuildingBot
Building Bot is a simple discord bot created using Typescript and NodeJS to enable basic level intergration between our Github Repo and our Discord Server. This is a specific use discord bot meaning that it'll likely not fit your use-cases but it can be used as a good example on how to work with the Github, Discord, and Curse API.

## How to use
So you still want to use it? Wow, okay, heres the basic low down on what to do.

- Go to [Discord](discord.com), find the developers tab and create yourself a bot.
- Generate / reveal your token, note this down
- Copy the `config.example.toml` and paste it as `config.toml`
- Edit the `config.toml` file to include your github repo owner, repo name and your discord token.
- Run `npm install` (You'll need node installed)
- Finally, run `npm run dev` for dev, or `npm run build` to build the Typescript for deployment.

## Todo: 
- [ ] Expand on the curse support
- [ ] Support github releases

## License
[MIT](LICENSE)
