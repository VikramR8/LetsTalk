import jwt from "jsonwebtoken";
import User from "../models/UserModels.js";
import { compare } from "bcrypt";
import{renameSync, unlinkSync} from "fs"

const maxAge = 7 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
})};
//SIGNUP
export const signup = async (req, res) => {
try {
    const { email, password } = req.body;
    if (!email || !password)
    return res.status(400).send("Email and Password required.");
    const user = await User.create({ email, password });
    res.cookie("jwt", createToken(email, user.id), {
    maxAge,
    secure: true,
    sameSite: "None",
    });
    return res.status(201).json({
    user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
    },
    });
} catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
}
};
//LOGIN
export const login = async (req, res) => {
try {
    const { email, password } = req.body;
    if (!email || !password)
    return res.status(400).send("Email and Password required.");

    const user = await User.findOne({ email });
    if (!user) {
    return res.status(404).send("User with given email was not found");
    }
    const auth = await compare(password, user.password);
    if (!auth) {
    return res.status(400).send("Password is incorrect");
    }
    res.cookie("jwt", createToken(email, user.id), {
    maxAge,
    secure: true,
    sameSite: "None",
    });
    return res.status(201).json({
    user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
    },
    });
} catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
}
};

//GET USER DATA
export const getUserInfo = async (req, res) => {
try {
    const userData = await User.findById(req.userId);
    if (!userData) {
    return res.status(404).send("User with given email was not found");
    }
    return res.status(201).json({
    id: userData.id,
    email: userData.email,
    profileSetup: userData.profileSetup,
    firstName: userData.firstName,
    lastName: userData.lastName,
    image: userData.image,
    color: userData.color,
    });
} catch (error) {
    console.log({ error });
    return res.status(500).send("Internal Server Error");
}
};
//UPDATE PROFILE
export const updateprofile = async (req, res) => {
    try {
        const { userId } = req;
        console.log(userId)
        const { firstName, lastName } = req.body;

        if (!firstName || !lastName) {
            return res.status(400).send("First Name and Last Name are required");
        }

        const userData = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, profileSetup: true },
            { new: true, runValidators: true }
        );

        if (!userData) {
            return res.status(404).send("User not found");
        }

        return res.status(201).json({
            id: userData.id,
            email: userData.email,
            profileSetup: userData.profileSetup,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
        });
    } catch (error) {
        console.error("Error in updateprofile:", error);
        res.status(500).send("Server error");
    }
};
//ADD IMAGE
export const addProfileImage = async (req, res) => {
    try {
        if(!req.file){
            return res.status(400).send("Picture is required");
        }
        const date= Date.now()
        let fileName="/uploads/profiles/"+date+req.file.originalname
        renameSync(req.file.path, fileName)

        const updatedUser= await User.findByIdAndUpdate(req.userId, {image:fileName}, {new:true},{runValidators:true})
        return res.status(201).json({
            image:updatedUser.image,
        });
    } catch (error) {
        console.error("Error in updateprofile:", error);
        res.status(500).send("Server error");
    }
};
//DELETE IMAGE
export const deleteProfileImage = async (req, res) => {
    try {
        const {userId}= req
        const user= await User.findById(userId)
        if(!user)
        {
            return res.status(404).send("User not found")
        }
        if (user.image) {
            try {
                unlinkSync(user.image);
            } catch (fileError) {
                console.error("Error removing image file:", fileError);
                return res.status(500).send("Failed to delete image file");
            }
        }
        user.image=null
        await user.save()
        return res.status(201).send("Image removed successfully")
    } catch (error) {
        console.error("Error in updateprofile:", error);
        res.status(500).send("Server error");
    }}
