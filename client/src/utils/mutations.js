import gql from 'graphql-tag';

export const ADD_USER = gql`
	mutation addUser($username: String!, $email: String!, $password: String!) {
		addUser(username: $username, email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const LOGIN_USER = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			token
			user {
				_id
				username
			}
		}
	}
`;

export const SAVE_BOOK = gql`
	mutation saveBook(
		$authors: [String!]
		$description: String
		$bookId: ID!
		$image: String
		$link: String
		$title: String!
	) {
		saveBook(authors: $authors, description: $description, bookId: $bookid, image: $image, link: $link, title: $title) {
			user {
				_id
				username
				savedBooks
			}
		}
	}
`;

export const REMOVE_BOOK = gql`
	mutation removeBook($bookId: ID!) {
		removeBook(bookid: $bookId) {
			user {
				_id
				username
				savedBooks
			}
		}
	}
`;