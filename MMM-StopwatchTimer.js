/* Some code snippets of this file were copied from the default alert module https://github.com/MichMich/MagicMirror/tree/development/modules/default/alert */

Module.register("MMM-StopwatchTimer", {
  defaults: {
    animation: true,
    sound: true,
    soundFile: 'buzz.wav',
    useNativeSound: false,
    useAlertStyle: true
  },

  getStyles: function() {
    return [
      "MMM-StopwatchTimer.css",
      "font-awesome.css",
      "https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
    ]
  },

  start: function() {
    this.isVisible = false
    this.firstMessage = true
    // initialize native sound vith HTML5
    this.sound = new Audio()
    this.sound.autoplay = true
    // create an object for all values
    this.Timer = {
      wanted : 0,
      current: 0,
      percent: 0,
      seconds: 0,
      minutes: 0
    }
  },

  notificationReceived: function(notification, payload, sender) {
    switch(notification) {
    case "DOM_OBJECTS_CREATED":
      // prepare new displayer style if needed
      if (!this.config.useAlertStyle) this.prepareDisplay()
      break
    case "START_TIMER":
      if (isNaN(payload)) {
        // if received value is not an number ... display warning and break
        this.createOverlay()
        this.displayMessage('Error: Received value is not a number !', false, true)
        setTimeout(() => this.removeOverlay(), 3000)
        return
      }
      this.Timer.wanted = payload
      this.Timer.current = payload
      this.Timer.percent = 0
      this.Timer.minutes = Math.floor(payload / 60)
      this.Timer.seconds = (payload % 60)
      this.initialiseStopwatchTimer(true)
      break
    case "INTERRUPT_STOPWATCHTIMER":
      this.Timer = {
        wanted : 0,
        current: 0,
        percent: 0,
        seconds: -1,
        minutes: -1
      }
      clearInterval(this.stopwatchTimer)
      if (this.config.useAlertStyle) this.removeOverlay()
      else this.counterEnd()
      break
    case "PAUSE_STOPWATCHTIMER":
      clearInterval(this.stopwatchTimer)
      break
    case "UNPAUSE_TIMER":
      if(this.Timer.minutes > -1 && this.Timer.seconds > -1) {
        this.initialiseStopwatchTimer(true)
      }
      break
    case "START_STOPWATCH":
      this.Timer = {
        wanted : 0,
        current: 0,
        percent: 0,
        seconds: 0,
        minutes: 0
      }
      this.initialiseStopwatchTimer(false)
      break
    case "UNPAUSE_STOPWATCH":
      if(this.Timer.minutes > -1 && this.Timer.seconds > -1) {
        this.initialiseStopwatchTimer(false)
      }
    }
  },

  initialiseStopwatchTimer: function(isCounter){
    clearInterval(this.stopwatchTimer)
    if (this.config.useAlertStyle) {
      if(this.isVisible) this.removeOverlay()
      this.createOverlay()
    }
    this.stopwatchTimer = setInterval(()=>{
      console.log("Timer Values:", this.Timer)
      if(isCounter) this.createTimer()
      else this.createStopwatch()
    }, 1000)
  },

  createOverlay: function() {
    const overlay = document.createElement("div")
    overlay.id = "overlay"
    overlay.innerHTML += '<div class="black_overlay"></div>'
    document.body.insertBefore(overlay, document.body.firstChild)
    this.ntf = document.createElement("div")
    this.isVisible = true
  },

  removeOverlay: function() {
    const overlay = document.getElementById("overlay")
    overlay.parentNode.removeChild(overlay)
    document.body.removeChild(this.ntf)
    this.isVisible = false
    this.firstMessage = true
  },

  displayMessage: function(message,animate,error=null) {
    if (!this.config.useAlertStyle && !error) return this.drawCounter(message)
    let strinner = '<div class="ns-box-inner">'
    strinner += "<span class='regular normal medium'>" + message + "</span>"
    strinner += "</div>"
    this.ntf.innerHTML = strinner
    if (animate) {
      this.ntf.className = "ns-alert ns-growl ns-effect-jelly ns-type-notice ns-show"
      document.body.insertBefore(this.ntf, document.body.nextSibling)
    } else {
      if (this.firstMessage) {
        this.ntf.className = "ns-alert ns-growl ns-effect-jelly ns-type-notice ns-show"
        document.body.insertBefore(this.ntf, document.body.nextSibling)
        this.firstMessage = false
      }
    }
  },

  createTimer: function() {
      if (this.Timer.minutes == 0 && this.Timer.seconds == 0) {
        this.decreaseTime()
        if (this.config.sound) {
          // use native sound (with sound inside sounds directory) or original code ?
          if (this.config.useNativeSound) this.sound.src= "/modules/MMM-StopwatchTimer/sounds/" + this.config.soundFile + "?seed=" + Date.now()
          else this.sendNotification('PLAY_SOUND', this.config.soundFile)
        }
        this.displayMessage('Done', false)
        clearInterval(this.stopwatchTimer) // don't forget to stop timer !
        setTimeout(() => {
          if (this.config.useAlertStyle) this.removeOverlay()
          else this.counterEnd()
          this.Timer = { // don't forget to reset Timer
            wanted : 0,
            current: 0,
            percent: 0,
            seconds: 0,
            minutes: 0
          }
        }, 3000)
      }
      if (this.Timer.minutes > 0 || this.Timer.seconds > 0) {
        this.displayMessage(this.Timer.minutes + (this.Timer.seconds < 10 ? ':0' : ':') + this.Timer.seconds, this.config.animation)
        this.decreaseTime()
      }
  },

  createStopwatch: function() {
    this.displayMessage(this.Timer.minutes + (this.Timer.seconds < 10 ? ':0' : ':') + this.Timer.seconds, this.config.animation)
    this.increaseTime()
  },

  decreaseTime: function() {
    this.Timer.current--
    this.Timer.percent = this.Timer.current >= this.Timer.wanted ? 100 : (100-((this.Timer.current*100)/this.Timer.wanted))
    this.Timer.percent = this.Timer.percent >= 100 ? 100 : this.Timer.percent.toFixed(2)

    if (this.Timer.seconds > 0) this.Timer.seconds--
    else {
      if (this.Timer.minutes > 0) {
        this.Timer.minutes--
        this.Timer.seconds = 59
      } else {
        this.Timer.minutes = -1
        this.Timer.seconds = -1
      }
    }
  },

  increaseTime: function() {
    this.Timer.current++
    this.Timer.percent = this.Timer.current >= this.Timer.wanted ? 100 : (100-((this.Timer.current*100)/this.Timer.wanted))
    this.Timer.percent = this.Timer.percent >= 100 ? 100 : this.Timer.percent.toFixed(2)

    if(this.Timer.seconds < 59) this.Timer.seconds++
    else {
      this.Timer.seconds = 0
      this.Timer.minutes++
    }
  },

  /** Create popup for display counter **/
  prepareDisplay: function() {
    var display = document.createElement("div")
    display.id = "StopwatchTimer"
    display.classList.add("hidden")
    display.className= "hidden animate__animated"
    display.style.setProperty('--animate-duration', '1s')
    var displayText = document.createElement("div")
    displayText.id = "StopwatchTimer_TEXT"
    display.appendChild(displayText)
    var displayBar = document.createElement("div")
    displayBar.id = "StopwatchTimer_BAR"
    display.appendChild(displayBar)
    document.body.appendChild(display)
  },

  /** display current counter **/
  drawCounter: function(current) {
    var display = document.getElementById("StopwatchTimer")
    if (this.config.animation) {
      display.classList.remove("hidden", "animate__backOutDown")
      display.classList.add("animate__backInUp")
    } else display.classList.remove("hidden")

    var displayText = document.getElementById("StopwatchTimer_TEXT")
    displayText.innerHTML = current
    var displayBar = document.getElementById("StopwatchTimer_BAR")
    displayBar.style.width = this.Timer.percent + "%"
  },

  /** counter timer out ! **/
  counterEnd: function() {
    var display = document.getElementById("StopwatchTimer")
    if (this.config.animation) {
      display.classList.remove("animate__backInUp")
      display.classList.add("animate__backOutDown")
      display.addEventListener('animationend', (e) => {
        if (e.animationName == "flipOutX" && e.path[0].id == "StopwatchTimer") {
          display.classList.add("hidden")
        }
        e.stopPropagation()
      }, {once: true})
    } else display.classList.add("hidden")
  }
});
