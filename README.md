# BuildingBot
Building Bot is a simple discord bot created using Typescript and NodeJS to enable basic level intergration between our Github Repo and our Discord Server. This is a specific use discord bot meaning that it'll likely not fit your use-cases but it can be used as a good example on how to work with the Github, Discord, and Curse API.

## How to use
So you still want to use it? Wow, okay, heres the basic low down on what to do.

- Go to [discord.com](discord.com), find the developers tab and create yourself a bot.
- Generate / reveal your token, note this down
- Go to [github.com](github.com) and generate yourself a Github API token
- Copy the `config.tmp.js` and paste it as `config.js` (soon to be a toml file)
- Edit the `config.js` file to include your github repo owner, repo name, github token from above, your discord token, and fill in the relevant channel id's.
- Run `npm install` (You'll need node installed)
- Finally, run `npm run dev` for dev, or `npm run build` to build the Typescript for deployment.

## Todo: 
- [ ] Expand on the curse support
- [ ] Support github releases

## License
[MIT](LICENSE)
