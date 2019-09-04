import $ from "jquery";
import bootstrap from "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import css from '../css/main.css';
import _ from 'lodash';

$(document).ready(function(){
    let login = new LoginForm(new MockService());
    login.setEmail("");

    $("#inputEmail").on("change paste keyup", function() {
        login.setEmail($(this).val());
    });

    $("#inputPassword").on("change paste keyup", function() {
        login.setPassword($(this).val());
    });

    $("#icon-check-password").click(function(){
        login.changeCheckPassword();
    });

    $("#login").click('click', function (event) {
        login.submit();
        event.preventDefault();
    });
});

function LoginForm(service) {
    const iconEmail = $('#icon-email');
    const lineEmail = $('#line-email');
    const iconCheckEmail = $('#icon-check-email');
    const iconPassword = $('#icon-password');
    const linePassword = $('#line-password');
    const iconCheckPassword = $('#icon-check-password');
    const inputPassword = $('#inputPassword');
    const buttonLogin = $('#login');
    const loginTitle = $('#login-title');

    this.email = "";
    this.password = "";
    this.okEmail = false;
    this.showPassword = false;
    this.validate = false;
    this.service = service;

    this.setEmail = function (email) {
        iconCheckEmail.removeClass('icon-error');
        iconCheckEmail.children('i').removeClass('fa-times');
        iconCheckEmail.children('i').addClass('fa-check');
        this.email = email;
        if(this.email) {
            this.okEmail = validateEmail(this.email);
            iconEmail.addClass('icon-enabled');
            iconCheckEmail.css('visibility', this.okEmail ? 'visible' : 'hidden');
        } else {
            iconEmail.removeClass('icon-enabled');
            iconCheckEmail.css('visibility', 'hidden');
        }

        if(this.okEmail) {
            changeClass(lineEmail,['validate-line-error', 'validate-line-ok2'], 'validate-line-ok');
        } else {
            changeClass(lineEmail,['validate-line-ok', 'validate-line-ok2', 'validate-line-error'], '');
        }

        this.changeState();
    };

    this.setPassword = function (password) {
        linePassword.removeClass('validate-line-error');
        this.password = password;
        if(this.password) {
            iconPassword.addClass('icon-enabled');
        } else {
            iconPassword.removeClass('icon-enabled');
        }

        this.changeState();
    };

    this.changeState = function () {
        if(this.password) {
            if(this.showPassword) {
                changeClass(linePassword,['validate-line-error', 'validate-line-ok2'], 'validate-line-ok2');
            } else {
                changeClass(linePassword,['validate-line-ok', 'validate-line-error'], 'validate-line-ok');
            }
        }

        this.validate = this.okEmail && this.password;
        if(this.validate) {
            changeClass(buttonLogin,['btn-disabled'], 'btn-enabled');
        } else {
            changeClass(buttonLogin,['btn-enabled'], 'btn-disabled');
        }

        buttonLogin.prop("disabled", !this.validate);
    };

    this.changeCheckPassword = function () {
        this.showPassword = ! this.showPassword;
        if(this.showPassword) {
            iconCheckPassword.addClass('icon-enabled');
            inputPassword.attr("type", "text");
        } else {
            iconCheckPassword.removeClass('icon-enabled');
            inputPassword.attr("type", "password");
        }
    };

    this.submit = function () {
        if(this.validate) {
            this.service.login(this.email, this.password)
                .then(value => {
                    this.ok();
                    console.log(value);
                })
                .catch(errorCode => {
                    if(errorCode === 1) {
                        this.wrongEmail();
                    } else if(errorCode === 2) {
                        this.wrongPassword();
                    }

                    console.log('Errorcode = ' + errorCode);
                })
        }
    };

    this.wrongEmail = function () {
        inputPassword.val("");
        this.setPassword("");
        changeClass(lineEmail,['validate-line-ok', 'validate-line-ok2'], 'validate-line-error');
        changeClass(buttonLogin,['btn-enabled'], 'btn-error');
        iconCheckEmail.css('visibility','visible');
        iconCheckEmail.addClass('icon-error');
        iconCheckEmail.children('i').removeClass('fa-check');
        iconCheckEmail.children('i').addClass('fa-times');
        buttonLogin.text("Retry");
        loginTitle.text("Oops!")
    };

    this.wrongPassword = function () {
        changeClass(linePassword,['validate-line-ok', 'validate-line-ok2'], 'validate-line-error');
        changeClass(lineEmail,['validate-line-error', 'validate-line-ok'], 'validate-line-ok2');
        changeClass(buttonLogin,['btn-enabled'], 'btn-error');
        buttonLogin.text("Retry");
        loginTitle.text("Wrong Password");
    };

    this.ok = function () {
        changeClass(linePassword,['validate-line-ok', 'validate-line-error'], 'validate-line-ok2');
        changeClass(buttonLogin,['btn-enabled', 'btn-error'], 'btn-disabled');
        changeClass(lineEmail,['validate-line-ok', 'validate-line-error'], 'validate-line-ok2');
        buttonLogin.text("Login");
        loginTitle.text("Successful Login");
        buttonLogin.prop("disabled", true);
    };

    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function changeClass(el, arrRemovedClass, addClass) {
        arrRemovedClass.forEach(function(className) {
            el.removeClass(className);
        });

        if(addClass) {
            el.addClass(addClass);
        }
    }
}

function MockService() {

    this.login = function (email, password) {
        const promise = new Promise((resolve, reject) => {
            setTimeout(function() {
                if(email === 'test@gmail.com') {
                    if(password === '123456') {
                        resolve("Success!");
                    } else {
                        reject(2)
                    }
                } else {
                    reject(1)
                }

            }, 250);
        });

        return promise;
    }
}


