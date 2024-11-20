import AppVersion from "../../models/appVersionModel.js";
import errorHandler from "../utils/error.js";

export const appVersionController = async (req, res) => {
    try {
        const version = await AppVersion.findOne();
        if (!version) return res.status(404).json({ message: "Version not found" });
        res.status(200).json({ mobileAppVersion: version.mobileAppVersion });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}