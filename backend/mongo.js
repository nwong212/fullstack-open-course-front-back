const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://nathan:${password}@fullstackopen.fw0cwvf.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstackopen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

// j3HgTDmbdbM1LF1b

// MONGODB_URI="mongodb+srv://nathan:j3HgTDmbdbM1LF1b@fullstackopen.fw0cwvf.mongodb.net/noteApp?retryWrites=true&w=majority&appName=fullstackopen" npm run dev

const Note = mongoose.model('Note', noteSchema)

// const note = new Note({
//   content: 'HTML is easy',
//   important: true,
// })

Note.find({important: false}).then(result => {
  result.forEach(note => {
    console.log(note)
  })
  mongoose.connection.close()
})

// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })