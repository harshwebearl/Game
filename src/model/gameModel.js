import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const gameSchema = new mongoose.Schema({
   gameName: {
    type: String,
    required: true
   },
}, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const Game = mongoose.model('Game', gameSchema);

export default Game;