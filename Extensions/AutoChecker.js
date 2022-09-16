// ©2022 AZERTY. All rights Reserved | AZERTY#9999
// const MessageLanguage = require("../Functions/MessageLanguage.js")
// const fs = require("fs")
// const fetch = require('node-fetch')
// const yaml = require('js-yaml')
// const {format: prettyFormat} = require('pretty-format')

const mongo = require('../Functions/Mongo.js')
const UsersSchema = require("../DataBase/schemas/users-schema")

const Reserve = require("../Functions/Réserve")

function RemoveFromArray(array, element) {
    for(var i=0; i<array.length; i++){
        if(array[i].date==element.date) {
            array.splice(i, 1)
        }
    }
}

module.exports = async (bot, config) => {

    let Minutes = new Number()
    let TimeFormat = ""
    let DateFormat = ""
    setInterval(async () => {
        if(Minutes != new Date().getMinutes()) {
            Minutes = new Date().getMinutes()
            // console.log(("0" + Minutes).slice(-2))
            
            TimeFormat = `${("0" + new Date().getHours()).slice(-2)}:${("0" + new Date().getMinutes()).slice(-2)}`
            // console.log(TimeFormat)
            DateFormat = `${("0" + (new Date().getDate()+1)).slice(-2)}/${("0" + (new Date().getMonth()+1)).slice(-2)}/${new Date().getFullYear()}`
            
            // console.log(TimeFormat+" "+DateFormat)

            // Hour Checker (per classes)
            if("18:20" == TimeFormat) { // BTS
                console.log(TimeFormat+": BTS")

                let Users
                await mongo().then(async (mongoose) => { // Get Users
                    try {
                        const Documents = await UsersSchema.find({})
                        const Sorted = new Array()
                        Documents.forEach(Document => {
                            if(Document.class == "BTS") Sorted.push(Document)
                        })
                        Users = Sorted
                    } finally {}
                })
                console.log(Users)
                Users.forEach(async User => {
                    const Reservation = User.reservations.find(reservation => reservation.date == DateFormat)
                    // console.log(Reservation)
                    if(Reservation && User.login && User.password) {
                        // console.log(User)
                        const Output = await Reserve(User.login, User.password, Reservation.restaurant)
                        console.log(Output)
                        await mongo().then(async (mongoose) => {
                            try {
                                let result = await UsersSchema.findOne({userID: User.userID})
                                if(!result) {
                                    await new UsersSchema({userID: User.userID, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                                    result = await UsersSchema.findOne({userID: User.userID})
                                }
                                const Reservations = Array.from(result.reservations)
                                RemoveFromArray(Reservations, Reservation)
                                await UsersSchema.findOneAndUpdate({userID: User.userID}, {reservations: Reservations})
                            } finally {}
                        })
                    }
                })

            // } else if("18:30" == TimeFormat) { // Terminales
            } else if("20:18" == TimeFormat) { // Terminales
                console.log(TimeFormat+": Terminales")

                let Users
                await mongo().then(async (mongoose) => { // Get Users
                    try {
                        const Documents = await UsersSchema.find({})
                        const Sorted = new Array()
                        Documents.forEach(Document => {
                            if(Document.class == "Term") Sorted.push(Document)
                        })
                        Users = Sorted
                    } finally {}
                })
                console.log(Users)
                Users.forEach(async User => {
                    const Reservation = User.reservations.find(reservation => reservation.date == DateFormat)
                    // console.log(Reservation)
                    if(Reservation && User.login && User.password) {
                        // console.log(User)
                        const Output = await Reserve(User.login, User.password, Reservation.restaurant)
                        console.log(Output)
                        await mongo().then(async (mongoose) => {
                            try {
                                let result = await UsersSchema.findOne({userID: User.userID})
                                if(!result) {
                                    await new UsersSchema({userID: User.userID, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                                    result = await UsersSchema.findOne({userID: User.userID})
                                }
                                const Reservations = Array.from(result.reservations)
                                RemoveFromArray(Reservations, Reservation)
                                await UsersSchema.findOneAndUpdate({userID: User.userID}, {reservations: Reservations})
                            } finally {}
                        })
                    }
                })

            } else if("19:00" == TimeFormat) { // 1ères
                console.log(TimeFormat+": 1ères")

                let Users
                await mongo().then(async (mongoose) => { // Get Users
                    try {
                        const Documents = await UsersSchema.find({})
                        const Sorted = new Array()
                        Documents.forEach(Document => {
                            if(Document.class == "1ère") Sorted.push(Document)
                        })
                        Users = Sorted
                    } finally {}
                })
                console.log(Users)
                Users.forEach(async User => {
                    const Reservation = User.reservations.find(reservation => reservation.date == DateFormat)
                    // console.log(Reservation)
                    if(Reservation && User.login && User.password) {
                        // console.log(User)
                        const Output = await Reserve(User.login, User.password, Reservation.restaurant)
                        console.log(Output)
                        await mongo().then(async (mongoose) => {
                            try {
                                let result = await UsersSchema.findOne({userID: User.userID})
                                if(!result) {
                                    await new UsersSchema({userID: User.userID, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                                    result = await UsersSchema.findOne({userID: User.userID})
                                }
                                const Reservations = Array.from(result.reservations)
                                RemoveFromArray(Reservations, Reservation)
                                await UsersSchema.findOneAndUpdate({userID: User.userID}, {reservations: Reservations})
                            } finally {}
                        })
                    }
                })

            } else if("19:30" == TimeFormat) { // 2ndes
                console.log(TimeFormat+": 2ndes")

                let Users
                await mongo().then(async (mongoose) => { // Get Users
                    try {
                        const Documents = await UsersSchema.find({})
                        const Sorted = new Array()
                        Documents.forEach(Document => {
                            if(Document.class == "2nde") Sorted.push(Document)
                        })
                        Users = Sorted
                    } finally {}
                })
                console.log(Users)
                Users.forEach(async User => {
                    const Reservation = User.reservations.find(reservation => reservation.date == DateFormat)
                    // console.log(Reservation)
                    if(Reservation && User.login && User.password) {
                        // console.log(User)
                        const Output = await Reserve(User.login, User.password, Reservation.restaurant)
                        console.log(Output)
                        await mongo().then(async (mongoose) => {
                            try {
                                let result = await UsersSchema.findOne({userID: User.userID})
                                if(!result) {
                                    await new UsersSchema({userID: User.userID, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                                    result = await UsersSchema.findOne({userID: User.userID})
                                }
                                const Reservations = Array.from(result.reservations)
                                RemoveFromArray(Reservations, Reservation)
                                await UsersSchema.findOneAndUpdate({userID: User.userID}, {reservations: Reservations})
                            } finally {}
                        })
                    }
                })

            }
        }
    }, 1000)
    
}
