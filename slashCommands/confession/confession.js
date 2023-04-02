const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');

const config = require('../../config.json'); 
const prefix = config.prefix; 

module.exports = {
    data: new SlashCommandBuilder()
    .setName('confess') 
    .setDescription('Envoie une confession anonyme'), 
    async execute(client, interaction) {
        if(interaction.guild) {
            let channelData = db.get(`confessionChannels_${interaction.guild.id}`) //get the db of the confession channel in current guild

        let inGuild = new MessageEmbed() 
        .setAuthor('CConfession Paramètres >> Attente...', interaction.guild.iconURL())
        .setDescription(`Salut ${interaction.user}, Je t'ai envoyé un message direct ! Répondez à mon DM avec votre confession et je la publierai anonymement sur ${interaction.guild}.`)
        interaction.reply({ embeds: [inGuild], ephemeral: true })

        let sendDM = new MessageEmbed()
        .setAuthor(`${interaction.guild} >> En attendant ta confession...`, interaction.guild.iconURL()) 
        .setDescription(`${interaction.user}, please type your confession below and sent it to me as a message`)
        .addField(`Salon de confession`, `<#${channelData}>`) 
        interaction.user.send({ embeds: [sendDM] }).then(msg => { 
            const filter = i => i.author.id == interaction.user.id 
            msg.channel.awaitMessages({
                filter, 
                max: 1,
                time: 5 * 60000,
                errors: ['time']
            }).then(messages => {
                let msg1 = messages.first().content 

                if(msg1.toLowerCase() == (prefix + 'cancel')) { 
                    let cancelEmbed = new MessageEmbed()
                    .setTitle('Confession >> Annulé')
                    .setDescription(`${interaction.user}, processus de confession annulé avec succès !`) 
                    interaction.user.send({ embeds: [cancelEmbed] }) 
                } else {
                    let waitingMessage = new MessageEmbed()
                    .setAuthor(`${interaction.guild} >> Confession envoyée!`, interaction.guild.iconURL())
                    .setDescription(`${interaction.user}, votre confession a envoyé dans <#${channelData}> avec succès!`)
                    interaction.user.send({ embeds: [waitingMessage] })

                    let postMessage = new MessageEmbed() 
                    .setAuthor(`Confession anonyme`, interaction.guild.iconURL())
                    .setDescription(msg1)
                    .setFooter(`Tapez "/confess" pour envoyer une confession`)
                    .setTimestamp()
                    client.channels.cache.get(channelData).send({ embeds: [postMessage] });
                    }
                });
            })

        } else {
            interaction.user.send({ content: `La commande **/confess** ne peut être utilisée que sur un serveur ! Veuillez réessayer.` });
        }
    }
}