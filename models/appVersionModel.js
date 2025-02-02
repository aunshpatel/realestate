import mongoose from "mongoose";

const appVersionSchema = new mongoose.Schema({
    currentVersion: {
        type: String, 
        required: true,
    },
});

const AppVersion = mongoose.model('AppVersion', appVersionSchema);

export default AppVersion;