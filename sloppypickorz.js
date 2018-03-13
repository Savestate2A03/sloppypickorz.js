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
	if (hex)
	hex = hex.substring(1, hex.length);
	if (hex.length == 3) {
		r = parseInt(hex.charAt(0), 16) * 16;
		g = parseInt(hex.charAt(1), 16) * 16;
		b = parseInt(hex.charAt(2), 16) * 16;
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
			$('body').css('color', color);
			$('html').css('color', color);
			$('a').off('mouseenter mouseleave');
			$('a').hover(
				function() { $(this).css('color', color); },
				function() { $(this).css('color', getSwatchColor('link')); }
			);
			$('.logo2').css('color', color);
			$('.boxLink').off('mouseenter mouseleave');
			$('.boxLink').hover(
				function() { 
					$(this).css('background', color
					+ ' url(/styles/img/topNoiseShade.png) repeat-x' ); 
				},
				function() { 
					$(this).css('background', getSwatchColor('button')
					+ ' url(/styles/img/topNoiseShade.png) repeat-x' ); 
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
			$('a.boxLink').off('mouseenter mouseleave');
			$('a.boxLink').hover(
				function() { $(this).css('color', getSwatchColor('bottom')); },
				function() { $(this).css('color', color); }
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
			$('a.boxLink').off('mouseenter mouseleave');
			$('a.boxLink').hover(
				function() { $(this).css('background', getSwatchColor('bottom')); },
				function() { $(this).css('background', color); }
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
		// ::::: UHHHHHH :::::
		default:
	}	
}

$(document).ready(function() {
	/* 
	   set the backgrounds of the text inputs &
	   create callbacks that properly set the values 
	*/
	$('.swatch').each(function () {
		var swatch = $(this);
		var colorwell = swatch.children('.colorwell');
		// create handlers for changes
		colorwell.on('change paste keyup', function() {
			// variables / overrides
			var colorwell = $(this);
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
			//colorwell.parent().css('color', '#000');
			colorwell.css('color', luma_color);
			colorwell.parent().css('color', luma_color);
		});
		colorwell.change(); // run init
	});

});