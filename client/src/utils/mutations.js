import gql from 'graphql-tag';

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email:$email, password:$password) {
            token
            user {
                _id
                username
                email
            }
        }
    }
`;

export const LOGIN = gql`
    mutation login($email:String!, $password: String!) {
        login(email:$email, password:$password) {
            token
            user {
                _id
                email
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($input: bookInput!) {
        saveBook(input: $input) {
            _id
            username
            email
            savedBooks {
                title
                description
                bookId
                authors
                image
                title
                link
            }
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook( $bookId: String!) {
        removeBook( bookId: $bookId) {
            _id 
            username
            email
            bookCount
            savedBooks {
                bookId
                title
                description
                authors
                image
                link
            }
        }
    }
`;

