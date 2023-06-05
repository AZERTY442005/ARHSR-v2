// ©2023 AZERTY. All rights Reserved | AZERTY#9999

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

async function sleep(milliseconds) {
    const date = Date.now()
    let currentDate = null
    do {
        currentDate = Date.now()
    } while (currentDate - date < milliseconds)
}

async function ReserveRetard(login, password, restaurants) {
    for(let i = 0; i < 1; i++) {
        // console.log("Starting")
        console.log(restaurants)
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
    
    
        await browser.get("https://charles-peguy.family-administration.skolengo.net/connexion?panel=signin#")
        // console.log("Opening Website")

        // sleep(3000)
        // await browser.navigate().refresh()
        // sleep(3000)
    
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

        // let RestaurantsIDs = {
        //     "breton": 1,
        //     "caféteria": 2,
        //     "italien": 4,
        //     "sandwicherie": 6,
        //     "végétarien": 7
        // }

        // console.log(new Date().getDay())
        // console.log(new Date().getDay()+1) // Le lendemain
        // console.log(RestaurantsIDs[restaurant])
        // const RestaurantXpath = `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[${RestaurantsIDs[restaurants]}]/button`
        // console.log(RestaurantXpath)

        // const RestaurantsElements = {
        //     "breton": `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[1]/button`,
        //     "caféteria": `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[2]/button`,
        //     "italien": `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[4]/button`,
        //     "sandwicherie": `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[6]/button`,
        //     "végétarien": `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[7]/button`
        // }
        let RestaurantsElements = {
            "breton": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[1]/button`)).catch(()=>{}),
            "caféteria": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[2]/button`)).catch(()=>{}),
            "italien": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[4]/button`)).catch(()=>{}),
            "sandwicherie": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[6]/button`)).catch(()=>{}),
            "végétarien": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[7]/button`)).catch(()=>{})
        }
        // console.log(browser)
        // console.log(RestaurantsElements.breton)
        // console.log(RestaurantsElements.breton.textContent)
        // console.log(await browser.executeScript("arguments[0]", RestaurantsElements.breton))
        // console.log(await browser.executeScript("arguments[0].textContent", RestaurantsElements.breton))
        // console.log(browser.querySelector("#styleguides > div.container > div.table-container > table > tbody > tr > td.color--comp--lighter > div > ul > li:nth-child(1) > button"))
        // console.log(browser.querySelector("#styleguides > div.container > div.table-container > table > tbody > tr > td.color--comp--lighter > div > ul > li:nth-child(1) > button").textContent)

        // let PlacesDisponibles = Number((await browser.executeScript("return arguments[0].textContent", RestaurantsElements["caféteria"])).replaceAll(" ", "").split("\n")[3])
        // console.log(PlacesDisponibles)

        const PlacesLibres = {
            "breton": Number((await browser.executeScript("return arguments[0].textContent", RestaurantsElements["breton"])).replaceAll(" ", "").split("\n")[3]),
            "caféteria": Number((await browser.executeScript("return arguments[0].textContent", RestaurantsElements["caféteria"])).replaceAll(" ", "").split("\n")[3]),
            "italien": Number((await browser.executeScript("return arguments[0].textContent", RestaurantsElements["italien"])).replaceAll(" ", "").split("\n")[3]),
            "sandwicherie": Number((await browser.executeScript("return arguments[0].textContent", RestaurantsElements["sandwicherie"])).replaceAll(" ", "").split("\n")[3]),
            "végétarien": Number((await browser.executeScript("return arguments[0].textContent", RestaurantsElements["végétarien"])).replaceAll(" ", "").split("\n")[3]),
        }
        console.log(PlacesLibres)
        
        // console.log(RestaurantsElements["caféteria"])

        let RestaurantLibre = ""
        
        while(!RestaurantLibre) {
            for(const Restaurant of Object.keys(PlacesLibres)) {
                console.log(Restaurant)
                console.log(restaurants.includes(Restaurant))
                console.log(PlacesLibres[Restaurant] > 0)
                if(restaurants.includes(Restaurant) && PlacesLibres[Restaurant] > 0) {
                    RestaurantLibre = Restaurant
                    break
                }
            }
            await sleep(1000)
            console.log("Refreshing")
            await browser.navigate().refresh()
        }
        console.log(RestaurantLibre)

        // console.log(RestaurantsElements["caféteria"])
        RestaurantsElements = {
            "breton": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[1]/button`)).catch(()=>{}),
            "caféteria": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[2]/button`)).catch(()=>{}),
            "italien": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[4]/button`)).catch(()=>{}),
            "sandwicherie": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[6]/button`)).catch(()=>{}),
            "végétarien": await browser.findElement(webdriver.By.xpath(`//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()+1}]/div/ul/li[7]/button`)).catch(()=>{})
        }

        // const RestaurantXpath = `//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[${new Date().getDay()}]/div/ul/li[${RestaurantsIDs[restaurants]}]/button`
        // console.log(RestaurantXpath)


        await sleep(5000)

        // const Restaurant = await browser.findElement(webdriver.By.xpath("//*[@id='styleguides']/div[3]/div[2]/table/tbody/tr/td[4]/div/ul/li[5]/button"))
        // const Restaurant = await browser.findElement(webdriver.By.xpath(RestaurantXpath)).catch(()=>{})
        const Restaurant = RestaurantsElements[RestaurantLibre]
        if(!Restaurant) {
            await browser.close()
            return {status: "Error", output: "Jour invalide ou liste des Restaurants introuvable.", delay: StopTimer(StartTimespan)}
        }
        // console.log(Restaurant)

        // sleep(2000)

        await browser.executeScript("arguments[0].disabled = false", Restaurant) // Enable Element

        // sleep(2000)
        await sleep(30000)

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
module.exports = ReserveRetard

// ;(async () => {
//     console.log(await Reserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*", "italien"))
//     // console.log(await Reserve("enoal.fauchille@gmail.com", "Yoptoutlemonde4420053759*AH", "italien"))
// })()