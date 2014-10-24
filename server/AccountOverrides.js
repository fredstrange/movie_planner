
var origLoginFacebook = Meteor.loginWithFacebook;
Meteor.loginWithFacebook = function (options, cb) {
    if (insideUIWebView) {
        origLoginFacebook(_.extend(options, { loginStyle: "redirect" }), cb);
    } else {
        origLoginFacebook(options, cb);
    }
};

var origLoginTwitter = Meteor.loginWithTwitter;
Meteor.loginWithTwitter = function (options, cb) {
    if (insideUIWebView) {
        loginWithTwitter(_.extend(options, { loginStyle: "redirect" }), cb);
    } else {
        origLoginTwitter(options, cb);
    }
};

var origLoginGoogle = Meteor.loginWithGoogle;
Meteor.loginWithGoogle = function (options, cb) {
    if (insideUIWebView) {
        origLoginGoogle(_.extend(options, { loginStyle: "redirect" }), cb);
    } else {
        origLoginGoogle(options, cb);
    }
};