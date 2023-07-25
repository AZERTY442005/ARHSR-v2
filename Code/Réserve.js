// ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999

// const fs = require("fs")
var figlet = require("figlet")
const lolcatjs = require("lolcatjs")
const chalk = require("chalk")
const { waitForDebugger } = require("inspector")
// const inquirer = require("inquirer")

function Banner() {
    var banner = figlet.textSync("Réservateur Automatique", {
        font: "Small",
        horizontalLayout: "default",
        width: 1000,
        whitespaceBreak: true,
    })
    lolcatjs.fromString(banner)
}

function StopTimer(StartTimespan) {
    const EndTimespan = new Date()
    var Delay =(EndTimespan.getTime() - StartTimespan.getTime()) / 1000
    return Delay
}

async function sleep(milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}

async function Reserve(login, password, restaurant) {
    for(let i = 0; i < 1; i++) {
        // console.log("Starting")

        StartTimespan = new Date()
    
        require("chromedriver")

        const fs = require("fs")

        const path = require('path')
        const { ServiceBuilder } = require('selenium-webdriver/chrome')
        const { Builder } = require('selenium-webdriver')
        let webdriver = require("selenium-webdriver")

        // console.log(path)
        // console.log(__dirname)
        const ChromeDriverPath = path.join(__dirname.replace("\\Functions", "").replace("/Functions", ""), "chromedriver 113.exe")
        const serviceBuilder = new ServiceBuilder(ChromeDriverPath);
        const driver = await new Builder()
        .forBrowser('chrome')
        .setChromeService(serviceBuilder)
        .build()

        console.clear()
        Banner()
        console.log(chalk.cyanBright("Réservation en cours. Veuillez patienter ..."))

        // let driver = new webdriver.Builder()
        let browser = driver
        // .forBrowser("chrome")
        // .setChromeOptions("./chromedriver.exedsq")
        // .build()
    
        // console.log(webdriver)
        // console.log(browser)
        // console.log("Started")
    
    
        browser.get("https://charles-peguy.family-administration.skolengo.net/connexion?panel=signin#")
        // console.log("Opening Website")
    
        // console.log("Logging In")
        await browser.findElement(webdriver.By.id("login__signin-email")).sendKeys(login)
        await browser.findElement(webdriver.By.id("login__signin-password")).sendKeys(password)
        await browser.findElement(webdriver.By.xpath("//button[text()='Envoyer']")).click()
        const LoginFailed = await browser.findElement(webdriver.By.xpath("//*[@id='login__panel-signin']/div[2]")).catch(()=>{})
        if(LoginFailed) {
            await browser.close()
            return {status: "Error", output: "Nous n'avons pas réussi à vous connecter. L'email ou le mot de passe doivent être incorrectes.", delay: StopTimer(StartTimespan)}
        }
        // console.log("Logged In")
        await browser.findElement(webdriver.By.xpath("//div[text()='Réservation']")).click()
        await browser.findElement(webdriver.By.xpath("//a[text()='Réservation']")).click()

        let RestaurantsIDs = {
            "breton": 1,
            "caféteria": 2,
            "italien": 4,
            "sandwicherie": 6,
            "végétarien": 7
        }

        // console.log(new Date().getDay())
        // console.log(new Date().getDay()+1) // Le lendemain
        // console.log(RestaurantsIDs[restaurant])
        const RestaurantXpath = `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[${RestaurantsIDs[restaurant]}]/button`
        // console.log(RestaurantXpath)

        // const Restaurant = await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[4]/div/ul/li[5]/button"))
        const Restaurant = await browser.findElement(webdriver.By.xpath(RestaurantXpath)).catch(()=>{})
        if(!Restaurant) {
            await browser.close()
            return {status: "Error", output: "Jour invalide ou liste des Restaurants introuvable.", delay: StopTimer(StartTimespan)}
        }
        // console.log(Restaurant)

        // await sleep(20000)

        await browser.executeScript("arguments[0].disabled = false", Restaurant) // Enable Element

        // sleep(2000)
        // await sleep(20000)

        await Restaurant.click()
        
        // sleep(2000)

        await browser.findElement(webdriver.By.xpath("//button[text()='Valider']")).click()

        // console.log(await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[2]/div/div/div")))
        const Output = await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[2]/div/div/div")).getText()
        // console.log(Output)

        await browser.close()

        if(Output.includes("Votre réservation n'a pas pu être enregistrée")) { // If Error
            // console.log("Error: "+Output.split("\n")[0])
            return {status: "Error", output: Output.split("\n")[0], delay: StopTimer(StartTimespan)}
        } else if(Output.includes("Votre réservation a été faite avec succès.")) {
            return {status: "Success", output: Output, delay: StopTimer(StartTimespan)}
        }


        // TAKE SCREENSHOT
        // browser.takeScreenshot().then(function(data){
        //     var base64Data = data.replace(/^data:image\/png;base64,/,"")
        //     fs.writeFile("out.png", base64Data, 'base64', function(err) {
        //         if(err) console.log(err)
        //     })
        // })

        // CLOSE BROWSER
        // browser.close()
    }
}
module.exports = Reserve

// ;(async () => {
//     console.log(await Reserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*", "italien"))
//     // console.log(await Reserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*AH", "italien"))
// })()