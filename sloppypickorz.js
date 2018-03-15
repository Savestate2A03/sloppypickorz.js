/*

	BotB PaletteEditor Sloppy Pickorz
	(farbtastic rewrite by Savestate ! O:)

	and my 1st jquery !! wowzro

 */

function hexValidator(hex) {
	if (!hex.startsWith('#')) return false;
	hex = hex.substring(1, hex.length);
	if (!(hex.length == 3 || hex.length == 6)) return false;
	if (/[^a-fA-F0-9]/g.test(hex)) return false;
	return true;
}

function hexToRGB(hex) {
	// be sure to check hexValidator(hex) before calling
	var r, g, b;
	hex = hex.substring(1, hex.length);
	if (hex.length == 3) {
		r = parseInt(hex.charAt(0), 16) * 17;
		g = parseInt(hex.charAt(1), 16) * 17;
		b = parseInt(hex.charAt(2), 16) * 17;
	} else {
		r = parseInt(hex.substring(0,2), 16);
		g = parseInt(hex.substring(2,4), 16);
		b = parseInt(hex.substring(4,6), 16);
	}
	return {
		r: r,
		g: g,
		b: b
	}
}

function clamp(n, a, b) {
	return Math.max(a, Math.min(n, b));
}

function rgbToHex(rgb) {
	var r, g, b;
	r = clamp(rgb.r, 0, 255);
	g = clamp(rgb.g, 0, 255);
	b = clamp(rgb.b, 0, 255);
	// ugly left padding
	// but i can't think of anything else
	return '#' 
		+ ('0' + r.toString(16)).substr(-2)
		+ ('0' + g.toString(16)).substr(-2)
		+ ('0' + b.toString(16)).substr(-2);
}

// thanks to:
// http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
function rgbToHSL(rgb) {
	var r, g, b;
	// limit range 0.0-1.0
	r = rgb.r / 255;
	g = rgb.g / 255;
	b = rgb.b / 255;
	// black
	if (r == g &&
		g == b &&
		b == 0) {
		return {
			h: 0,
			s: 0,
			l: 0
		};
	}
	// white
	if (r == g &&
		g == b &&
		b == 1) {
		return {
			h: 0,
			s: 0,
			l: 1.0
		};
	}
	var min = Math.min(r, g, b);
	var max = Math.max(r, g, b);
	var luminace = (min+max) / 2;
	// grey
	if (r == g &&
		g == b) {
		return {
			h: 0,
			s: 0,
			l: luminace
		};
	}
	var saturation = 
		luminace < 0.5 ? 
		(max-min)/(max+min) : 
		(max-min)/(2.0-max-min);
	var hue;
	switch(max) {
		case r:
			hue = (g-b)/(max-min);
		break;
		case g:
			hue = 2.0 + (b-r)/(max-min);
		break;
		case b:
			hue = 4.0 + (r-g)/(max-min);
		break;
		default:
			hue = 0.0
	}
	hue *= 60;
	if (hue < 0) hue += 360;
	return {
		h: hue,
		s: saturation,
		l: luminace
	}
}

// thanks to:
// http://www.niwa.nu/2013/05/math-behind-colorspace-conversions-rgb-hsl/
function hslToRGB(hsl) {
	var h, s, l;
	h = hsl.h;
	s = hsl.s;
	l = hsl.l;
	var temp1, temp2;
	if (l < 0.5) {
		temp1 = l * (1.0+s);
	} else {
		temp1 = l+s - l*s
	}
	temp2 = 2*l - temp1;
	h = h/360;
	var tr, tg, tb; // temp
	tr = h + 0.3333;
	tg = h;
	tb = h - 0.3333;
	if (tr < 0) tr += 1; // clamps
	if (tr > 1) tr -= 1;
	if (tg < 0) tg += 1;
	if (tg > 1) tg -= 1;
	if (tb < 0) tb += 1;
	if (tb > 1) tb -= 1;
	var r, g, b;
	// red
	if (6*tr < 1) r = temp2 + (temp1-temp2)*6*tr;
	else if (2*tr < 1) r = temp1;
	else if (3*tr < 2) r = temp2 + (temp1-temp2)*(0.6666-tr)*6;
	else r = temp2;
	// green
	if (6*tg < 1) g = temp2 + (temp1-temp2)*6*tg;
	else if (2*tg < 1) g = temp1;
	else if (3*tg < 2) g = temp2 + (temp1-temp2)*(0.6666-tg)*6;
	else g = temp2;
	// blue
	if (6*tb < 1) b = temp2 + (temp1-temp2)*6*tb;
	else if (2*tb < 1) b = temp1;
	else if (3*tb < 2) b = temp2 + (temp1-temp2)*(0.6666-tb)*6;
	else b = temp2;
	r = Math.round(r*255);
	g = Math.round(g*255);
	b = Math.round(b*255);
	return {
		r: r,
		g: g,
		b: b
	};
}

