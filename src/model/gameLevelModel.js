import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(Date.now() + istOffset);
}

const userGameDataSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    gameLevel: {
        type: Number,
        default: 1
    },
    gridSize: {
        type: String,
        default: 6
    }
}, {
    timestamps: {
        currentTime: () => getISTTime()
    }
});

userGameDataSchema.index({ user: 1, game: 1 }, { unique: true });

const UserGameData = mongoose.models.UserGameData || mongoose.model('UserGameData', userGameDataSchema);

export default UserGameData;