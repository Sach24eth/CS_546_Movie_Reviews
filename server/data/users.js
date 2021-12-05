const mongoCollection = require("../config/mongoCollection");
const {
    isValidUsername,
    isValidPassword,
    isValidString,
    isValidEmail,
    defaultNewUser,
    isValidObject,
    isValidPicture,
    saltRounds,
    isValidObjectId,
} = require("../utils");
const bcrypt = require("bcrypt");
const users = mongoCollection.users;
const products = mongoCollection.products;
const reviews = mongoCollection.reviews;
const { ObjectId } = require("mongodb");

module.exports = {
    async createUser(name, email, password) {
        isValidString(name, "username");
        isValidString(email, "email");
        isValidString(password, "password");
        name = name.toLowerCase().trim();
        email = email.toLowerCase().trim();
        password = password.trim();
        isValidUsername(name);
        isValidEmail(email);
        isValidPassword(password);
        const userCollection = await users();
        userCollection.createIndex({ email: 1 }, { unique: true });
        const userData = await userCollection.findOne({ email });
        if (userData) {
            throw "User already exists";
        }
        const hash = await bcrypt.hash(password, saltRounds);

        const user = await userCollection.insertOne({
            name,
            email,
            password: hash,
            ...defaultNewUser,
        });
        if (user.insertedCount === 0)
            throw { message: "Unable to add user", code: 500 };
        return { userInserted: true };
    },

    async checkUser(email, password) {
        isValidString(email, "email");
        isValidString(password, "password");
        email = email.toLowerCase().trim();
        password = password.trim();
        isValidEmail(email);
        isValidPassword(password);
        const userCollection = await users();
        userCollection.createIndex({ email: 1 }, { unique: true });
        const user = await userCollection.findOne({ email });
        if (!user) throw "Either the email or password is invalid";
        const passwordCorrect = await bcrypt.compare(password, user.password);
        if (!passwordCorrect) throw "Either the email or password is invalid";
        return { authenticated: true, user };
    },

    async updateUser({ password, photo, name, email }) {
        // first check if user is there in the db
        const userCollection = await users();
        const user = await userCollection.findOne({ email });
        if (!user) throw "User does not exist";

        // get values for empty data
        name = name || user.name;
        email = email || user.email;
        photo = photo || user.photo;
        isValidString(name, "name", 1);
        isValidString(email, "email", 1);
        name = name.toLowerCase().trim();
        password = password.trim();
        email = email.toLowerCase().trim();
        isValidEmail(email);
        isValidUsername(name);
        if (password.length > 0) {
            isValidString(password, "password", 1);
            password = password.trim();
            isValidPassword(password);
        }
        photo && isValidString(photo, "photo", 1);
        // hash password before saving
        const hash = await bcrypt.hash(password, saltRounds);
        const updatedUserData = {
            password: password.length > 0 ? hash : user.password,
            photo: photo || user.photo,
            name: name || user.name,
        };

        // check if there's no change
        // if so then modified count will be 0
        // so instead of updating the user, we return the user
        if (
            updatedUserData.password === user.password &&
            updatedUserData.photo === user.photo &&
            updatedUserData.name === user.name
        ) {
            return { user, updated: true };
        }

        const updatedInfo = await userCollection.updateOne(
            { email: email },
            { $set: updatedUserData }
        );

        if (updatedInfo.modifiedCount === 0) {
            throw "Could not update the user data successfully";
        } else {
            const updatedUserFromDB = await userCollection.findOne({
                email: email,
            });
            return { updated: true, user: updatedUserFromDB };
        }
    },

    // get User from req.session
    async getUser(email) {
        isValidString(email, "email");
        email = email.toLowerCase().trim();
        isValidEmail(email);
        const userCollection = await users();
        const user = await userCollection.findOne({ email });
        if (!user) throw "User does not exist";
        return user;
    },
    async getUserById(id) {
        if (typeof id === "undefined") throw "id is not provided";
        if (typeof id != "string") throw "id is not a string";
        if (id.trim().length === 0) throw "id is an empty string";

        if (!ObjectId.isValid(id)) throw "id is not a valid objectId";

        let parsedId = ObjectId(id);
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: parsedId });
        if (user === null) throw "No User with that id is found.";

        return user;
    },
    async getReviewsByUserId(id) {
        if (typeof id === "undefined") throw "id is not provided";
        const user = await this.getUserById(id);

        return user.reviews;
    },
    async getLikedProductsByUser(id) {
        if (typeof id === "undefined") throw "id is not provided";
        const user = await this.getUserById(id);
        return user.liked_products;
    },

    async reportReview(userId, reviewId) {
        if (typeof userId === "undefined") throw "userId is not provided";
        if (typeof reviewId === "undefined") throw "reviewId is not provided";
        const user = await this.getUserById(id);
        const userCollection = await users();
        await userCollection.updateOne(
            {
                _id: userId,
            },
            {
                $push: { reportedReviews: reviewId },
            }
        );
    },

    async getUsersIfReported(userId) {
        if (typeof userId === "undefined") throw "userId is not provided";
        const userCollection = await users();
        const user = await userCollection.findOne({ _id: userId });
        if (!user) throw "User does not exist";
        if (user.isAdmin) throw "Cannot perform the requested action";
        const usersWithReportedActivities = await userCollection.find({
            reportedReviews: { $size: { $gt: 0 } },
        });
        return usersWithReportedActivities;
    },

    async deleteReportedReviews(reviewId) {
        isValidString(reviewId, "reviewId");
        reviewId = reviewId.trim();
        isValidObjectId(reviewId);
        const parsedId = ObjectId(reviewId);
        const userCollection = await users();
        const productCollection = await products();
        const reviewsCollection = await reviews();
        // delete the review from the review collection
        await reviewsCollection.deleteOne({ _id: parsedId });
        // delete the review from the product collection
        await productCollection.updateOne({}, { $pull: { reviews: reviewId } });

        // delete the review from the user collection
        await userCollection.updateOne({}, { $pull: { reviews: reviewId } });
    },
};
