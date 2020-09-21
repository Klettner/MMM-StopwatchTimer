# Module: StopwatchTimer :hourglass_flowing_sand:
With this MagicMirror module you can display an alert-style timer or stopwatch on your mirror. The timer and stopwatch can be controlled via notifications or by using the [MM-Remote android app](https://github.com/Klettner/MM-Remote) :iphone:.  

![](Timer.gif)

## Dependencies ##
This module does not have any special dependencies.

## Set-up ##
This module can be downloaded by using Git. First make sure that you have installed Git on your system. 
Open the terminal/commandline and go to the modules directory of MagicMirror by typing
```
cd ~/MagicMirror/modules
```
Then clone this git repository:
```
git clone https://github.com/Klettner/MMM-StopwatchTimer.git
```
You can update this module by using
```
git pull
```
in the MMM-StopwatchTimer folder.
  
To use this module you also need to add it to the **config/config.js** file
```
modules: [
  {
    module: 'MMM-StopwatchTimer',
    config: {
      animation: true,
    },
  },
];
```
## Notification options ##
The following notifications can be used to control this module:
| **Notification** | **Description** |
|------------------|-----------------|
| ``` START_TIMER ``` | Starts a x-seconds timer. You need to specify the amount of seconds in the payload |
| ``` PAUSE_STOPWATCHTIMER ``` | Pauses the currently running timer or stopwatch. It will still be displayed on the screen |
| ``` UNPAUSE_TIMER ``` | If the timer was paused previously it will continue |
| ``` START_STOPWATCH ``` | The stopwatch starts running |
| ``` UNPAUSE_STOPWATCH ``` | If the stopwatch was paused previously it will continue |
| ``` INTERRUPT_STOPWATCHTIMER ``` | The mirror will stop displaying the timer or stopwatch which is currently shown |

## Configuration options ##
The following options can be configured in the config.js file:
| **Option** | **Description**|
|------------|----------------|
| ``` animation ``` | Controls if the timer/stopwatch should be animated. **Default:** *true* |


