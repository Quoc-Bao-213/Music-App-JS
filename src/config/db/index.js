const mongoose = require('mongoose');

async function connect() {
    try {
        const connection = await mongoose.connect(
            'mongodb://localhost:27017/music_player_dev',
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            },
        );

        console.log(
            `MongoDB Connected: ${connection.connection.host}`.rainbow.underline
                .bold,
        );
    } catch (error) {
        console.log(error);
    }
}

module.exports = { connect };
