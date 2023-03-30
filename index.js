
const suggestionChannelID = '1086734875337429090';
const suggestionChannelID2 = '1087311052968038400';
const Discord = require('discord.js');
const express = require('express');
const fs = require('fs');
const client = new Discord.Client();
const prefix = '^' ///تعديل مهم للبريفكس
const app = express();

app.get('/', (req, res) => {
  res.send('Sug is online .. Thx QauT')
});

app.listen(3000, () => {
  console.log('server started');
});


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  console.log("> | QauT Suggestion Bot : YEs");
  console.log(`> | Date : ${new Date()}`);
  console.log(`> | Name : ${client.user.username}`); //حط قيم الي تبيها
});


const sug = JSON.parse(fs.readFileSync("./rasug.json", "utf8"));
var sugcool = new Set();
client.on('message', async message => {
  if (message.channel.id === suggestionChannelID && !message.author.bot)
    if (message.content.startsWith('')) {
      if (['set', 'blacklist add', 'blacklist add', 'blacklist list', 'on', 'off'].includes(message.content.split(" ")[1])) return null;
      if (!sug[message.guild.id] || !message.guild.channels.cache.get(sug[message.guild.id].channel)) return message.channel.send(`**:x: حدث خطا!
  اذا كنت من ادمنيه السيرفر برجاء كتابه الامر الاتي : \`${prefix}set-sug\`  لتحديد روم الاقتراحات**`);
      if (sug[message.guild.id].onoff == 'Off') return message.channel.send(`**This Command Has Been Disabled**!`);
      if (sugcool.has(message.author.id)) return message.channel.send(message.author.username + ',**برجاء الانتظار 5 دقائق بين كل اقتراح**!').then(msg => {
        message.delete()
        setTimeout(() => msg.delete(), 3000)
      })
      if (!sug[message.guild.id]) sug[message.guild.id] = {};
      var args = message.content.split(" ").slice(0).join(" ");
      if (!args) return message.channel.send('**برجاء كتابه اقتراحك بعد الامر مباشره**!');
      var random = "0123456789";
      var ID = "";
      for (var y = 0; y < 6; y++) {
        ID += `${random.charAt(Math.floor(Math.random() * random.length))}`;
      };
      sugcool.add(message.author.id);
      setTimeout(() => {
        sugcool.delete(message.author.id);
      }, 5 * 60 * 1000);
      let embed = new Discord.MessageEmbed()

        .setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
        .setColor('#6064f4')
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true })).addField('**الإقتراح:**', `${args}`).addField(`الرد : `, `لم يتم الرد حتى الآن`).setFooter(`كود الإقتراح: ${ID}`).setTimestamp();
      let ch = message.guild.channels.cache.get(sug[message.guild.id].channel);
      ch.send(embed).then(M => {
        M.react("1072652395873570909");
        M.react("1072652393847717948")
        sug[message.guild.id + ID] = {
          ID: M.id,
          by: message.author.id,
          content: args
        }
        fs.writeFile("./rasug.json", JSON.stringify(sug), (err) => {
          if (err) console.error(err)
        });
        fs.writeFile("./rasug.json", JSON.stringify(sug), (err) => {
          if (err) console.error(err)

        });
        message.delete()
      })
    }

  if (message.content.startsWith('رد')) {
    if (message.channel.id === suggestionChannelID2 && !message.author.bot)
      if (!message.member.hasPermission('MANAGE_MESSAGES')) return message.channel.send(`**ليس لديك صلاحيه "MANAGE_MESSAGES" !!**`)
    if (!sug[message.guild.id] || !message.guild.channels.cache.get(sug[message.guild.id].channel)) return message.channel.send(
      `**:x: حدث خطا!
            اذا كنت من ادمنيه السيرفر برجاء كتابه الامر الاتي : \`${prefix}set-sug\`  لتحديد روم الاقتراحات**`)
    var ID = message.content.split(" ")[1];


    if (!ID || !sug[message.guild.id + ID]) return message.channel.send('**لم اتمكن من العثور على الاقتراحات يحمل هذا ال id !**')
    let ch = message.guild.channels.cache.get(sug[message.guild.id].channel)
    let oMessage = sug[message.guild.id + ID].ID ? await ch.messages.fetch(sug[message.guild.id + ID].ID) : null;
    if (!oMessage) return message.channel.send('**لم اتمكن من العثور على الاقتراحات يحمل هذا ال id !**')
    let editt = message.content.split(" ").slice(2, 101).join(" ");

    if (!editt) return message.channel.send(`**برجاء كتابه الرد بعد الامر مباشره**`);
    message.channel.send(`**☑️ تم الرد على الاقتراح حامل هذا ال ID : \`${ID}\` !**`)
    let em = message.guild.members.cache.get(sug[message.guild.id + ID].by);
    em.send(new Discord.MessageEmbed()
            .setAuthor(`${message.guild.name}`, message.guild.iconURL())
      .setColor('#00ff97')
      .setDescription('**تم الرد على إقتراحك :**')
     .addField(`الإقتراح : `, `${sug[message.guild.id + ID].content}`)
    .addField(`الرد : `, `${editt}`)
    .addField(`لا تتردد بإقتراح أجمل الأفكار الي بتساعدنا بتطوير السيرفر : `, `<#1073400809154433104>`)
      .setTimestamp())
    oMessage.edit(new Discord.MessageEmbed().setAuthor(message.author.username, message.author.displayAvatarURL({ dynamic: true }))
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .addField('**الإقتراح:**', sug[message.guild.id + ID].content)
      .addField(`**${message.author.tag} رد:**`, editt)
      .setTimestamp().setColor('#6064f4'))

  }
})

client.on('message', message => {
  if (message.content.startsWith(prefix + 'set-sug')) {
    if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send(`صلاحياتك لا تكفي لنحديد الروم يجيب ان يكون لديك صلاحيه **MANAGE_GUILD**`)
    let ch = message.mentions.channels.first() || message.guild.channels.cache.get(message.content.split(" ")[1]);
    if (!ch) return message.channel.send('لم اتمكن من العثور على هذا الروم برجاء المحاوله مره اخرى');
    sug[message.guild.id] = {
      onoff: 'On',
      channel: ch.id
    };
    fs.writeFile("./rasug.json", JSON.stringify(sug), (err) => {
      if (err) console.error(err)
    });
    message.channel.send(`**جميع الاقتراحات سيتم ارسالها للروم الاتي : ${ch}**`)
  }
})


client.on("message", message => {
  if (message.content == prefix + "help") {
    let help = new Discord.MessageEmbed()
      .setColor("0x5016f3")
      .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
      .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`
      \`${prefix}sug :\` ** لنشر اقتراح معين **
      \`${prefix}set-sug :\` **لاختيار روم الاقتراحات **
      \`${prefix}reply :\` **للرد على اقتراح معين**
      \`${prefix}ping :\` **لعرض بنق البوت **
            `);
    message.channel.send(help);
  }
});


client.on("message", message => {
  if (message.content.toLowerCase().startsWith(prefix + "ping".toLowerCase())) {
    let start = Date.now();
    message.channel.send(`**My Ping Is :** \`${Date.now() - message.createdTimestamp} ms\``);

  }
})


client.login(process.env.token);
