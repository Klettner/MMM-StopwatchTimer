Module.register("MMM-TimeStopp", {
defaults: {
	animation: true
},

getStyles: function() {
	return ["notificationFX.css", "font-awesome.css"];
},

start: function() {
	this.isVisible = false;
	this.firstMessage = true;
},

notificationReceived: function(notification, payload, sender) {
  switch(notification) {
    case "START_COUNTER":
		this.minutes = Math.floor(payload / 60);
		this.seconds = (payload % 60);
		this.initialiseTimeStopp(true);
		break
	case "INTERRUPT_TIMESTOPP":
		this.minutes = -1;
		this.seconds = -1;
		clearInterval(this.timeStopp);
		this.removeOverlay();
	  	break
	case "PAUSE_TIMESTOPP":
		clearInterval(this.timeStopp);
		break
	case "UNPAUSE_COUNTER":
		if(this.minutes > -1 && this.seconds > -1) {
			this.initialiseTimeStopp(true);
		}
		break
	case "START_STOPPER":
		this.minutes = 0;
		this.seconds = 0;
		this.initialiseTimeStopp(false);
		break
	case "UNPAUSE_STOPPER":
		if(this.minutes > -1 && this.seconds > -1) {
			this.initialiseTimeStopp(false);
		}
  }
},

initialiseTimeStopp: function(isCounter){
	clearInterval(this.timeStopp);
	if(this.isVisible) {
    	this.removeOverlay();
    }
    this.createOverlay();
    this.timeStopp = setInterval(()=>{
	if(isCounter) {
	  	this.createCounter()
	} else {
		this.createStopper()
	}
  	}, 1000)
},

createOverlay: function() {
	const overlay = document.createElement("div");
	overlay.id = "overlay";
	overlay.innerHTML += '<div class="black_overlay"></div>';
	document.body.insertBefore(overlay, document.body.firstChild);
	this.ntf = document.createElement("div")
	this.isVisible = true;
},

removeOverlay: function() {
	const overlay = document.getElementById("overlay");
	overlay.parentNode.removeChild(overlay);
	document.body.removeChild(this.ntf);
	this.isVisible = false;
	this.firstMessage = true;
},

displayMessagePopup: function(message) {
  let strinner = '<div class="ns-box-inner">';
  strinner += "<span class='thin dimmed medium'>" + message + "</span>";
  strinner += "</div>";
  this.ntf.innerHTML = strinner;
  this.ntf.className = "ns-alert ns-growl ns-effect-jelly ns-type-notice ns-show"
  document.body.insertBefore(this.ntf, document.body.nextSibling);
},

displayMessageNoPopup: function(message) {
  let strinner = '<div class="ns-box-inner">';
  strinner += "<span class='thin dimmed medium'>" + message + "</span>";
  strinner += "</div>";
  this.ntf.innerHTML = strinner;
  if(this.firstMessage) {
  	this.ntf.className = "ns-alert ns-growl ns-effect-jelly ns-type-notice ns-show"
  	document.body.insertBefore(this.ntf, document.body.nextSibling);
  	this.firstMessage = false;
  }
},

createCounter: function() {
		if(this.minutes == 0 && this.seconds == 0){
			this.decreaseTime();
			this.displayMessageNoPopup('Done');
			setTimeout(() => {
				this.removeOverlay()
			}, 3000);
		}
		if(this.minutes > 0 || this.seconds > 0) {
			if(this.config.animation) {
				if(this.seconds < 10) {
					this.displayMessagePopup(this.minutes + ':0' + this.seconds);
				} else {
					this.displayMessagePopup(this.minutes + ':' + this.seconds);
				}
			} else {	
				if(this.seconds < 10) {
					this.displayMessageNoPopup(this.minutes + ':0' + this.seconds);
				} else {
					this.displayMessageNoPopup(this.minutes + ':' + this.seconds);
				}
			}
			this.decreaseTime();
		}
},

createStopper: function() {
	if(this.config.animation) {
		if(this.seconds < 10) {
			this.displayMessagePopup(this.minutes + ':0' + this.seconds);
		} else {
			this.displayMessagePopup(this.minutes + ':' + this.seconds);
		}
	} else {
			if(this.seconds < 10) {
			this.displayMessageNoPopup(this.minutes + ':0' + this.seconds);
		} else {
			this.displayMessageNoPopup(this.minutes + ':' + this.seconds);
		}
	}
	this.increaseTime();
},

decreaseTime: function() {
	if(this.seconds > 0) {
		this.seconds--
	} else {
		if(this.minutes > 0) {
			this.minutes--
			this.seconds = 59;
		} else {
			this.minutes = -1;
			this.seconds = -1;	
		}
	}	
},

increaseTime: function() {
	if(this.seconds < 59) {
		this.seconds++
	} else {
		this.seconds = 0;
		this.minutes++;
	}
},
})