function getSwatchColor(type) {
	switch(type) {
		case 'text':
			return $('#color1').val();
		case 'link':
			return $('#color2').val();
		case 'button':
			return $('#color3').val();
		case 'box':
			return $('#color4').val();
		case 'bottom':
			return $('#color5').val();
		default:
			return '#000000';
	}
}

// based on palette.css as of 3/13/2018
function updateSiteColors(type, color) {	
	switch (type) {
		// ::::: TEXT :::::
		case 'text':
			$('body, html').css('color', color);
			$('a').off('mouseenter mouseleave');
			$('a').hover(
				function() { $(this).css('color', color); },
				function() { $(this).css('color', getSwatchColor('link')); }
			);
			$('.logo2').css('color', color);
			$('.boxLink').off('mouseenter mouseleave');
			$('.boxLink').hover(
				function() {
					$(this).css('color', getSwatchColor('bottom')); // bottom
					$(this).css('background', color); // text
				},
				function() {
					$(this).css('color', getSwatchColor('link')); // link 
					$(this).css('background', getSwatchColor('button')); // button
				}
			);
			$('.searchInput').css('color', color);
			$('.CSVtags').css('color', color);
			$('a.closeTab').off('mouseenter mouseleave');
			$('a.closeTab').hover(
				function() { $(this).css('background', color); },
				function() { $(this).css('background', getSwatchColor('button')); }
			);
			$('.list').css('background', color);
			break;
		// ::::: LINK :::::
		case 'link':
			$('a').css('color', color);
			$('.boxLink').off('mouseenter mouseleave');
			$('.boxLink').hover(
				function() {
					$(this).css('color', getSwatchColor('bottom')); // bottom
					$(this).css('background', getSwatchColor('text')); // text
				},
				function() {
					$(this).css('color', color); // link 
					$(this).css('background', getSwatchColor('button')); // button
				}
			);
			$('a.footerMenu').off('mouseenter mouseleave');
			$('a.footerMenu').hover(
				function() { 
					$(this).css('border-right', '1px solid ' 
					+ getSwatchColor('button')); 
				},
				function() { 
					$(this).css('border-right', '1px solid ' 
					+ color);
				}
			);
			$('a.closeTab').css('color', getSwatchColor('link'));
			break;
		// ::::: BUTTON :::::
		case 'button':
			$('.levelProgress').css('background', color);
			$('.levelProgress').css('border', color + ' 2px solid');
			$('.logo1').css('color', color);
			$('.boxLink').css('background-color', color);
			$('.boxLink').off('mouseenter mouseleave');
			$('.boxLink').hover(
				function() {
					$(this).css('color', getSwatchColor('bottom')); // bottom
					$(this).css('background', getSwatchColor('text')); // text
				},
				function() {
					$(this).css('color', getSwatchColor('link')); // link 
					$(this).css('background', color); // button
				}
			);
			$('.tmono').css('background', color);
			$('.CSVtags').css('background', color);
			$('.uiWindow').css('border', '2px solid ' + color);
			$('a.closeTab').css('background', color);
			$('a.closeTab').off('mouseenter mouseleave');
			$('a.closeTab').hover(
				function() { $(this).css('background', getSwatchColor('text')); },
				function() { $(this).css('background', color); }
			);
			$('#footer').css('border-top', color + ' solid 3px');
			$('a.footerMenu').off('mouseenter mouseleave');
			$('a.footerMenu').hover(
				function() { 
					$(this).css('border-right', '1px solid ' 
					+ color); 
				},
				function() { 
					$(this).css('border-right', '1px solid ' 
					+ getSwatchColor('link'));
				}
			);
			break;
		// ::::: BOX :::::
		case 'box':
			$('.inner:not(".topShadow")').css('background-color', color);
			$('.boxLink').css('background-color', getSwatchColor('button'));
			$('#USER_STATUS .NoOPEN').css('border', '2px '+color+' solid');
			$('#StatusBoxBottomRow').css('border-top', color + ' 1px dotted');
			$('.logo0').css('color', color);
			$('.uiWindow').css('background-color', color);
			$('#footer').css('background', color + ' url(/styles/img/marble_bg.png)');
			var rgb = hexToRGB(color);
			$('#pageBG').css('background', 'rgba('+rgb.r+','+rgb.g+','+rgb.b+',0.8)');
			break;
		// ::::: BOTTOM :::::
		case 'bottom':
			$('body, html').css('background-color', color);
			$('.inner.highlight').css('box-shadow', '0 0 7px 3px ' + color);
			$('.boxLink').off('mouseenter mouseleave');
			$('.boxLink').hover(
				function() {
					$(this).css('color', color); // bottom
					$(this).css('background', getSwatchColor('text')); // text
				},
				function() {
					$(this).css('color', getSwatchColor('link')); // link 
					$(this).css('background', getSwatchColor('button')); // button
				}
			);
			$('.searchInput').css('background', color);
			$('.CSVtags').css('border', '1px '+color+' solid');
			$('.uiWindow.closeTab').off('mouseenter mouseleave');
			$('.uiWindow.closeTab').hover(
				function() { $(this).css('color', color); },
				function() { $(this).css('color', getSwatchColor('link')); }
			);
			$('.list').css('color', color);
			$('#footer').css('box-shadow', '0px -10px 40px -10px ' + color);
			$('#footer').css('-moz-box-shadow', '0px -10px 40px -10px ' + color);
			$('#footer').css('-webkit-box-shadow', '0px -10px 40px -10px ' + color);
			$('a.footerMenu').off('mouseenter mouseleave');
			$('a.footerMenu').hover(
				function() { 
					$(this).css('background', color 
					+ ' url(/styles/img/topNoiseShade.png) repeat-x'); 
				},
				function() { 
					$(this).css('background', 'url(/styles/img/topNoiseShade.png) repeat-x'); 
				}
			);
			break;
		default:
	}	
}

