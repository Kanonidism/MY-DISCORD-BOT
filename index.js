const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.once('ready', () => {
    console.log('Bot is online!');
    client.user.setActivity('Made by Kappa', { type: 'LISTENING' });
});

client.on('messageCreate', async message => {
    if (!message.guild || message.author.bot) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === 'kick') {
        if (!message.member.permissions.has('KICK_MEMBERS')) return message.reply('You do not have permissions to kick members.');
        const member = message.mentions.members.first();
        if (!member) return message.reply('Please mention a member to kick.');
        if (!member.kickable) return message.reply('I cannot kick this user.');
        await member.kick();
        message.channel.send(`${member.user.tag} has been kicked.`);
    } else if (command === 'ban') {
        if (!message.member.permissions.has('BAN_MEMBERS')) return message.reply('You do not have permissions to ban members.');
        const member = message.mentions.members.first();
        if (!member) return message.reply('Please mention a member to ban.');
        if (!member.bannable) return message.reply('I cannot ban this user.');
        await member.ban();
        message.channel.send(`${member.user.tag} has been banned.`);
    } else if (command === 'embed') {
        const url = args[0];
        const imageUrl = args[1];
        const embed = new MessageEmbed()
            .setTitle('Here is your URL')
            .setURL(url)
            .setDescription(`This is an embedded message with your URL: ${url}`)
            .setImage(imageUrl)
            .setColor('#0099ff');
        message.channel.send({ embeds: [embed] });
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice('!'.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'clear') {
      const amount = parseInt(args[0]);
  
      if (isNaN(amount)) {
        return await message.reply({ content: `**Βάλε μόνο αριθμόυς!**` });
      } else if (amount < 1 || amount > 100) {
        return await message.reply({ content: `**Βάλε μόνο έναν αριθμό απο το 1-100!**` });
      }
  
      try {
        const messages = await message.channel.messages.fetch({ limit: amount });
  
        const res = new MessageEmbed()
          .setColor('BLUE')
          .setDescription(`**Έγιναν delete ${messages.size} μυνήματα**`);
  
        await message.channel.bulkDelete(amount, true);
        const msg = await message.channel.send({ embeds: [res] });
  
        setTimeout(() => {
          msg.delete();
        }, 2000);
      } catch (error) {
        return console.log(error);
      }
    }
  });

  client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice('!'.length).split(/ +/);
    const command = args.shift().toLowerCase();
    try {
      if (command === 'userinfo') {
        const targetUser = message.mentions.users.first() || message.author;
        const userInfoEmbed = new MessageEmbed()
          .setColor('BLUE')
          .setDescription(`**User Information:**\n\n` +
            `**Tag:** ${targetUser.tag}\n` +
            `**Username:** ${targetUser.username}\n` +
            `**User ID:** \`\`${targetUser.id}\`\`\n` +
            `**Created At:** ${targetUser.createdAt.toDateString()}\n` +
            `**Joined At:** ${message.guild.members.cache.get(targetUser.id).joinedAt.toDateString()}`);
        message.channel.send({ embeds: [userInfoEmbed] });
      }
    } catch (error) {
      console.error(error);
    }
  });

  client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice('!'.length).split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === 'avatar') {
        if (!message.member.permissions.has('ADMINISTRATOR')) return await message.reply({ content: `Missing Permissions`});
        const avatar_url = args[0];
        if (!avatar_url) return await message.reply({ content: `Please put a url (animated or static)`});
        if (!avatar_url.startsWith('https') && !avatar_url.startsWith('http')) return await message.reply({ content: `Not a link` });
        await client.user.setAvatar(avatar_url).then(() => {
            message.channel.send({ content: `Set`});
        }).catch(err => {
            return message.channel.send({ content: `Error setting the avatar`})
        })
    }
})

