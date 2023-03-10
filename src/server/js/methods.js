/*
 * pwix:accounts/src/server/js/methods.js
 */
import { Accounts } from 'meteor/accounts-base';

_cleanUser = function ( user ){
    if( user ){
        if( user.services ){
            delete user.services.resume;
            if( user.services.password ){
                delete user.services.password.bcrypt;
            }
        }
        delete user.profile;
    }
    console.log( user );
    return user;
};

Meteor.methods({
    // All pwiAccounts.byXxxx methods return a user object without the crypted password nor the profile

    // find a user by his email address
    'pwiAccounts.byEmailAddress'( email ){
        console.log( 'pwiAccounts.byEmailAddress' );
        return _cleanUser( Accounts.findUserByEmail( email ));
    },

    // find a user by his internal (mongo) identifier
    'pwiAccounts.byId'( id ){
        console.log( 'pwiAccounts.byId' );
        return _cleanUser( Meteor.users.findOne({ _id: id }));
    },

    // find the user who holds the given reset password token
    'pwiAccounts.byResetToken'( token ){
        console.log( 'pwiAccounts.byResetToken' );
        return _cleanUser( Meteor.users.findOne({ 'services.password.reset.token': token },{ 'services.password.reset': 1 }));
    },

    // find a user by his username
    'pwiAccounts.byUsername'( username ){
        console.log( 'pwiAccounts.byUsername' );
        return _cleanUser( Accounts.findUserByUsername( username ));
    },

    // find the user who holds the given email verification token
    'pwiAccounts.byEmailVerificationToken'( token ){
        console.log( 'pwiAccounts.byEmailVerificationToken' );
        return _cleanUser( Meteor.users.findOne({ 'services.email.verificationTokens': { $elemMatch: { token: token }}},{ 'services.email':1 }));
    },

    // create a user without auto login
    // https://docs.meteor.com/api/passwords.html#Accounts-createUser
    // called on the server, this methods returns the new account id
    'pwiAccounts.createUser'( options ){
        return Accounts.createUser( options );
    },

    // send a mail with a verification link
    //  the returned object has:
    //  - email
    //  - user { _id, services.email, emails }
    //  - token
    //  - url
    //  - options
    'pwiAccounts.sendVerificationEmail'( id ){
        return Accounts.sendVerificationEmail( id );
    }
});
