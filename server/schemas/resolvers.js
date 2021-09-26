const { User } = require('../models');
const { signToken } = require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

//Creating queries and mutations
const resolvers = {
    //Queries are used to fetch data 
    //Equivalent to GET requests
    Query: {
        me: async(parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({_id: context.user._id})
                .select('-_v -password')

                return userData;
            }

            throw new AuthenticationError('You are not logged in');
        
        }
    },

//Mutations are used to modify server-side data
//Equivalent to DELETE, PUT, PATCH requests
    Mutation: {
        login: async(parent, { email, password }) => {
        //Find user by email
            const user = await User.findOne({ email });
            //if wrong email send error
            if(!user) {
                throw new AuthenticationError('Incorrect email');
            }
            const correctPassword = await user.isCorrectPassword(password);
//Checking if password is correct if not send error
            if(!correctPassword) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user);
            return { token, user };
        },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { input }, context) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: input }},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in');
        },

        removeBook: async (parent, args, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user.id },
                    { $pull: { savedBooks: { bookId: args.bookId }}},
                    { new: true }
                );
                return updatedUser;
            }
            throw new AuthenticationError('You must be logged in');
        }
    }
};

module.exports = resolvers;