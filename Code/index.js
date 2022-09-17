// ©2022 AZERTY. All rights Reserved | AZERTY#9999

const Reserve = require("./Réserve.js")
const Dereserve = require("./Déréserve.js")

// Importations
const fs = require("fs")
var figlet = require("figlet")
const lolcatjs = require("lolcatjs")
const chalk = require("chalk")
const inquirer = require("inquirer")

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
}

console.clear()
Banner()

// Display Informations
console.log(chalk.green("\nBy AZERTY442005"))
console.log(chalk.green("https://github.com/AZERTY442005\n"))
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

console.log()

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
                // console.log()
            }

            if (answer === "Programmer une Réservation") { // Choice is "Programmer une Réservation"
                
                

            } else if (answer === "Réserver instantanément") { // Choice is "Réserver instantanément"
                
                // const { Login, Password } = Login()

                const Restaurant = await GetRestaurant()
                console.log(Restaurant)

                // console.log(await GetRestaurant())
                // console.log(GetRestaurant())

                // await GetRestaurant().then(Restaurant => {
                //     console.log(Restaurant)
                // })

                // InstantReserve(Login, Password, Restaurant)
                // await InstantReserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*", "italien")
                await InstantReserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*", Restaurant)

            } else if (answer === "Déréserver instantanément") { // Choice is "Déréserver instantanément"
                
                

            } else if (answer === "Paramètres") { // Choice is "Paramètres"
                
                

            } else if (answer === "Quitter") { // Choice is "Quitter": Close
                process.exit()
            }
            
            console.log("\n")
            Loop()
        })
}

async function Login() {

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

    let Message
    if(Output.status == "Error") {
        Message = `${chalk.red(`Erreur: ${Output.output}`)} ${chalk.yellowBright(`${Output.delay}s`)}`
        await inquirer.prompt([
            {
                type: "list",
                name: "Error",
                message: Message,
                choices: ["Réésayer", "Annuler"],
            },
        ]).then(async answers => {
            const answer = answers.Error
            // console.log(answer)
            if(answer=="Réésayer") {
                console.clear()
                Banner()
                await InstantReserve(Login, Password, Restaurant)
            }
        })
    } else if(Output.status == "Success") {
        Message = `${chalk.red(`${Output.output}`)} ${chalk.yellowBright(`${Output.delay}s`)}`
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

// ANTICRASH
// process.on("unhandledRejection", (reason, p) => {
//     console.error(" [AntiCrash] :: Unhandled Rejection/Catch")
//     console.log(reason, p)
// })
// process.on("uncaughtException", (err, origin) => {
//     console.error(" [AntiCrash] :: Uncaught Exception/Catch")
//     console.log(err, origin)
// })
// process.on("uncaughtExceptionMonitor", (err, origin) => {
//     console.error(" [AntiCrash] :: Uncaught Exception/Catch (MONITOR)")
//     console.log(err, origin)
// })
// process.on("multipleResolves", (type, promise, reason) => {
//     // console.error(" [AntiCrash] :: Multiple Resolves")
//     // console.log(type, promise, reason)
// })





Loop()
