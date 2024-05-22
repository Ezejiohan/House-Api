const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE).then(() => {
    console.log('connected to MongoDB successfully')
}).catch((err) => {
    console.log(err.message)
});