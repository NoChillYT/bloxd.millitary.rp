const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ],
    partials: ["CHANNEL"]
});

// 🔐 ACCOUNTS
const accounts = {
    creamkimi: "TheCreamiestOfThemAll2026",
    nochillyt: "TheCodedCoder",
    d3coy: "Founders?",
    developer: "theDeveloper",
    moderator: "theModerator",
    announcer: "theAnnouncer"
};

// PERMISSIONS
const perms = {
    Announcement: ["creamkimi","nochillyt","d3coy","announcer"],
    Warning: ["moderator","creamkimi","nochillyt","d3coy"],
    Development: ["nochillyt","creamkimi","d3coy","developer"],
    DM: ["creamkimi","nochillyt","d3coy","developer","moderator","announcer"]
};

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

app.post("/api/send", async (req,res)=>{

    const {user, pass, type, title, message, target} = req.body;

    if(accounts[user] !== pass){
        return res.json({msg:"Invalid login"});
    }

    if(!perms[type].includes(user)){
        return res.json({msg:"No permission"});
    }

    try{

        // EMBED SETUP
        const embed = {
            title,
            description: message,
            color: type === "Warning" ? 0xff0000 :
                   type === "Development" ? 0x00ff99 :
                   0x00aaff
        };

        // DM MODE
        if(type === "DM"){

            const dmUser = await client.users.fetch(target);
            await dmUser.send({ embeds:[embed] });

            return res.json({msg:"DM sent successfully"});
        }

        // NORMAL CHANNEL SEND (replace with your channel ID)
        const channel = await client.channels.fetch("YOUR_CHANNEL_ID");

        await channel.send({ embeds:[embed] });

        return res.json({msg:"Message sent"});

    }catch(err){
        console.log(err);
        return res.json({msg:"Error sending message"});
    }

});

client.login("MTQ5ODA2MjUzMzM5MzkxMTgxOA.GqPmxu.OgsM4BtOI4YGMsTfkjc4_UvnFN4pufgGSq8Xjk");

app.listen(3000, ()=> console.log("Server running on 3000"));
