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
			$('.uiWindow.closeTab').off('mouseenter mouseleave');
			$('.uiWindow.closeTab').hover(
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
			$('.uiWindow.closeTab').off('mouseenter mouseleave');
			$('.uiWindow.closeTab').hover(
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

function colorwellProcess(colorwell, debug) {
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
	if (!debug) return;
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

function pickerUpdate(picker) {
	// update markers and color based on picker data
	var hsl = picker.data('hsl');
	var base = picker.children('.sloppy-base');
	var hMarker = base.children('.h-sloppy-marker');
	var slMarker = base.children('.sl-sloppy-marker');
	var RADIUS = 84;
	var CENTER_X = 97;
	var CENTER_Y = 97;
	var hx = Math.cos(degToRad(hsl.h-90))*RADIUS+CENTER_X;
	var hy = Math.sin(degToRad(hsl.h-90))*RADIUS+CENTER_Y;
	hMarker.css({
		'top' : hy+'px',
		'left' : hx+'px'
	});

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
			'position' : 'relative'
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
	$('<div/>' , {
		class: 'sloppy-wheel',
		css: {
			'background' : 'url("http://battleofthebits.org/styles/img/wheel.png") no-repeat',
			'position' : 'absolute',
			'width' : '195px',
			'height' : '195px'
		}
	}).appendTo(base);
	$('<div/>' , {
		class: 'sloppy-mask',
		css: {
			'background' : 'url("http://battleofthebits.org/styles/img/mask.png") no-repeat',
			'position' : 'absolute',
			'width' : '101px',
			'height' : '101px',
			'top' : '47px',
			'left' : '47px'
		}	
	}).appendTo(base);
	$('<div/>' , {
		class: 'sloppy-marker h-sloppy-marker',
		css: {
			'background' : 'url("http://battleofthebits.org/styles/img/marker.png") no-repeat',
			'position' : 'absolute',
			'width' : '17px',
			'height' : '17px',
			'overflow' : 'hidden',
			'margin' : '-8px 0 0 -8px',
			'top' : '0px',
			'left' : '0px'
		}	
	}).appendTo(base);
	$('<div/>' , {
		class: 'sloppy-marker sl-sloppy-marker',
		css: {
			'background' : 'url("http://battleofthebits.org/styles/img/marker.png") no-repeat',
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
		s: '1',
		l: '0.5'
	});
	pickerUpdate(picker);
}

$(document).ready(function() {
	// remove text shadows (might implement later)
	$('head').children('style:contains("#pageWrap{text-shadow")').remove();
	$('#pageWrap').css('text-shadow', '');
	$('a').css('text-shadow', '');
	/* 
	   set the backgrounds of the text inputs &
	   create callbacks that properly set the values 
	*/
	var swatchFocused = {
		'border': '2px solid', 
		'padding': '3px' 
	};
	var swatchUnfocused = {
		'border': '0px',
		'padding': '5px'
	};
	pickerInit($('#picker'));
	$('.swatch').each(function () {
		var swatch = $(this);
		var colorwell = swatch.children('.colorwell');
		// activate swatch on click
		swatch.on('click', function() {
			$('.swatch').each(function() {
				$(this).css(swatchUnfocused);
			});
			$(this).css(swatchFocused);
		});
		// create handlers for changes
		colorwell.on('change paste keyup', function() {
			colorwellProcess($(this), true);
		});
		colorwell.change(); // run init
	});
	$('#swatch1').click(); // run init
});