function colorwellProcess(colorwell) {
	var color = colorwell.val();
	// data validation (client-side)
	if (!color.startsWith('#')) { color = "#" + color; }
	color = color.replace(/[^a-fA-F0-9\#]/g, '');
	if (color.length > 7) { color = color.substring(0, 7); }
	// set colorwell value
	colorwell.val(color);
	if (!hexValidator(color)) return; // -------------
	// only execute the following if valid hex
	switch(colorwell.attr('id')) {
		case 'color1':
			updateSiteColors('text', color);
			break;
		case 'color2':
			updateSiteColors('link', color);
			break;
		case 'color3':
			updateSiteColors('button', color);
			break;
		case 'color4':
			updateSiteColors('box', color);
			break;
		case 'color5':
			updateSiteColors('bottom', color);
			break;
		default:
	}
	// set editor colors
	colorwell.css('background-color', color);
	colorwell.parent().css('background-color', color);
	// update panel colors if editing user palette
	if (checkIfUserPalette(activePaletteID)) {
		var panelPalette = getUserPalette(activePaletteID);
		var colorMatch = /color([0-9]+)/g.exec(colorwell.attr('id'));
		var panelPaletteSwatch = panelPalette.children('.col' + colorMatch[1]);
		panelPaletteSwatch.css('background', color);
	}
	// set swatch text based on luminance
	var rgb = hexToRGB(color);
	// luminance range is 0-255
	var luminance = 0.2990*rgb.r + 
					0.5870*rgb.g +
					0.1440*rgb.b;
	var luma_color = luminance > 100.00 ? '#000' : '#fff';
	colorwell.css('color', luma_color);
	colorwell.parent().css('color', luma_color);
	// debug 
	if (!SLOPPY_DEBUG) return;
	var rgb = hexToRGB(color);
	var hsl = rgbToHSL(rgb);
	var rgb2 = hslToRGB(hsl);
	$('.uiWindow p').html(
		'COLOR ' + color 
		+ '<br> :: R ' + rgb.r + ' G ' + rgb.g + ' B ' + rgb.b
		+ '<br> :: H ' + hsl.h.toFixed(2) + ' S ' + hsl.s.toFixed(2) + ' L ' + hsl.l.toFixed(2)
		+ '<br> :: (alt) R ' + rgb2.r + ' G ' + rgb2.g + ' B ' + rgb2.b
	);
}

function degToRad(d) {
	return d*(Math.PI/180);
}

function radToDeg(r) {
  return r*(180/Math.PI);
}

function pickerUpdate(picker, useInternal) {
	var hsl;
	if (useInternal) {
		if (picker.data('hsl') == null) return;
		hsl = picker.data('hsl');
	} else {
		// don't do anything if unattached
		if (picker.data('colorwell') == null) return;
		// hsl calculation
		var hex = picker.data('colorwell').val();
		if (!hexValidator(hex)) return; // don't process bad hex but still attach
		hsl = rgbToHSL(hexToRGB(hex));
		picker.data('hsl', hsl);
	}
	// update markers and color based on picker data
	var base     = picker.children('.sloppy-base');
	// -------------
	var color    = base.children('.sloppy-color');
	var hMarker  = base.children('.h-sloppy-marker');
	var slMarker = base.children('.sl-sloppy-marker');
	// magic numbers
	var RADIUS   = 84;
	var CENTER_X = 97;
	var CENTER_Y = 97;
	var CORNER_X = 47;
	var CORNER_Y = 47;
	var SL_SIZE  = 100;
	// -------------
	var hx = Math.cos(degToRad(hsl.h-90))*RADIUS+CENTER_X;
	var hy = Math.sin(degToRad(hsl.h-90))*RADIUS+CENTER_Y;
	hMarker.css({
		'top' : hy+'px',
		'left' : hx+'px'
	});
	var slx = CORNER_X+SL_SIZE-Math.round(hsl.s*SL_SIZE);
	var sly = CORNER_Y+SL_SIZE-Math.round(hsl.l*SL_SIZE);
	slMarker.css({
		'top' : sly+'px',
		'left' : slx+'px'
	})
	var hueColor = rgbToHex(hslToRGB({h: hsl.h, s: 1.0, l: 0.5}));
	color.css({
		'background' : hueColor
	});
}

function pickerAttach(picker, colorwell) {
	picker.data('colorwell', colorwell);
	pickerUpdate(picker, false);
}

function pickerInit(picker) {
	/* 
		set up color wheel
		http://battleofthebits.org/styles/img/wheel.png
			- base graphic incl wheel and white / alpha bottom
			- 195x195
		http://battleofthebits.org/styles/img/mask.png
			- black / alpha overlay
			- 101x101
		http://battleofthebits.org/styles/img/marker.png
			- marker for color picker
			- used on wheel and in s/l pane
			- 17x17
	*/
	picker.html('');
	var base = $('<div/>', {
		class: 'sloppy-base',
		css: {
			'margin' : '0',
			'padding' : '0',
			'width' : '195px',
			'height' : '195px',
			'position' : 'relative',
			'cursor' : 'crosshair'
		}
	}).appendTo(picker);
	$('<div/>' , {
		class: 'sloppy-color',
		css: {
			'background-color' : '#FF0000',
			'position' : 'absolute',
			'width' : '101px',
			'height' : '101px',
			'top' : '47px',
			'left' : '47px'
		}	
	}).appendTo(base);
	var wheel = $('<div/>' , {
		class: 'sloppy-wheel',
		css: {
			'background' : 'url("styles/img/wheel.png") no-repeat',
			'position' : 'absolute',
			'width' : '195px',
			'height' : '195px'
		}
	}).appendTo(base);
	var mask = $('<div/>' , {
		class: 'sloppy-mask',
		css: {
			'background' : 'url("styles/img/mask.png") no-repeat',
			'position' : 'absolute',
			'width' : '101px',
			'height' : '101px',
			'top' : '47px',
			'left' : '47px'
		}	
	}).appendTo(base);
	var markerH = $('<div/>' , {
		class: 'sloppy-marker h-sloppy-marker',
		css: {
			'background' : 'url("styles/img/marker.png") no-repeat',
			'position' : 'absolute',
			'width' : '17px',
			'height' : '17px',
			'overflow' : 'hidden',
			'margin' : '-8px 0 0 -8px',
			'top' : '0px',
			'left' : '0px'
		}	
	}).appendTo(base);
	var markerSL = $('<div/>' , {
		class: 'sloppy-marker sl-sloppy-marker',
		css: {
			'background' : 'url("styles/img/marker.png") no-repeat',
			'position' : 'absolute',
			'width' : '17px',
			'height' : '17px',
			'overflow' : 'hidden',
			'margin' : '-8px 0 0 -8px',
			'top' : '0px',
			'left' : '0px'
		}	
	}).appendTo(base);
	// solid red
	picker.data('hsl', {
		h: '0',
		s: '1.0',
		l: '0.5'
	});
	markerH.add(wheel).mousedown(function(e) {
		var marker = $(this);
		var mouseHueTracker = function(e) {
			var xPos = e.pageX - base.offset().left;
			var yPos = e.pageY - base.offset().top;
			var baseCenterX = marker.parent().width()/2;
			var baseCenterY = marker.parent().height()/2;
			var radians = Math.atan2(yPos - baseCenterY, xPos - baseCenterX);
			var degrees = radToDeg(radians)+90;
			var colorwell = marker.parent().parent().data('colorwell');
			var hsl = picker.data('hsl');
			hsl.h = degrees;
			var newHex = rgbToHex(hslToRGB(hsl));
			colorwell.val(newHex);
			colorwell.change();
			picker.data('hsl', hsl);
			pickerUpdate(picker, true);
		}
		$('body').css({ 'user-select': 'none'});
		mouseHueTracker(e); // run once on click
		$('body').mousemove(mouseHueTracker);
		$('body').mouseup(function() {
			$('body').css({ 'user-select': 'auto'});
			$('body').off('mousemove', mouseHueTracker);
		});
	});
	markerSL.add(mask).mousedown(function(e) {
		var marker = markerSL;
		var mouseSLTracker = function(e) {
			var colorSquare = marker.parent().children('.sloppy-color');
			var xPos = e.pageX - base.offset().left;
			var yPos = e.pageY - base.offset().top;
			var colorStartX = colorSquare.position().left;
			var colorStartY = colorSquare.position().top;
			var colorSizeX = colorSquare.width();
			var colorSizeY = colorSquare.height();
			var saturation = clamp(1-(xPos-colorStartX)/colorSizeX,0,1);
			var luminance = clamp(1-(yPos-colorStartY)/colorSizeY,0,1);
			var colorwell = marker.parent().parent().data('colorwell');
			var hsl = picker.data('hsl');
			hsl.s = saturation;
			hsl.l = luminance;
			var newHex = rgbToHex(hslToRGB(hsl));
			colorwell.val(newHex);
			colorwell.change();
			picker.data('hsl', hsl);
			pickerUpdate(picker, true);
		}
		$('body').css({ 'user-select': 'none'});
		mouseSLTracker(e); // run once on click
		$('body').mousemove(mouseSLTracker);
		$('body').mouseup(function() {
			$('body').css({ 'user-select': 'auto'});
			$('body').off('mousemove', mouseSLTracker);
		});
	});
}

function getRecentPalette(paletteID) {
	var returnPalette = null;
	$('.inner.clearfix:contains("Recent Palettes")').children('.inner.boxLink.tb1').each(function() {
		var palette = $(this);
		if (palette.data('paletteID') == paletteID) {
			returnPalette = palette;
			return false; // break .each()
		}
	});
	return returnPalette;
}

function getUserPalette(paletteID) {
	var returnPalette = null;
	$(BOTB_PALETTES_PANEL_ID).children('[id^="pal"]').each(function() {
		var palette = $(this);
		if (palette.data('paletteID') === paletteID)
			returnPalette = palette;
	});
	return returnPalette;
}

function getPalette(paletteID){
	var returnPalette = null;
	returnPalette = getUserPalette(paletteID);
	if (returnPalette) return returnPalette;
	return getRecentPalette(paletteID);
}

function updateUserPalettePane() {
	$(BOTB_PALETTES_PANEL_ID).children('[id^="pal"]').each(function() {
		var palette = $(this);
		palette.find('.sloppy-current').css('display', 
			(palette.data('paletteID') == activePaletteID) ? 
			'inline-block' : 'none');
		palette.find('.sloppy-unsaved').css('display', 
			palette.data('saved') ? 
			'none' : 'inline');
	});
}

function checkIfUserPalette(paletteID) {
	var returnCheck = false;
	$(BOTB_PALETTES_PANEL_ID).children('[id^="pal"]').each(function() {
		var palette = $(this);
		if (palette.data('paletteID') === paletteID)
			returnCheck = true;
	});
	return returnCheck;
}

function checkIfUserPaletteDirect(palette) {
	return (palette.children('.titty').length != 0);
}

function extractSwatchBlockColor(swatchBlock) {
	var rgbValue = swatchBlock.css('background-color');
	if (!/\#[0-9a-fA-F]{3,6}/g.test(rgbValue)) {
		var regex = /rgb\s*\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/g;
		var match = regex.exec(rgbValue);
		if (match != null) {
			rgbValue = rgbToHex({
				r: match[1],
				g: match[2],
				b: match[3]
			});
		} else {
			// uhho, bad palette??
			rgbValue = "#000000"; // fallback
		}
	}
	return rgbValue;
}

function getPaletteColors(palette) {
	var colors = [];
	palette.children('.swatchBBlock, .swatchBlock').each(function() {
		colors.push(extractSwatchBlockColor($(this)));
	});
	return colors;
}

function getPaletteTitle(palette) {
	if (checkIfUserPaletteDirect(palette))
		return palette.children('.titty').text();
	return palette.find('.hMiniSeperator').next().text();
}

function activePaletteTitle() {
	return $('input[name="title"]');
}

function createHiddenPalette(paletteID) {
	$('.inner.clearfix:contains("Recent Palettes")').append(
		'<a id="sloppy-unknown-palette" class="inner boxLink tb1" style="display:none"></a>'
	);
	$('#sloppy-unknown-palette').data('paletteID', paletteID);
}

function loadPalette(palette) {
	activePaletteID = palette.data('paletteID');
	updateUserPalettePane();
	if (palette.attr('id') === "sloppy-unknown-palette") {
		// if loading a palette not on the page (like, by url)
		$('#CPsave').css('display', 'none');
		$('#sloppy-palinfo').css('display', 'inline');
		$('#sloppy-palinfo-creator').text("unknown !! O:");
		$('#sloppy-palinfo-title').text(activePaletteTitle().val());
		$('#paletteTitle').css('display', 'none');	
		return;
	}
	var colors = palette.children('.swatchBBlock, .swatchBlock');
	$('.swatch').each(function(index) {
		var swatch = $(this);
		var colorwell = swatch.children('.colorwell');
		var rgbValue = extractSwatchBlockColor(colors.eq(index));
		colorwell.val(rgbValue);
		colorwellProcess(colorwell);
	});
	if (checkIfUserPaletteDirect(palette)) {
		// user's own palette
		$('input[name=title]').val(getPaletteTitle(palette));
		$('#CPsave').css('display', 'inline');
		$('#sloppy-palinfo').css('display', 'none');
		$('#paletteTitle').css('display', 'inline');
		updateUserPalettePane();
	} else {
		// palette from the recent palettes list
		$('#CPsave').css('display', 'none');
		$('#sloppy-palinfo').css('display', 'inline');
		$('#sloppy-palinfo-creator').text(palette.find('.tb1').text());
		$('#sloppy-palinfo-title').text(getPaletteTitle(palette));
		$('#paletteTitle').css('display', 'none');
	}
	pickerUpdate($('#picker'), false);
}

function loadPaletteID(paletteID) {
	// search botbr's palettes 1st
	var found = false;
	$(BOTB_PALETTES_PANEL_ID).children('[id^="pal"]').each(function() {
		var palette = $(this);
		if (palette.data('paletteID') == paletteID) {
			loadPalette(palette);
			found = true;
			return false; // break .each()
		}
	});
	if (found) return;
	// search recent palettes next
	$('.inner.clearfix:contains("Recent Palettes")').children('.inner.boxLink.tb1').each(function() {
		var palette = $(this);
		if (palette.data('paletteID') == paletteID) {
			loadPalette(palette);
			found = true;
			return false; // break .each()
		}
	});
}

function defaultPaletteCreatorHTML(newPaletteID) {
	return '<a id="pal' + newPaletteID + '" class="inner boxLink tb1 sloppy-newgen" '
	+ 'style="">'
	+ '<span class="titty">New Palette</span>'
	+ '<br>'
	+ '<div class="col1 swatchBlock" style="background: #000000;"></div>'
	+ '<div class="col2 swatchBlock" style="background: #444444;"></div>'
	+ '<div class="col3 swatchBlock" style="background: #888888;"></div>'
	+ '<div class="col4 swatchBlock" style="background: #dddddd;"></div>'
	+ '<div class="col5 swatchBlock" style="background: #ffffff;"></div>'
	+ '<br style="clear:both;">'
	+ '</a><div class="hMiniSeperator">&nbsp;</div>'
}

function sloppyPickorzHTMLSetup() {
	// setup new html -----
	$('span:contains("PaletteEditor")').after(
		'<span class="t2">v2.0</span>'
	);
	$('#paletteTitle').after(
		'<div id="sloppy-palinfo" style="width: 200px;display: none">'
		+ '<span class="tb2" id="sloppy-palinfo-title">Hidden Title</span>'
		+ '<span class="t1"> by </span>'
		+ '<span class="tb2" id="sloppy-palinfo-creator">BotBr</span>'
		+ '</div>'
	);
	$('#sloppy-palinfo').css({
		'float': 'right',
		'margin': '4px 40px 4px 0'
	})
	$('#CPsave').after(
		' <a href="Duplicate" id="CPDuplicate" class="CPicon" rel="Duplicate Palette O: b10">'
		+ '<div class="botb-icon icons-zip"></div>'
		+ '</a>'
	);
	$('#CPDuplicate').after(
		' <a href="Revert" id="CPRevert" class="CPicon" rel="Revert to original state!!">'
		+ '<div class="botb-icon icons-outbound"></div>'
		+ '</a>'		
	);
	// button events -----
	/* 
		--- ajax info ---
		[NEW PALETTE]
			url: http://battleofthebits.org/palette/AjaxNew/
			response:
				EPICWINZ([0-9]*)
				Earn more boons, n00b! :D/
		[SAVE PALETTE]
			url: http:/battleofthebits.org/palette/AjaxSave/####/
			form: 
				paletteID: ####
				title: text
				color1: #RRGGBB
				color2: #RRGGBB
				color3: #RRGGBB
				color4: #RRGGBB
				color5: #RRGGBB
			response: 
				EPICWINZ
				EPIC SERVER FAIL =O
				Not your palette, n00b! :0
		[SET AS PALETTE]
			url: http://battleofthebits.org/palette/AjaxSet/####/
			response:
				EPICWINZ
				EPIC SERVER FAIL =O
		-----------------
	*/
	var msgSpan = $('#CPmsg span');

	// when debug's on: 
	// always returns success w/o actually
	// modifying the palettes server-side

	$('#paletteMenu').find('.botb-icon').hover(
		function() {
			var icon = $(this).parent();
			msgSpan.stop(false, true).hide();
			msgSpan.text(icon.attr('rel'));
			msgSpan.fadeIn(200); 
		}, function() {
			msgSpan.fadeOut(200);
		}
	);

	$('#CPDuplicate').click(function(e){
		e.preventDefault();
		var palette = getPalette(activePaletteID);
		var title = getPaletteTitle(palette);
		var colors = getPaletteColors(palette);
		msgSpan.text('duplicating palette...');
		if (!$('#CPpalette_new').click()) {
			msgSpan.text('BORKED! D: no new palette!!!!').show();
			return false;
		}
		$('.swatch').find('.colorwell').each(function(index) {
			var colorwell = $(this);
			colorwell.val(colors[index]);
			colorwellProcess(colorwell);
		});
		var palette = getPalette(activePaletteID);
		palette.children('.titty').text(title);
		activePaletteTitle().val(title);
		palette.data('original', {
			title: title,
			colors: colors
		});
		if (!$('#CPsave').click()) {
			msgSpan.text('made new palette, but failed saving )-: !! (maybe try saving???)').show();
			return false;
		}
		msgSpan.text('DUPED !! O=').show();
	});

	$('#CPpalette_new').click(function(e)  {
		e.preventDefault();
		msgSpan.text('creating new palette...');
		var paletteID = $('#paletteID').text();
		if (SLOPPY_DEBUG) {
			msgSpan.text('Thanks for the boons, n00b!').show();
			var newPaletteID = SLOPPY_DEBUG_PAL;
			SLOPPY_DEBUG_PAL++;
			var newPaletteHTML = defaultPaletteCreatorHTML(newPaletteID);
			$(BOTB_PALETTES_PANEL_ID).prepend(newPaletteHTML);
			var palette = $('.sloppy-newgen');
			setupPaletteForSloppy(palette, newPaletteID);
			loadPaletteID(newPaletteID);
			palette.hide().fadeIn(500);
			return true;
		}
		$.get('/palette/AjaxNew/', '', function(data) {
			successRegex = /EPICWINZ([0-9]+)/g;
			if (successRegex.test(data)) {
				msgSpan.text('Thanks for the boons, n00b!').show();
				var match = successRegex.exec(data);
				var newPaletteID = match[1];
				var newPaletteHTML = defaultPaletteCreatorHTML(newPaletteID);
				$(BOTB_PALETTES_PANEL_ID).prepend(newPaletteHTML);
				var palette = $('.sloppy-newgen');
				setupPaletteForSloppy(palette, newPaletteID);
				loadPaletteID(newPaletteID);
				return true;
			}
			else  {
				msgSpan.text(data).show();
				return false;
			}
		});
	});

	$('#CPsave').click(function(e) {
		e.preventDefault();
		msgSpan.text('saving...');
		var palette = getPalette(activePaletteID);
		var colors = getPaletteColors(palette);
		var ajaxObject = {
			'paletteID': activePaletteID,
			'title': activePaletteTitle().val()		
		};
		if (SLOPPY_DEBUG) {
			msgSpan.text('Your changes have been saved.').show();
			palette.data('saved', true);
			updateUserPalettePane();
			return true;
		}
		$.post('/palette/AjaxSave/'+activePaletteID+'/', ajaxObject, function(data)  {
			if (data === 'EPICWINZ') {
				msgSpan.text('Your changes have been saved.').show();
				palette.data('saved', true);
				updateUserPalettePane();
				return true;
			}
			else  {
				msgSpan.text(data).show();
				return false;
			}
		});
	});
}

function setupPaletteForSloppy(palette, paletteID) {
	palette.removeClass('sloppy-newgen');
	palette.data('paletteID', paletteID);
	palette.click(function() {
		loadPaletteID(paletteID);
	});
	if (checkIfUserPaletteDirect(palette)) {
		// the botbrs own palettes
		palette.prepend(
			'<div class="botb-icon icons-pencil sloppy-current" style="display:none"></div>'
			+ '<div class="tb0 sloppy-unsaved" style="display:none;width:100%;text-align:right">&nbsp;unsaved!&nbsp;'
			+ '<div class="botb-icon icons-alert" style="display:inline-block"></div><br></div>'
		);
		palette.data('saved', true);
	}
	var title = getPaletteTitle(palette);
	var colors = getPaletteColors(palette);
	palette.data('original', {
		title: title,
		colors: colors
	})
	palette.removeAttr('href');
}

function paletteInitProcessing() {
	var palette = $(this);
	urlArray = $(this).attr('href').split('/');
	for(var i=0; i<urlArray.length; i++) {
		if (urlArray[i].trim().length === 0) {
			urlArray.splice(i, 1);
			i--;
		}
	}
	var paletteID = urlArray[urlArray.length-1];
	setupPaletteForSloppy(palette, paletteID);
}

function swatchInitProcessing() {
	var swatchFocused = {
		'border': '2px solid', 
		'padding': '3px' 
	};
	var swatchUnfocused = {
		'border': '0px',
		'padding': '5px'
	};

	var swatch = $(this);
	var colorwell = swatch.children('.colorwell');
	// activate swatch on click
	swatch.on('mousedown', function() {
		var swatch = $(this);
		$('.swatch').each(function() {
			$(this).css(swatchUnfocused);
		});
		var colorwell = $(this).children('.colorwell');
		swatch.css(swatchFocused);
		pickerAttach($('#picker'), colorwell);
	});
	// create handlers for changes
	colorwell.on('paste keyup change', function() {
		colorwellProcess($(this));
		pickerUpdate($('#picker'), false);
		// mark palette as unsaved
		if (checkIfUserPalette(activePaletteID)) {
			var palette = getUserPalette(activePaletteID);
			palette.data('saved', false);
			updateUserPalettePane();
		}
	});
	colorwellProcess(colorwell);
}

function titleChangerSetup() {
	activePaletteTitle().on("change keyup paste", function() {
		if (!checkIfUserPalette(activePaletteID)) return;
		var input = $(this);
		var palette = getUserPalette(activePaletteID);
		palette.children('.titty').text(input.val());
		palette.data('saved', false);
		updateUserPalettePane();
	});
}

// global
var activePaletteID; // current working-space palette

var SLOPPY_DEBUG_PAL = 9999;
var SLOPPY_DEBUG = true;
var BOTB_PALETTES_PANEL_ID = '#botbrPaletts';

$(document).ready(function() {
	activePaletteID = $('#paletteID').text();

	// activePaletteID = 1; (testing hidden palettes)
	if (!getPalette(activePaletteID)) {
		// palette does not exist on page, create it
		// (if visiting directly by url, and not on recent list)
		createHiddenPalette(activePaletteID);
	}

	// remove text shadows (might implement later)
	$('head').children('style:contains("#pageWrap{text-shadow")').remove();
	$('#pageWrap').css('text-shadow', '');
	$('a').css('text-shadow', '');

	pickerInit($('#picker')); // init picker
	$('.swatch').each(swatchInitProcessing);
	$('#swatch1').mousedown(); // select 1st swatch

	// new cool palette editing functionality
	var availPalettes = $('a[href*="/barracks/PaletteEditor/"]');
	availPalettes.each(paletteInitProcessing);
	titleChangerSetup();
	sloppyPickorzHTMLSetup();
	loadPaletteID(activePaletteID);
});