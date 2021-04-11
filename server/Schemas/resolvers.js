const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
	Query: {
		me: async (parent, args, context) => {
			if (context.user) {
				const userData = await User.findById(context.user._id).select('-__v -password');
				return userData;
			}
			throw new AuthenticationError('not logged in');
		},
	},
	Mutation: {
		login: async (parent, args) => {
			const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email }] });
			if (!user) throw new AuthenticationError('Incorrect username/email or password');

			const correctPw = await user.isCorrectPassword(args.password);

			if (!correctPw) throw new AuthenticationError('Incorrect username/email or password');

			const token = signToken(user);
			return { token, user };
		},
		addUser: async (parent, args) => {
			const userData = await User.create(args);
			const token = signToken(userData);
			return { token, userData };
		},
		saveBook: async (parent, args, context) => {
			if (!context.user) throw new AuthenticationError('not logged in');

			try {
				const updatedUser = await User.findByIdAndUpdate(
					context.user._id,
					{ $addToSet: { savedBooks: args } },
					{ new: true, runValidators: true }
				);
				return updatedUser;
			} catch (err) {
				console.error(err);
			}
		},
		removeBook: async (parent, args, context) => {
			if (!context.user) throw new AuthenticationError('not logged in');

			try {
				const updatedUser = await User.findByIdAndUpdate(
					context.user._id,
					{ $pull: { savedBooks: { bookId: args.bookId } } },
					{ new: true, runValidators: true }
				);
				return updatedUser;
			} catch (err) {
				console.error(err);
			}
		},
	},
};
