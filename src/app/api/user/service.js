"use server";
import dbConnect from "@/db/db";
import User from "@/db/models/User";


export async function getOneUserById(userId) {
    try {
        await dbConnect();
        const user = await User.findById(userId);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function getOneUserByEmail(email) {
    try {
        await dbConnect();
        const user = await User
            .findOne({ email })
            .select('-password');
        return user;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateUser(userId, data) {
    try {
        await dbConnect();
        const user = await User.findByIdAndUpdate(userId, data, { new: true });
        return user;
    }
    catch (error) {
        console.error(error);
        return null;
    }
}

export async function getAllUsers() {
    try {
        await dbConnect();
        const users = await User.find({});
        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function createUser(data) {
    try {
        await dbConnect();
        const user = await User.create(data);
        return user;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function deleteUser(userId) {
    try {
        await dbConnect();
        await User.findByIdAndDelete(userId);
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}