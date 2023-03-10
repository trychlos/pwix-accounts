/*
 * pwix:accounts/src/client/components/ac_signup/ac_signup.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
 */

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import '../ac_input_email/ac_input_email.js';
import '../ac_input_password/ac_input_password.js';
import '../ac_input_username/ac_input_username.js';
import '../ac_mandatory_footer/ac_mandatory_footer.js';
import '../ac_twice_passwords/ac_twice_passwords.js';

import './ac_signup.html';

Template.ac_signup.onCreated( function(){
    const self = this;
    console.log( 'onCreated', this, Template.currentData());

    self.AC = {
        emailOk: new ReactiveVar( true ),
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true ),
        usernameOk: new ReactiveVar( true ),

        // submit button
        submitBtn: null,

        haveEmailAddress(){
            return pwiAccounts.opts().haveEmailAddress() !== AC_FIELD_NONE;
        },
        haveUsername(){
            return pwiAccounts.opts().haveUsername() !== AC_FIELD_NONE;
        },
        resetInput(){
            self.$( '.ac-input-password' ).trigger( 'ac-reset-input' );
            if( self.AC.haveEmailAddress()){
                self.$( '.ac-input-email' ).trigger( 'ac-reset-input' );
            }
            if( self.AC.haveUsername()){
                self.$( '.ac-input-username' ).trigger( 'ac-reset-input' );
            }
            self.$( 'input' ).first().focus();
        }
    };

    // check that requester is a acUserLoginCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acUserLoginCompanion )){
            throw new Error( 'expected acUserLoginCompanion, found', requester );
        }
    });
});

Template.ac_signup.onRendered( function(){
    const self = this;

    self.AC.submitBtn = self.$( '.ac-signup' ).closest( '.acUserLogin' ).find( '.ac-submit' );
    this.AC.resetInput();

    self.autorun(() => {
        self.AC.submitBtn.prop( 'disabled', !self.AC.emailOk.get() || !self.AC.passwordOk.get() || !self.AC.twiceOk.get() || !self.AC.usernameOk.get());
    });
});

Template.ac_signup.helpers({
    // error message
    errorMsg(){
        // even if we have no message at all, we keep at least one blank line
        return pwiAccounts.DisplayManager.errorMsg();
    },

    // whether email address is permitted
    haveEmailAddress(){
        return Template.instance().AC.haveEmailAddress();
    },

    // whether username is permitted
    haveUsername(){
        return Template.instance().AC.haveUsername();
    },

    // parameters for the password input
    parmTwice(){
        return {
            requester: this.requester,
            role: 'signup'
        };
    },

    // the text at the first place of the section (if username)
    textOne(){
        return this.requester.opts().signupTextOne();
    },

    // the text at the second place of the section (if email)
    textTwo(){
        return this.requester.opts().signupTextTwo();
    },

    // the text at the third place of the section
    textThree(){
        return this.requester.opts().signupTextThree();
    },

    // the text at the fourth place of the section
    textFour(){
        return this.requester.opts().signupTextFour();
    }
});

Template.ac_signup.events({
    // message sent by the input email component
    'ac-email-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-email-data', data );
        instance.AC.emailOk.set( data.ok );
    },

    // message sent by the input password component
    //  NB: happens that data arrives undefined :( see #24
    'ac-password-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-password-data', data );
        instance.AC.passwordOk.set( data ? data.ok : false );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.twiceOk.set( data ? data.ok : false );
    },

    // message sent by the input username component
    'ac-username-data .ac-signup'( event, instance, data ){
        //console.log( 'ac-username-data', data );
        instance.AC.usernameOk.set( data.ok );
    },

    // message sent from acUserLogin after having successfully created a new user
    //  clear the input fields to prepare the creation of another account
    'ac-clear .ac-signup'( event, instance ){
        instance.AC.resetInput();
        return false;
    }
});
