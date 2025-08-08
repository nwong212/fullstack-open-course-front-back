const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI_PHONEBOOK

console.log('CONNECTING to', url)
mongoose.connect(url)
    .then(result => {
        console.log('CONNECTED to MongoDB')
    })
    .catch(error => {
        console.log('ERROR connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v) {
                return /(\d{2}|\d{3})-\d{5,}/.test(v);
            },
            message: props => `${props.value} is not a valid number entry.`
        },
        required: true,
        minLength:8
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)