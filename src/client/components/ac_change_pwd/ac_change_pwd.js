/*
 * pwix:accounts/src/client/components/ac_change_pwd/ac_change_pwd.js
 * 
 * Parms:
 *  - requester: the acUserLoginCompanion object
 */
import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import { acUserLoginCompanion } from '../../classes/ac_user_login_companion.class.js';

import '../ac_input_password/ac_input_password.js';

import './ac_change_pwd.html';

Template.ac_change_pwd.onCreated( function(){
    const self = this;

    self.AC = {
        passwordOk: new ReactiveVar( true ),
        twiceOk: new ReactiveVar( true )
    };

    // check that requester is a acUserLoginCompanion
    self.autorun(() => {
        const requester = Template.currentData().requester;
        if( requester && !( requester instanceof acUserLoginCompanion )){
            throw new Error( 'expected acUserLoginCompanion, found', requester );
        }
    });
});

Template.ac_change_pwd.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const btn = self.$( '.ac-change-pwd' ).closest( '.acUserLogin' ).find( '.ac-submit' );
        btn.prop( 'disabled', !self.AC.passwordOk.get() || !self.AC.twiceOk.get());
    });
});

Template.ac_change_pwd.helpers({
    // error message
    errorMsg(){
        return pwiAccounts.DisplayManager.errorMsg();
    },

    // parameters for the password input
    parmTwice(){
        return {
            requester: this.requester,
            role: 'change'
        };
    },

    // params to old password
    labelOld(){
        return {
            label: i18n.label( AC_I18N, 'change_pwd.old_label' )
        }
    },

    // the text before the old password
    textOne(){
        return this.requester.opts().changePwdTextOne();
    },

    // the text between old and new passwords
    textTwo(){
        return this.requester.opts().changePwdTextTwo();
    },

    // the text after new passwords
    textThree(){
        return this.requester.opts().changePwdTextThree();
    }
});

Template.ac_change_pwd.events({
    // message sent by the input password component
    //  NB: happens that data arrives undefined :( see #24
    'ac-password-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-password-data', data );
        instance.AC.passwordOk.set( data ? data.ok : false );
    },

    // message sent by the twice passwords component
    'ac-twice-data .ac-change-pwd'( event, instance, data ){
        //console.log( 'ac-twice-data', data );
        instance.AC.twiceOk.set( data ? data.ok : false );
    }
});
