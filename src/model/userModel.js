import mongoose from "mongoose";

function getISTTime() {
    const istOffset = 5.5 * 60 * 60 * 1000;
    const now = new Date();
    const istTime = new Date(now.getTime() + istOffset);
    return istTime;
}

const userSchema = new mongoose.Schema({
    userName: { 
        type: String, 
        required: true 
    },

    email : {
        type: String,
        required: true,
        unique: true,
    },
 
    registeredID: {
        type: Number,
        required: true,
    },

    photo : {
        type: String,
    },

    value1: { 
        type: String 
    },
    value2: { 
        type: String 
    },
    value3: { 
        type: String 
    },
    value4: { 
        type: String 
    },
    value5: { 
        type: String 
    },
    games: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    }],
}, 
{
    timestamps: {
        currentTime: () => getISTTime()
    }
});

const User = mongoose.model('User', userSchema);

export default User;