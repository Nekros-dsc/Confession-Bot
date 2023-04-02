const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Help.')
    .addStringOption((option) =>
    option.setName('message').setDescription('The message to say').setRequired(true)
    ),
    async execute(client, interaction) {
        interaction.reply({ content: "Voici les commandes du bot : \n\n/confession-channel : Permet de définir le salon des confessions\n/confess : Permet d'envoyer une confession\n/say : Permet de dire quelque chose à travers le bot\n/ping : Permet de savoir le ping du bot", ephemeral: true })
    }
}