# Configuration

## Table of content
<!-- MarkdownTOC -->

- [Example](#example)
- [Main](#main)
  - [Color](#color)
  - [Interval](#interval)
- [Block configuration](#block-configuration)
  - [Name](#name)
  - [Type](#type)
  - [Module](#module)
  - [Color](#color-1)
  - [Interval](#interval-1)
  - [Click](#click)

<!-- /MarkdownTOC -->

## Example

This example config file shows the current date like Dec 19 12:34:56 and the name of the current user in red.

``` yaml
main:
  color: '#FFFFFF'
  interval: 30
blocks:
  - name: date    # show the current date/time e.g. Dec 19 12:34:56
    type: date    # use the builtin type date
    label: 📆      # label for the block
    format: MMM DD HH:mm:ss  # format string, see http://momentjs.com/docs/#/parsing/string-format/
    click: gnome-calendar # open the gnome calendar on mouse clicks
  - name: user      # name the block user
    type: username  # builtin type username
    label: 👤        # label for the block
    interval: 600    # update interval in seconds
    color: '#FF0000' # show username in red
```

## Main

Settings in the *main* section are for all blocks, but a block can overwrite its own values.


### Color

Defines the text color of the bar. Colors must be defined as RGB HTML color, starting with a ```#``` and followed by 6 hex values with two bytes for each red, green and blue. ```color: '#FF0000'``` will display the block in red.


### Interval

With *interval* you can specify an update interval in seconds for all blocks.


## Block configuration

``` yml
- name: blockName # the unique name of the block
  type: type # or module:module, you have to set exactly one of these.
  interval: 10 # update interval in seconds
  click: ... # actions to perform on click
```

### Name

**mandatory**. The *name* is the name of the block. It must be unique in a i3-status configuration.


### Type

Use *type* to display a buildin block type. Each type has additional configuration possibilities. Read [buildin types](./buildins.md) for more information on the buildin types and their configuration.

You have to define *type* __or__ *module* for each block.


### Module

Use *module* to use a [third-party](https://www.npmjs.com/search?q=i3-status-module) module from npm or a local ```.js``` file. 

You can install modules with e.g. ```npm install --save i3-status-starter``` in your installation directory and activate it with e.g. ```module: i3-status-starter```. The [installation documentation](./installation.md) will cover the installation of i3-status and i3-status modules. 

To use local ```.js``` files just use the full path of your file, e.g. ```module: /home/peter/.config/i3/scripts/myBlock.js```.

If you want to develop your own module have a look at the [i3-status-starter](https://github.com/fehmer/i3-status-starter) package.


### Color

Use *color* if you want to define a text color just for one block. Colors must be defined as RGB HTML color, starting with a ```#``` and followed by 6 hex values with two bytes for each red, green and blue. ```color: '#FF0000'``` will display the block in red.

If no *color* is set the main *color* will be used.


### Interval

With *interval* you can specify an update interval in seconds for one block.

If no *interval* is set the main *interval* will be used.


### Click

Use *click* to specify actions when a mouse button is pressed on the block. If all mouse buttons should cause the same action just define the command, e.g. ```click: gnome-calendar```.

If you want to specify an action based on the button clicked use this.

```yml
click:
    left: cmd   # left mouse button clicked
    middle: cmd # middle mouse button clicked
    left: cmd   # left mouse button clicked
    up: cmd     # mouse wheel scrolled up
    down: cmd   # mouse wheel scrolled down
    8: cmd      # additional mouse button was presesed
```

Use the [log file](./index.js#log-file) to find out which number your additional mouse buttons have.