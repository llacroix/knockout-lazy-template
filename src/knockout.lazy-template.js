/*
===============================================================================
    Author:     Loïc Faure-Lacroix loicfl@gmail.com
    License:    MIT (http://opensource.org/licenses/mit-license.php)

    Description: Lazy template loading  Library for KnockoutJS
===============================================================================
*/

/*jshint
    sub:true,
    curly: true,eqeqeq: true,
    immed: true,
    latedef: true,
    newcap: true,
    noarg: true,
    sub: true,
    undef: true,
    boss: true,
    eqnull: true,
    browser: true
*/

/*globals
    jQuery: false,
    require: false,
    exports: false,
    define: false,
    ko: false
*/

(function (factory) {
    // Module systems magic dance.

    if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
        // CommonJS or Node: hard-coded dependency on "knockout"
        factory(require("knockout"), exports);
    } else if (typeof define === "function" && define["amd"]) {
        // AMD anonymous module with hard-coded dependency on "knockout"
        define(["knockout", "exports"], factory);
    } else {
        // <script> tag: use the global `ko` object, attaching a `mapping` property
        factory(ko, ko.lazyTemplate = {});
    }
}(function ( ko, exports ) {

    if (typeof (ko) === undefined) { throw 'Knockout is required, please ensure it is loaded before loading this validation plug-in'; }
    
    var lazyTemplate,
        loader = function (templateName, callback) {
            callback(' ');
        },
        appendEmptyTemplate,
        getTemplate,
        getTemplateId;

    getTemplateId = function (name) {
        return 'ko-lazy-' + name;
    };

    appendTemplate = function (name, data) {
        name = getTemplateId(name);

        var scriptTag = document.createElement('script'),
            head = document.getElementsByTagName('head')[0];

        scriptTag.id  = name;
        scriptTag.type = "text/html";
        scriptTag.innerHTML = data;

        head.appendChild(scriptTag);
    };

    getTemplate = function (name) {
        return function () {
            var loaded = ko.observable(false),
                templateId = getTemplateId(name),
                template = document.getElementById(templateId);

            if (template) {
                loaded(true);
            } else {
                loader(name, function (data) {
                    appendTemplate(name, "\n" + data);

                    loaded(true);
                });
            }

            return ko.computed(function () {
                if (loaded()) {
                    return templateId;
                } else {
                    return getTemplateId('empty');
                }
            })();
        };
    };


    lazyTemplate = {
        init:  function(a, b, c, d, e) {
            var name = getTemplate(b());
            var obj = ko.observable({
                name: name,
                data: d
            });
            return ko.bindingHandlers.template.init(a, obj);
        },
        update: function(a, b, c, d, e) {
            var name = getTemplate(b());
            var obj = ko.observable({
                name: name,
                data: d
            });
            return ko.bindingHandlers.template.update(a, obj, c, d, e);
        }
    };


    exports.init = function (opts) {
        if (opts.loader) {
            loader = opts.loader;
        }

        appendTemplate('empty', ' ');

        ko.bindingHandlers['lazy-template'] = lazyTemplate;
        ko.virtualElements.allowedBindings['lazy-template'] = true;
    };
}))
