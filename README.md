Knockout lazy-template
======================


It is a small binding that lets you auto download templates
for knockoutjs. If your templates are located in a structured
way and you can let say get them by template name. Then this
plugin might be what you are looking for.




How to use:
===========

Load the file located in the folder src after loading `knockoutjs`. 

On any element and virtual element you can write something like this

    <div data-bind="lazy-template: 'reports', data: $data"></div>


In your code you'll have to call init before applying bindings with a 
loader function.

The loader function takes two parameters:

- name: name of the template
- callback: a callback function that returns the content of the template as text

You can init the plugin like this:

    ko.lazyTemplate.init({
        loader: function (name, callback){
            jQuery.get('/templates/' + name + '.html', callback);
        }
    });

In this example, we get the template with jQuery and send back the result to the
template. As long as the template isn't fetched, nothing will be displayed.
