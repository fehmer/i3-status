# Guide to custom modules


## Table of content
<!-- MarkdownTOC -->

- [Using third party modules](#using-third-party-modules)
  - [Example](#example)
  - [known modules](#known-modules)
- [Developing a custom module](#developing-a-custom-module)
  - [local module](#local-module)

<!-- /MarkdownTOC -->


## Using third party modules

If you installed i3-status as a dependency you can add third party modules as dependencies too with ```npm install --save <module-name>```. In the [configuration](./configuration.md) define  ```module: <module-name>```. If your module is prefixed with a namespace use ```module: @<namespace>/<module-name>```.


### Example

This example installs the module *i3-status-starter* and adds it to your i3-bar.

``` sh
cd ~/my-i3-status # go to the directory containing your i3-status installation and config file
npm install --save i3-status-starter
```

Add this to your config.yml:

``` yaml
blocks:
  - name: starter
    module: i3-status-starter
    text: 'Hello from starter'
```

Restart i3 or reload the config. The default key combination is *WIN+Shift+r* or *ALT+Shift+r*.


### known modules

- [i3-status-gitlab](https://www.npmjs.com/package/i3-status-gitlab). Show build status of projects using gitlab ci.
- [i3-status-starter](https://www.npmjs.com/package/i3-status-starter). This example module just prints a static text.
- [Search npm](https://www.npmjs.com/search?q=i3-status-module) for available modules


## Developing a custom module

Custom modules can be added to the configuration as a local or a published module. During development including your code as a local module is most practical. When you are pleased with the functionality of your module please take some time to document it and publish it as a npm module. Its quite simple and others may enjoy your module too. Use ```i3-status-module``` as a keyword to help others to find your module.


An i3-status module is runnable nodejs code. You can develop the module in javascript, coffeescript, typescript etc but publish it as javascript code. The [i3-status-starter](https://github.com/fehmer/i3-status-starter) uses es2015 syntax and [babel](https://babeljs.io/) to generate node6 compatible javascript.


The [i3-status-starter](https://github.com/fehmer/i3-status-starter) provides example code and the documentation how to write your own module. 


### local module

You can use a local module by defining the ```.js``` file as the module, e.g.

```yml
 - name: local
   module: /home/<yourname>/workspace/test/index.js
```


