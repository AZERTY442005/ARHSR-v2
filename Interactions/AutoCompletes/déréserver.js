// ©2022 AZERTY. All rights Reserved | AZERTY#9999
const mongo = require('../../Functions/Mongo.js')
const UsersSchema = require("../../DataBase/schemas/users-schema")

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}


module.exports.execute = async function (interaction, bot, config) {
    await mongo().then(async (mongoose) => {
        try {
            let result = await UsersSchema.findOne({userID: interaction.user.id})
            if(!result) {
                await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
                result = await UsersSchema.findOne({userID: interaction.user.id})
            }
            console.log(result)

            let Réservations = new Array()
            result.reservations.forEach(reservation => {
                Réservations.push(`- **${reservation.date}**: __${capitalizeFirstLetter(reservation.restaurant)}__`)
            })

            console.log(Réservations)

            return Réservations
        } finally {}
    })
}
// console.log(module.exports)

// module.exports = {
//     name: "déréserver",
//     async execute(interaction, bot, config) {
//         await mongo().then(async (mongoose) => {
//             try {
//                 let result = await UsersSchema.findOne({userID: interaction.user.id})
//                 if(!result) {
//                     await new UsersSchema({userID: interaction.user.id, class:"", login:"", password:"", ChatReplying: false, reservations: []}).save()
//                     result = await UsersSchema.findOne({userID: interaction.user.id})
//                 }
//                 console.log(result)

//                 let Réservations = new Array()
//                 result.reservations.forEach(reservation => {
//                     Réservations.push(`- **${reservation.date}**: __${capitalizeFirstLetter(reservation.restaurant)}__`)
//                 })

//                 console.log(Réservations)

//                 return Réservations
//             } finally {}
//         })
//     }
// }
