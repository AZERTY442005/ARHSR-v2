// ©2023 AZERTY. Open Source since 07/06/2023 | AZERTY#9999

// const fs = require("fs")
var figlet = require("figlet")
const lolcatjs = require("lolcatjs")
const chalk = require("chalk")
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

async function Dereserve(login, password) {
    for(let i = 0; i < 1; i++) {
        // console.log("Starting")

        StartTimespan = new Date()
    
        require("chromedriver")

        const fs = require("fs")
    
        // Include selenium webdriver

        const path = require('path')
        const { ServiceBuilder } = require('selenium-webdriver/chrome')
        const { Builder } = require('selenium-webdriver')
        let webdriver = require("selenium-webdriver")

        // let driver = new webdriver.Builder()
        // let browser = driverconst path = require('path')
        const ChromeDriverPath = path.join(__dirname.replace("\\Functions", "").replace("/Functions", ""), "chromedriver 113.exe")
        const serviceBuilder = new ServiceBuilder(ChromeDriverPath);
        const driver = await new Builder()
        .forBrowser("chrome")
        .setChromeService(serviceBuilder)
        // .setChromeOptions("./chromedriver.exedsq")
        .build()
        
        console.clear()
        Banner()
        console.log(chalk.cyanBright("Déréservation en cours. Veuillez patienter ..."))
        
        let browser = driver
    
        // console.log(webdriver)
        // console.log(browser)
        // console.log("Started")
    
    
        browser.get("https://charles-peguy.family-administration.skolengo.net/connexion?panel=signin#")
    
        // let login = "enoal.fauchille@gmail.com"
        // let password = "Yoptoutlemonde4420053759*"
    
        await browser.findElement(webdriver.By.id("login__signin-email")).sendKeys(login)
        await browser.findElement(webdriver.By.id("login__signin-password")).sendKeys(password)
        await browser.findElement(webdriver.By.xpath("//button[text()='Envoyer']")).click()
        const LoginFailed = await browser.findElement(webdriver.By.xpath("//*[@id='login__panel-signin']/div[2]")).catch(()=>{})
        if(LoginFailed) {
            browser.close()
            return {status: "Error", output: "Nous n'avons pas réussi à vous connecter. L'email ou le mot de passe doivent être incorrectes.", delay: StopTimer(StartTimespan)}
        }
        await browser.findElement(webdriver.By.xpath("//div[text()='Réservation']")).click()
        let CancelButton
        try {
            CancelButton = await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[3]/div/div/div/div[2]/div/div/table/tbody/tr/td[2]/a"))
        } catch (err) {
            await browser.close()
            return {status: "Error", output: "Aucune réservation.", delay: StopTimer(StartTimespan)}
        }
        
        // console.log(CancelButton)
        const Attribute = await CancelButton.getAttribute("onclick")
        const Regex = /\/net-cater\/reservation\/annulation\/(\d+)\/(\d+)\/(\d+)-(\d+)-(\d+)/
        // console.log(Attribute)
        // console.log(Regex)
        const Result = Attribute.match(Regex)
        // console.log(Result)

        // await browser.executeScript("arguments[0].onclick = ''", CancelButton)
        // await CancelButton.click()
        await browser.get(`https://charles-peguy.family-administration.skolengo.net/net-cater/reservation/annulation/${Result[1]}/${Result[2]}/${Result[3]}-${Result[4]}-${Result[5]}`)

        // console.log(await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[2]/div/div/div")))
        const Output = await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[2]/div/div/div")).getText()
        console.log(Output)

        await browser.close()
        // setTimeout(()=>{
    
        // }, 10000000)

        if(Output.includes("Annulation effectuée")) {
            return {status: "Success", output: Output, delay: StopTimer(StartTimespan)}
        } else {
            return {status: "Error", output: Output, delay: StopTimer(StartTimespan)}
        }
    }
}
module.exports = Dereserve

// ;(async () => {
//     console.log(await Dereserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*"))
// })()