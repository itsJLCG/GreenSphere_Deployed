const mongoose = require("mongoose"); 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    role: {
        type: String,
        enum: ["user", "admin"], // Restricts role values
        default: "user" // Sets default role
    },
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;