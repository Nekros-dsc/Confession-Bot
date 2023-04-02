const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

module.exports = {
    data: new SlashCommandBuilder() 
    .setName('confession-channel') 
    .setDescription('Définir le salon de Confession') 
    .addChannelOption(channel => 
        channel
        .setName('channel') 
        .setDescription('Confession salon') 
    ),
    async execute(client, interaction) {
        let confessionChannel = interaction.options.getChannel('channel') 
        let channelEmbed = new MessageEmbed()
        .setAuthor('Paramètres de confession >> Salon', interaction.guild.iconURL()) 
        .setDescription(`${interaction.user}, vous avez configuré avec succès le canal des confessions anonymes sur ${confessionChannel}`) 
        db.set(`confessionChannels_${interaction.guild.id}`, confessionChannel.id) 
        interaction.reply({ embeds: [channelEmbed], ephemeral: true })


    }
}