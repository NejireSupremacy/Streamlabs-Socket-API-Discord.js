const Discord = require('discord.js')
const client = new Discord.Client({ intents: 1 })

const config = require('./config.json')
const io = require('socket.io-client')

client.on('ready', () => {
    console.log('Bot started')
})

const streamlabs = io(`https://sockets.streamlabs.com?token=${config.socketApiToken}`, {
    transports: ['websocket']
})

streamlabs.on('connect_error', (err) => {
    console.log('There was an error trying to connect to the server')
    console.log(err)
})

streamlabs.on('connect', () => {
    console.log('Connected to the server successfully')
})

streamlabs.on('event', async (eventData) => {
    const ch = await client.channels.fetch(config.channelID)
    const data = eventData.message[0]

    if(eventData.for === 'twitch_account') {
        if(eventData.type === 'follow') {
            ch.send({content: `${data.name} has followed the channel`})
        } else if(eventData.type === 'subscription') {
            ch.send({content: `${data.name} has subscribed to the channel \nMessage: ${data.message}`})
        } else if(eventData.type === 'resub') {
            ch.send({content: `${data.name} has subscribed to the channel for ${data.months} months \nMessage: ${data.message}`})
        } else if(eventData.type === 'host') {
            ch.send({content: `${data.name} has hosted us with ${data.viewers} viewer/s`})
        } else if(eventData.type === 'raid') {
            ch.send({content: `${data.name} has raided us with ${data.raiders} raider/s`})
        } else if(eventData.type === 'bits') {
            ch.send({content: `${data.name} has sent us ${data.amount} bits \nMessage: ${data.message}`})
        }
    }
})

client.login(config.token)