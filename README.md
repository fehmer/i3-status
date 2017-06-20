# i3-status

Highly customizable and extendable bar for the [i3 window manager](http://i3wm.org/). 

[![npm version](https://img.shields.io/npm/v/i3-status.svg?style=flat-square)](https://www.npmjs.com/package/i3-status)
[![Dependency Status](https://img.shields.io/gemnasium/fehmer/i3-status.svg?style=flat-square)](https://gemnasium.com/github.com/fehmer/i3-status)
[![Build Status](https://img.shields.io/travis/fehmer/i3-status.svg?style=flat-square)](https://travis-ci.org/fehmer/i3-status)
[![Codacy Badge](https://img.shields.io/codacy/grade/0c09c73671e349cfb73264d8f204820f.svg?style=flat-square)](https://www.codacy.com/app/fehmer/i3-status?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=fehmer/i3-status&amp;utm_campaign=Badge_Grade)
[![Codacy Badge](https://img.shields.io/codacy/coverage/0c09c73671e349cfb73264d8f204820f.svg?style=flat-square)](https://www.codacy.com/app/fehmer/i3-status?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=fehmer/i3-status&amp;utm_campaign=Badge_Coverage)


## Table of content
<!-- MarkdownTOC -->

- [About](#about)
  - [i3-status](#i3-status)
- [Quickstart](#quickstart)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [A note on security](#a-note-on-security)
    - [Enabling encryption in i3-status](#enabling-encryption-in-i3-status)
    - [Encrypting values](#encrypting-values)
  - [Add to i3wm](#add-to-i3wm)
  - [Labels](#labels)
  - [Reporters](#reporters)
- [Bugs, Contributing](#bugs-contributing)

<!-- /MarkdownTOC -->


## About

i3-status basic idea is basicly the same as [i3blocks](http://vivien.github.io/i3blocks/). The major difference is that with i3blocks you use shell scripts or other commands to generate the information for your bar. With i3-status most of the blocks are generated from the same nodejs instance and therefore need less spawning of child processes.


### i3-status

- is written in node.js
- provides [buildin block types](./docs/buildin.md) for common use cases
- allows you to create custom modules in javascript which can use all the great packages on [npm](http://www.npmjs.com) 
- can use [i3-status modules](./docs/modules.md) provided by others.


## Quickstart

Since you found i3-status you will most likely use node.js and have npm installed. If you don't you need to install node.js and npm first.

After the next three steps your i3 bar will look like this:
![i3status](https://github.com/fehmer/i3-status/raw/master/docs/example.png)


### Installation

The easiest way to install i3-status is using ```npm install -g i3-status``` and install it globally. This is only recommended if you don't plan to use custom or third-party modules. The recommended way is to create a directory for i3-status, create a package.json and add i3-status as a dependency.

``` sh
mkdir ~/my-i3-status
cd my-i3-status
echo '{ "name": "my-i3-status", "version": "0.1.0" }' > package.json
npm install --save i3-status
```


### Configuration

The configuration is written in [YAML](https://en.wikipedia.org/wiki/YAML). Save this example configuration in your installation folder as **config.yml**. Your i3-bar will show the current date/time and your username.

``` yaml
main:
  color: '#FFFFFF'
blocks:
  - name: date    # show the current date/time e.g. Dec 19 12:34:56
    type: date    # use the builtin type date
    label: 📆      # label for the block
    interval: 1   # update interval in seconds
    format: MMM DD HH:mm:ss  # format string, see http://momentjs.com/docs/#/parsing/string-format/
    click: gnome-calendar # open the gnome calendar on mouse clicks
  - name: user      # name the block user
    type: username  # builtin type username
    label: 👤        # label for the block
    interval: 600    # update interval in seconds
    color: '#FF0000' # show username in red
```


If you want to display the hostname, free/used memory, cpu load, uptime or free disk space you can use the [buildin block types](./docs/buildin.md). 

You can extend i3-status with [third-party](https://www.npmjs.com/search?q=i3-status-module) or custom modules. To learn how to do this follow the [guide to custom modules](./docs/modules.md).

For more advanced configurations have a look at the [configuration reference](./docs/configuration.md).


### A note on security

Some block modules need security sensitive data like access tokens or passwords. If you don't want to provide the values in plain text in your config file you can encode them using aes256.


#### Enabling encryption in i3-status

Provide the ```--secret <secret>``` option to the i3-status binary. e.g.

```
bar {
        status_command /home/<yourname>/my-i3-status/node_modules/.bin/i3-status -c /home/<yourname>/my-i3-status/config.yml --secret <secret>
}
```

If you want to mangage your i3 and i3-status configuration in a SCM like git you should encrypt all sensible data. To prevent the secret to be published you can create a file .secret with the secret and use it with i3-status:

```
bar {
        status_command /home/<yourname>/my-i3-status/node_modules/.bin/i3-status -c /home/<yourname>/my-i3-status/config.yml --secret `cat /home/<yourname>/my-i3-status/.secret`
}
```


#### Encrypting values

To encrypt a value you can use the i3-status binary too:

``` sh
/home/<yourname>/my-i3-status/node_modules/.bin/i3-status --secret <secret> --encrypt <value>
```

The output can be used in the config instead of the plain value.

__Note:__ if you want to change your secret you have to re-encrypt all values. 

You can decrypt the encrypted values from your config using:

``` sh
/home/<yourname>/my-i3-status/node_modules/.bin/i3-status --secret <secret> --decrypt <value>
```

### Add to i3wm

Add this to your i3 config file to show the bar in the i3 wm.

```
bar {
        status_command /home/<yourname>/my-i3-status/node_modules/.bin/i3-status -c /home/<yourname>/my-i3-status/config.yml --secret <secret>
}
```

After reloading i3 there should be a bar with the date/time and your username. If you get an error have a look at the i3 log or the i3-status log in ```~/.i3status.log```.


### Labels

You can use utf-8 symbols for your lables. Another option is to install [Font Awesome](http://fontawesome.io) and use the icons from the [cheet sheet](http://fontawesome.io/cheatsheet/) as a label. Just copy the icon, not the html code.


### Reporters

Some modules provide additional information besides the output in the i3-bar. A reporter displays the additional information e.g. in a popup window. The [reporter reference](docs/reporter.md) shows you how to choose and customize a reporter. 

![Reporter in action](docs/reporter.png)

If you want to develop your own modules and want to use a reporter have a look at the [i3-status-starter](https://github.com/fehmer/i3-status-starter) documentation.

## Bugs, Contributing

Please report bugs only on [github](https://github.com/fehmer/i3-status/issues).

Feel free to fix bugs or add features to i3-status by forking it and create pull requests. Your pull request should contain the code, tests for the code with a decent coverage and the documentation needed for end-users to use the feature. If you want to develop a new type of buildin please write a module for that.

If you want to build your own module have a look at the [i3-status-starter](https://github.com/fehmer/i3-status-starter). If you add ```i3-status-module``` as a keyword to your own module people can find it more easily.