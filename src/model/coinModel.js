import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const coinSchema = new mongoose.Schema({
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        coins: {
            type: Number,
            default: 50
        }
    }, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const Coin = mongoose.model('Coin', coinSchema);

export default Coin;