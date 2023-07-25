// ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999
// Version: v2.1

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
const ReserveRetard = require("./RéserveRetard.js")
let ReservationWaiting = {status: false, restaurant: "", time: ""}

// Display Welcome Title
function Banner() {
    var banner = figlet.textSync("Réservateur Automatique", {
        font: "Small",
        horizontalLayout: "default",
        width: 1000,
        whitespaceBreak: true,
    })
    lolcatjs.fromString(banner)
    // console.log(chalk.green("\nBy AZERTY442005"))
    // console.log(chalk.green("https://github.com/AZERTY442005\n\n"))
    
    if(ReservationWaiting.status) {
        console.log(chalk.cyanBright("Réservation en attente de l'horaire..."))
        console.log(`${chalk.yellow(capitalizeFirstLetter(ReservationWaiting.restaurant))}  ${chalk.greenBright(ReservationWaiting.time)}\n`)
    }
}

console.clear()
Banner()

// Display Informations

// console.log(chalk.greenBright("By AZERTY442005"))
// console.log(chalk.greenBright("https://github.com/AZERTY442005\n\n"))

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
                choices: ["Programmer une Réservation", "Réserver instantanément", "Déréserver instantanément", "Réserver en Retard", "Paramètres", "Quitter"],
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
                const Logins = await GetLogin()
                const Restaurant = await GetRestaurant()
                console.clear()
                Banner()

                let Minutes = new Number()
                let TimeFormat = ""
                let DateFormat = ""

                ReservationWaiting.status = true
                ReservationWaiting.restaurant = Restaurant
                if(Logins.Class=="Seconde") {
                    ReservationWaiting.time = "19:30"
                } else if(Logins.Class=="Première") {
                    ReservationWaiting.time = "19:00"
                } else if(Logins.Class=="Terminale") {
                    ReservationWaiting.time = "18:30"
                } else if(Logins.Class=="BTS") {
                    ReservationWaiting.time = "18:20"
                }

                let AutoChecker = setInterval(async () => {
                    if(!ReservationWaiting.status) {
                        clearInterval(AutoChecker)
                    } else if(Minutes != new Date().getMinutes()) {
                        Minutes = new Date().getMinutes()
                        // console.log(("0" + Minutes).slice(-2))
                        
                        TimeFormat = `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}`
                        // console.log(TimeFormat)
                        DateFormat = `${("0" + (new Date().getDate()+1)).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`
                        
                        // console.log(TimeFormat+" "+DateFormat)
            
                        if((TimeFormat=="18:20" && Logins.Class=="BTS") || 
                        (TimeFormat=="18:30" && Logins.Class=="Terminale") || 
                        (TimeFormat=="19:00" && Logins.Class=="Première") || 
                        (TimeFormat=="19:30" && Logins.Class=="Seconde")) {
                            ReservationWaiting.status = {status: false, restaurant: "", time: ""}
                            console.clear()
                            Banner()
                            await InstantReserve(Logins.Login, Logins.Password, Restaurant)
                        }
                    }
                }, 1000)

                // console.log("Réservation en attente de l'horaire...")

                // while(ReservationWaiting.status) {
                    
                // }
                // await inquirer.prompt([
                //     {
                //         type: "list",
                //         name: "ScheduleInProgress",
                //         message: "Réservation en attente de l'horaire...",
                //         choices: ["Annuler"],
                //     },
                // ]).then(async answers => {
                //     const answer = answers.ScheduleInProgress
                //     if(answer=="Annuler") {
                //         console.clear()
                //         Banner()
                //         Stopped = true
                //     }
                // })
                
                console.clear()
                Banner()

            } else if (answer === "Réserver instantanément") { // Choice is "Réserver instantanément"
                const Logins = await GetLogin()
                const Restaurant = await GetRestaurant()
                await InstantReserve(Logins.Login, Logins.Password, Restaurant)
            } else if (answer === "Déréserver instantanément") { // Choice is "Déréserver instantanément"
                const Logins = await GetLogin()
                await InstantDereserve(Logins.Login, Logins.Password)
            } else if (answer === "Réserver en Retard") { // Choice is "Réserver en Retard"
                const Logins = await GetLogin()
                const Restaurants = await GetRestaurants()
                console.clear()
                Banner()
                console.log(`${chalk.blue(`Pour arrêter le processus, fermez le navigateur automatisé`)}`)
                console.log(`${chalk.green(`Démarrage dans 5 secondes`)}`)
                // sleep(5000)
                await DelayedReservation(Logins.Login, Logins.Password, Restaurants)
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
                        fs.writeFile("./Code/config.yaml", `# ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999\n\nLogin:\nPassword:\nClass:`, (err) => {
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
                                type: "password",
                                mask: "*",
                                // type: "input",
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
                        config = {Login: "", Password: "", Class: ""}
                    }
                    fs.writeFile("./Code/config.yaml", `# ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999\n\n${yaml.dump(config)}`, (err) => {
                        if (err) console.error();
                    })
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
        fs.writeFile("./Code/config.yaml", `# ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999\n\nLogin:\nPassword:\nClass:`, (err) => {
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
                type: "password",
                mask: "*",
                // type: "input",
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
        fs.writeFile("./Code/config.yaml", `# ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999\n\n${yaml.dump({Login: Login, Password: Password, Class: Class})}`, (err) => {
            if (err) console.error();
        })
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

async function GetRestaurants() {
    let Restaurants
    await inquirer.prompt([
        {
            type: "checkbox",
            name: "Restaurants",
            message: "Choisissez vos Restaurants",
            choices: ["Italien", "Végétarien", "Caféteria", "Sandwicherie", "Breton"],
        },
    ]).then(async answers => {
        Restaurants = answers.Restaurants.map(answer => (answer.toLowerCase()))
    })
    return Restaurants
}

function sleep(milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}

async function InstantReserve(Login, Password, Restaurant, Tries = 1) {
    Output = await Reserve(Login, Password, Restaurant)
    console.log(Output)

    console.clear()
    Banner()

    let Message
    if(Output.status == "Error") {
        if(Tries < 5) { // Récursivité
            // console.clear()
            // Banner()
            console.log(`${chalk.red(`Erreur: ${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`)
            console.log(`${chalk.yellow(`Tentative n°${Tries+1} dans 5 secondes`)}`)
            // setTimeout(async () => {
                // await InstantReserve(Login, Password, Restaurant, Tries+1)
            // }, 5000)
            sleep(5000)
            await InstantReserve(Login, Password, Restaurant, Tries+1)
        } else { // Condition de Sortie 
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
        }
    } else if(Output.status == "Success") {
        Message = `${chalk.greenBright(`${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
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
        Message = `${chalk.greenBright(`${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
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

async function DelayedReservation(Login, Password, Restaurants) {
    // Output = await ReserveRetard(Login, Password, "caféteria")
    Output = await ReserveRetard(Login, Password, Restaurants)
    
    fetchUsage("Réservation en Retard", Login, undefined, `${Output.status}: ${Output.output} ${Output.delay}s`)
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
                await DelayedReservation(Login, Password, Restaurants)
            }
        })
    } else if(Output.status == "Success") {
        Message = `${chalk.greenBright(`${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
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

async function DelayedReservation(Login, Password, Restaurants) {
    // Output = await ReserveRetard(Login, Password, "caféteria")
    Output = await ReserveRetard(Login, Password, Restaurants)
    
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
                await DelayedReservation(Login, Password, Restaurants)
            }
        })
    } else if(Output.status == "Success") {
        Message = `${chalk.greenBright(`${Output.output}`)} ${chalk.yellow(`${Output.delay}s`)}`
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

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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