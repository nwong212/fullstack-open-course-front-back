const mongoose = require('mongoose')

if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const [ , , password, name, number ] = process.argv

const url = `mongodb+srv://nathan:${password}@fullstackopen.fw0cwvf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3) {

    Person.find({}).then(result => {
        console.log('phonebook:')
        
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        
        mongoose.connection.close()
    })

}

if(process.argv.length > 3) {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`Added ${result.name} number ${result.number} to phonebook.`)
        mongoose.connection.close()
    })
}