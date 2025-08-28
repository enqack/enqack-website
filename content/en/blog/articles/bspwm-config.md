---
layout: post
title: BSPWM Configuration
date: 2022-05-02
tags: ["bpswm", "polybar", "xrandr", "dotfiles"]
categories: ["Linux"]
---

A project I have been working on is to redesign my dotfiles to work on multiple machines running different distributions. Some solutions for BSPWM were required that have inspired this post. I will cover a few items, though nothing ground-breaking, that I hope will prove useful to someone.

## Getting Started with BSPWM

Chances are you came here not looking to install BSPWM but extend your configuration. Though, if you are new to BSPWM here are basic instructions to install it on Arch Linux.

```bash
pacman -S bspwm sxhkd
mkdir -p ~/.config/bspwm ~/.config/sxhkd
cp /usr/share/doc/bspwm/examples/bspwmrc ~/.config/bspwm/
cp /usr/share/doc/bspwm/examples/xshkdrc ~/.config/sxhkd/
```

Now start BSPWM with something along the line of:

```bash
echo "exec bspwm" > ~/.xinitrc && startx
```

## xrandr and Monitor Arrangement

I was making a call to xrandr in my *bspwmrc* file that needed to be made host dynamic. xrandr does not load a configuration file therefore I was able to create one for use within *bspwmrc*. The configuration file is a bash script that simply contains the xrandr command I wish to use on each machine. It is not tracked by my dotfiles repository.

The following excerpt from my *bspwmrc* file will source the *xrandrrc* file if it exists.

```bash
# Call an xrandr config script to arrange monitors.
# Example contents:
#   xrandr --output DP-0 --primary --right-of DP-3
#   -or-
#   xrandr --ouput eDP-1 --primary --left-of HDMI-1
if [ -f "$HOME/.config/xrandr/xrandrrc" ]; then
  source $HOME/.config/xrandr/xrandrrc
fi
```

## Desktop Configuration

The next solution required was for desktop layout across varying number of monitors. I ended up using an external script to make my call to *bspc monitor -d ...* based on few predefined layouts for up 3 monitors. The complete script is as follows:

```bash
#!/bin/bash

# get monitor count
MONITOR_COUNT=$(xrandr --listmonitors | head -1 | cut -d " " -f 2)

# determine desktop tag divisions
if [ "$MONITOR_COUNT" -eq "1" ]; then
  desks=("1 2 3 4 5 6 7 8 9 0")
elif [ "$MONITOR_COUNT" -eq "2" ]; then
  desks=("6 7 8 9 0" "1 2 3 4 5")
elif [ "$MONITOR_COUNT" -gt "2" ]; then
  desks=("1 2 3" "4 5 6" "7 8 9")
fi

for i in $(seq $MONITOR_COUNT); do
  # get name of monitor port
  port=$(xrandr --listmonitors | sed -n $((i+1))p | cut -d " " -f 6)

  # don't assign desktop tags to more than 3 monitors
  if [ "$MONITOR_COUNT" -lt "3" ]; then
    bspc monitor $port -d ${desks[$((i-1))]}
  fi
done
```

The script could be called from *bspwmrc*; in example:

```bash
$HOME/.scripts/bspwm/dynamic-bspc-monitor
```

## Polybar

The final item I wanted to work on in my *bspwmrc* file was launching Polybar. This solution requires version 3.6.0 or higher of Polybar. I use relative paths with *include-file* in my configuration files which requires a recent version.

I split the polybar configuration file into included files for color, module, and global settings. They are included in bar specific configuration files for which there are 3: primary, secondary, and additional. Primary and secondary are for the first and second monitor and the additional bar configuration for any additional monitors.

An excerpt of a bar specific configuration file is listed below.

```bash
include-file = colors.ini
include-file = global.ini
include-file = modules.ini

[bar/primary]
monitor = ${env:MONITOR:DP-0}
```

The Polybar launch script I use is listed below.

```bash
#!/bin/bash

HEAD_NAMES=$(polybar -M | cut -d ':' -f 1)

killall -q polybar

# wait for killall to take effect
while pgrep -u $UID -x polybar >/dev/null; do sleep 1; done

counter=1
for head in $HEAD_NAMES; do
  export MONITOR=$head

  if [ "$counter" -eq "1" ]; then
    polybar primary --config=$HOME/.config/polybar/primary.ini &
  fi

  if [ "$counter" -eq "2" ]; then
    polybar secondary --config=$HOME/.config/polybar/secondary.ini &
  fi

  if [ "$counter" -gt "2" ]; then
    polybar additional --config=$HOME/.config/polybar/additional.ini &
  fi

  ((counter++))
done
```

## Diving Deeper

To get a better look at what I have done reference my dotfiles and scripts repositories.

[https://github.com/enqack/.dotfiles](http://github.com/enqack/.dotfiles)

[https://github.com/enqack/.scripts](http://github.com/enqack/.scripts)

BSPWM's configuration file is located at:

[https://github.com/enqack/.dotfiles/blob/master/stowed/bspwm/.config/bspwm/bspwmrc](https://github.com/enqack/.dotfiles/blob/master/stowed/bspwm/.config/bspwm/bspwmrc)

Polybar's configuration files are located at:

[https://github.com/enqack/.dotfiles/tree/master/stowed/polybar/.config/polybar](https://github.com/enqack/.dotfiles/tree/master/stowed/polybar/.config/polybar)

Polybar's lauch script is located at:

[https://github.com/enqack/.scripts/blob/master/polybar/launch.sh](https://github.com/enqack/.scripts/blob/master/polybar/launch.sh)
