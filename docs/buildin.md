# Buildin block types

## Table of content
<!-- MarkdownTOC -->

- [Date](#date)
  - [Format](#format)
  - [Example](#example)
- [DiskFree](#diskfree)
  - [Mount](#mount)
  - [Warning](#warning)
  - [Example](#example-1)
- [Hostname](#hostname)
  - [FQN](#fqn)
  - [Example](#example-2)
- [Load Average](#load-average)
  - [Display](#display)
  - [Warning](#warning-1)
  - [Example](#example-3)
- [Memory](#memory)
  - [Display](#display-1)
  - [Warning](#warning-2)
  - [Example](#example-4)
- [Text](#text)
  - [Example](#example-5)
- [Uptime](#uptime)
  - [Format](#format-1)
  - [Trim](#trim)
  - [Example](#example-6)
- [Username](#username)
  - [Example](#example-7)
- [Command](#command)
  - [Example](#example-8)

<!-- /MarkdownTOC -->


## Date

The type **date** shows the current date/time. If you do not specify a *format* the output is like ```Apr 03 22:12```.


### Format

With *format* you can specify how your date/time should look like. Use the [moment.js format](http://momentjs.com/docs/#/displaying/format/) to customize the output to your liking.

### Example

``` yaml
  - name: example
    type: date
    format: dddd, MMMM Do YYYY, h:mm:ss a  # outputs  "Sunday, February 14th 2010, 3:25:50 pm"
    interval: 1  # refresh block each second
```


## DiskFree

The type **diskfree** shows the available bytes on your drive. If you don't specify the *mount* point the available space on your home directory is shown.


### Mount

Use *mount* to show the available disk space of another disk. The disk must be mounted. On Windows the drive letter should work, but I have not tested this.


### Warning

If you define a *warning* the block will be urgent (highlighted) if the available free space is below the warning level.

You can define the warning level as percentage like ```warning: 10%```, a number of bytes like ```warning: 1024000000``` or like ```warning: 1gb```. The supported units are: kb, mb, gb and tb.


### Example

``` yaml
  - name: example
    type: diskfree
    label: tmp
    mount: '/tmp'   # monitor the /tmp mount
    warning: 512mb  # warn if free space is lower then 512 mb
```


## Hostname

The type **hostname** displays the hostname of the system. If you don't set *fqn* the hostname is shown without the domain part. E.g. ```peter```.


### FQN

Activate *fqn* with ```fqn: true``` to show the hostname fully qualified with the domain part. E.g. ```peter.your.tld```


### Example

``` yaml
  - name: example
    type: hostname
```


## Load Average

The type **loadavg** shows the load average for the past minute in the default [unix format](https://en.wikipedia.org/wiki/Load_(computing)).


### Display

Use ```display: percentage``` to show the load as a percentage. The percentage is calculated as ```load/number of cpus * 100```.


### Warning

When *warning* is enabled with ```warning: true``` the block will be urgent (highlighted) if the current load is greater than the number of cpus detected.


### Example

``` yaml
  - name: example
    type: loadavg
    display: percentage
    warning: true
```


## Memory

The type **memory** shows the current memory usage. When *display* is not defined the percentage of memory in use is shown. When *warning* is not set the block will be urgent (highlighted) if less than 10% of the memory is free.


### Display

With *display* you can change the output of the block to:

- **percent**, show used memory as percentage, _default_
- **percent_free**, show free memory as percentage
- **amount**, show used/total memory in bytes, e.g. ```3.50GB/6.75GB```

The values are case-sensitive.


### Warning

Define warning level as percentage. The block will be urgent (highlighted) when less than this amount of memory is free.


### Example

``` yaml
  - name: example
    type: memory
    display: amount  # show amount free/total
    warning: 10      # warn when free memory is below ten percent of the total memory
```


## Text

Type **text** displays a fixed text, defined by the *text* value. E.g. ```text: 'Hello Friend'```


### Example

``` yaml
  - name: example
    type: text
    text: 'Hello Friend'
```


## Uptime

The type **uptime** shows the current system uptime. The default output looks like ```1y 205d 03:14```. When the uptime is lower than one year or one day the fields are stripped from the output like ```03:14```


### Format

With *format* the output format of the uptime can be modified. Use the syntax from [moment-duration-format](https://www.npmjs.com/package/moment-duration-format#template). E.g. ```format: 'h [hours]'```  displays the uptime in full hours like ```150 hours```. 


### Trim

The *trim* is active by default and causes empty fields to be eliminated from the display. With ```trim: false``` the example above shows ```0y 0d 03:14```.


### Example

``` yaml
  - name: example
    type: uptime
    format: 'y[yrs] D[dys] hh:mm'
    trim: false
```


## Username

The **username** type simply shows your username.


### Example

``` yaml
  - name: example
    type: username
```


## Command

The **command** type allows you to integrate shell scripts or other runable commands/programms in i3-status. It uses the same output format as [i3blocks](http://vivien.github.io/i3blocks/).

```
full_text <newline>
short_text <shorttext>
color <newline>
```

If the exit status of the command is not zero the block will be urgent (highlighted).

Specify the command to execute with ```command: '/home/peter/.config/i3/scripts/myScript.sh'```. The script must be executable.


### Example

``` yaml
  - name: example
    type: command
    command: '/home/peter/.config/i3/scripts/myScript.sh'
```