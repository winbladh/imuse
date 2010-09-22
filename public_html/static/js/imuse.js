// create the class object
var imusefuncs = {};
	imusefuncs.uniqid=function (prefix, more_entropy) {
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kankrelune (http://www.webfaktory.info/)
    // %        note 1: Uses an internal counter (in php_js global) to avoid collision
    // *     example 1: uniqid();
    // *     returns 1: 'a30285b160c14'
    // *     example 2: uniqid('foo');
    // *     returns 2: 'fooa30285b1cd361'
    // *     example 3: uniqid('bar', true);
    // *     returns 3: 'bara20285b23dfd1.31879087'

    if (typeof prefix == 'undefined') 
    {
        prefix = "";
    }

    var retId;
    
    var formatSeed = function (seed, reqWidth) {
        seed = parseInt(seed,10).toString(16); // to hex str
        if (reqWidth < seed.length) { // so long we split
            return seed.slice(seed.length - reqWidth);
        }
        if (reqWidth > seed.length) 
        { 	// so short we pad
            return Array(1 + (reqWidth - seed.length)).join('0')+seed;
        }
        return seed;
    };

    // BEGIN REDUNDANT
    if (!this.php_js) {
        this.php_js = {};
    }
    // END REDUNDANT
    if (!this.php_js.uniqidSeed) { // init seed with big random int
        this.php_js.uniqidSeed = Math.floor(Math.random() * 0x75bcd15);
    }
    this.php_js.uniqidSeed++;

    retId  = prefix; // start with prefix, add current milliseconds hex string
    retId += formatSeed(parseInt(new Date().getTime()/1000,10),8);
    retId += formatSeed(this.php_js.uniqidSeed,5); // add seed hex string

    if (more_entropy) {
        // for more entropy we add a float lower to 10
        retId += (Math.random()*10).toFixed(8).toString();
    }

    return retId;
	}; 

var IMuse = Class.create({},{	
	initialize: function(){
		
		// constructor
		
		// setup a hacked list of images
		this.imglist = null;
		
		// get our ID refs
		this.nextbut = $('nextbut');
		this.prevbut = $('prevbut');

		this.photocont = $('photocont');

		// Observe the clickin n shiz
		this.nextbut.observe('click', this.nextclick.bindAsEventListener(this));
		this.prevbut.observe('click', this.prevclick.bindAsEventListener(this));

		this.slideselector = $('slideselector');

		this.curindex = 0;
		
		// Load the slides
		this.loadSlides();

	},

	// Create and submit the ajax request
	loadSlides: function(){
		new Ajax.Request('/'+g_projecturl+'/view_stories.php?loadstories=1',{
			method:'get',
			onSuccess: this.processSlideData.bind(this)
		});
	},

	// this will handle the json response
	processSlideData: function(resp){
		
		// responseJSON is only valid if the response is application/json
		this.imglist = resp.responseJSON.slides;

		this.makeSlideSelector();

		this.drawImage();
	},

	
	// Make the slide selector
	makeSlideSelector: function(){
		this.slideselector.update();

		for(var i=0;i<this.imglist.length;i++)
		{
			var temp = new Element('img',{
				'width':'100',
				'height':'100',
				'src': this.imglist[i].img
			});
			temp.writeAttribute('imgid', i);

			temp.observe('click', this.clickSlide.bindAsEventListener(this) );
			this.slideselector.insert( temp );
		}
	},

	clickSlide: function(event) {
		var imgid = Event.element(event).readAttribute('imgid');
		this.curindex = (imgid - 1);
		this.nextclick();
	},


	drawImage: function(){
		
		// set the background
		this.photocont.setStyle({
			'backgroundImage':'url(/'+this.imglist[this.curindex].img+')'
		});

		// erase it
		this.photocont.update();

		this.photocont.insert(new Element('h3').update("Image "+(this.curindex+1)));


		// add the text
		this.photocont.insert(new Element('p').update(this.imglist[this.curindex].text));

	},

	nextclick: function(event){
		if( (this.curindex+1)>=this.imglist.length)
		{
			alert("No more images");
			return;
		}
		this.curindex++;
		
		// Pretty fade stuff
		Effect.Fade( this.photocont,{
			afterFinish: this.fadeInDisplay.bind(this)
		} );
	},
	
	// Fade in
	fadeInDisplay: function(){
		this.drawImage();
		Effect.Appear( this.photocont );
	},

	prevclick: function(event){
		if(this.curindex<=0)
		{
			alert("No more previous to go");
			return;
		}
		this.curindex--;
		Effect.Fade( this.photocont,{
			afterFinish: this.fadeInDisplay.bind(this)
		} );

	},


	// lazy
	lastfunc: function(){
		// this is only here because im lazy, adn the last function cant have a ,
	}
});

var iMuseEventLinks = Class.create({}, {

	initialize: function()
	{
		this.elinks = $$(".dclink")
		var elm = new Element('div').setStyle({'position':'absolute', 
												'padding' : '4px', 
												'border' : '1px solid #000'}).hide(); 
		this.popup = elm; // $('popup_domain'); 
		($$('body')[0]).insert(this.popup); 
		this.lastEvent = null; 
		this.domainCache = new Hash(); 
		this.setupLinks(); 
	}, 
	
	setupLinks: function()
	{
		for (var i=0; i<this.elinks.length; i++)
		{
			$(this.elinks[i]).observe('mouseover', this.showHover.bindAsEventListener(this)); 	
			$(this.elinks[i]).observe('mouseout', this.hideHover.bindAsEventListener(this)); 
		}
	},
	
	hideHover: function(event)
	{
		this.popup.hide(); 
	}, 
	
	showHover: function(event)
	{
		var link = event.element(); 
		this.lastEvent = event; 
		this.getDomainInfo(link.readAttribute("dcid")); 
	}, 
	
	getDomainInfo: function(domainid)
	{
		var temp = this.domainCache.get(domainid); 
		if(temp != undefined)
		{
			this.displayDomainInfo(temp); 
			return; 
		}
		
		new Ajax.Request('/'+g_projecturl+'/ajax_getdomainconcept.php?domainid='+domainid,{
			method: 'get', 
			onSuccess: this.handleDomainInfo.bind(this), 
			onFailure: this.domainFail.bind(this)
		});
	},
	
	domainFail: function(resp)
	{
		alert(resp.responseText); 
	},
	 
	handleDomainInfo: function(resp)
	{
		var domaininfo = resp.responseJSON; 

		this.domainCache.set(domaininfo.domainid, domaininfo); 
		this.displayDomainInfo(domaininfo); 
	}, 
	
	displayDomainInfo: function(domaininfo)
	{
		var scrolls = document.viewport.getScrollOffsets(); 
		var xpos = this.lastEvent.clientX + scrolls.left; 
		var ypos = this.lastEvent.clientY + scrolls.top; 
		
		this.popup.setStyle({
			'backgroundColor' : '#fff', 
			'left' : xpos +'px', 
			'top' : (ypos + 20) + 'px', 
		}); 
		
		this.popup.update(); 
		this.popup.insert(new Element('h4').setStyle({'marginTop' : '0px'}).update(domaininfo.name)); 
		this.popup.insert(new Element('p').update(domaininfo.info)); 

		this.popup.show(); 
	}
});

var helpLinks = {};

	helpLinks.showHelp = function(event, helpmsg){

	var elm = new Element('div').addClassName("helppopup").setStyle({'position':'absolute', 
												'padding' : '4px', 
												'border' : '1px solid #000',
												'zIndex' : '99999'}).update(helpmsg); 
																								
	var scrolls = document.viewport.getScrollOffsets(); 
		var xpos = event.clientX + scrolls.left; 
		var ypos = event.clientY + scrolls.top; 
		
		elm.setStyle({
			'backgroundColor' : '#fff', 
			'left' : xpos +'px', 
			'top' : (ypos + 20) + 'px', 
		}); 			
												
	var popup = elm; 
	($$('body')[0]).insert(popup); 

};

helpLinks.hideHelp=function(){

	$$('div.helppopup')[0].remove();

};
