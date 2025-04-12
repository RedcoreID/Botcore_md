import { watchFile, unwatchFile } from 'fs' 
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import moment from 'moment-timezone' 
import fs from 'fs' 

//OwnerShip
global.owner = [
  ['6283148450932', 'BotcoreID✨', true],
]
global.mods = []
global.prems = []

global.author = 'BotCoreID'
global.botname = 'Botcore'
 
 
 //Api's
global.APIs = {
  bloodcoreapi: 'https://bloodcoreapi.onrender.com'
}
global.APIKeys = { 
  'https://bloodcoreapi.onrender.com': 'bloodcore'
}

//Apikeys
global.bloodcorekeys = 'bloodcore'

//Sticker Watermarks
global.stkpack = 'Botcore 🥵'
global.stkowner = '© Botcore'

//management
global.bug = '*!! Sorry 💢 !!*\nSomething went wrong 🌋'
global.stop = '*!! 🎭 Unfortunately 💔 !!*\nBot system is not Responding 🙃'

//TimeLines
global.botdate = `*⫹⫺ Date:*  ${moment.tz('Asia/Kolkata').format('DD/MM/YY')}`
global.bottime = `*⫹⫺ Time:* ${moment.tz('Asia/Kolkata').format('HH:mm:ss')}`



let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})