const Discord = require('discord.js')
const delta = new Discord.Client({
    partials: ["CHANNEL", "MESSAGE", "REACTION", "USER", "GUILD_MEMBER"],
    intents: 32767,
})
const {MessageActionRow,MessageButton,} = require("discord.js");
const prefix = '!'
const { QuickDB } = require('quick.db');
const db = new QuickDB();


const staffteam = 'YOUR STEAMM TEAM ROLE ID'


delta.on('ready', async()=> {
    console.log(delta.user.username + " is up")
})

delta.on('messageCreate',async message =>{
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();


    if(command === 'ticket-setups'){
        if (!message.member.permissions.has([Discord.Permissions.FLAGS.MANAGE_MESSAGES]))return message.reply({content: `You dont have permissions to execute this command`})
        const channel = message.mentions.channels.first();
        if (!channel) return message.reply({content: "Add the channel you want setup the ticket"});
        const embed = new Discord.MessageEmbed()
        .setDescription('To create a ticket react with 📩')
        .setAuthor({name: message.guild.name,iconURL: message.guild.iconURL()})
        .setThumbnail(message.guild.iconURL({dynamic:true}))
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("SECONDARY")
            .setEmoji(`📩`)
            .setLabel('Create Ticket')
            .setCustomId("tickets")
        )
        channel.send({embeds: [embed],components: [row]}).then(message.delete({timeout:1500})).then(message.channel.send({content: `You setup ticket in #${channel}`}))
        
    }


})

delta.on('interactionCreate',async (interaction)=>{
    if(!interaction)return;
    if(interaction.isButton()){
        if(interaction.customId === 'tickets'){
            await interaction.update({})
            let count = await db.get(`tickets_${interaction.guild.id}`)
            let own = await db.get(`owner_${interaction.user.id}`)
            if(own)return interaction.followUp({content: `> **Warning:** Ticket limit reached, You already have 1 tickets open of the 1 allowed for this panel`,ephemeral:true})
            if(!count || count === null) count = 0
            const channel = await interaction.guild.channels.create(`ticket-${'0'.repeat(4 - count.toString().length)}${count}`,{
                type: "GUILD_TEXT",
                parent: interaction.channel.parentId,
                permissionOverwrites: [
                    {
                        id: interaction.guild.id,
                        deny: ["VIEW_CHANNEL"],
                    },
                    {
                        id: interaction.user.id,
                        allow: ["VIEW_CHANNEL","SEND_MESSAGES","ATTACH_FILES"]
                    },
                    { 
                      id: staffteam,
                      allow: ["VIEW_CHANNEL","SEND_MESSAGES","ATTACH_FILES"]
                    }
                ]
            })
            const embed = new Discord.MessageEmbed()
            .setDescription('Support will be with you shortly.\nTo close this ticket react with 🔒')
            .setFooter({text: interaction.guild.name,iconURL:interaction.guild.iconURL()})
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setStyle('SECONDARY')
                .setEmoji('🔒')
                .setLabel('Close')
                .setCustomId('close-ticket')
            )
            interaction.followUp({content: `Ticket Created ${channel}`,ephemeral:true})
             channel.send({embeds: [embed],components:[row]})
             await db.add(`tickets_${interaction.guild.id}`,1)
             await db.set(`owner_${interaction.user.id}`,interaction.user.id)
        }
        if(interaction.customId === 'close-ticket'){
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                .setStyle('DANGER')
                .setLabel('Close')
                .setCustomId('close'),
                new MessageButton()
                .setStyle('SECONDARY')
                .setLabel('Cancel')
                .setCustomId('cancel')
            )
            interaction.reply({content: `Are you sure you would like to close this ticket?`,components: [row]})
        }
        if(interaction.customId === 'close'){
            interaction.channel.delete({timeout:1500})
            await db.delete(`owner_${interaction.user.id}`)
        }
        if(interaction.customId === 'cancel'){
            interaction.message.delete({timeout:1500})
        }
    }
})

delta.login('')
client.login('');