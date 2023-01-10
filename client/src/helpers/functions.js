let pageX = 0;
let pageY = 0;

// obtain pageX and pageY on mousemove or touchmove event
['mousedown', 'touchstart', 'mousemove', 'touchmove'].forEach(event => {
	document.addEventListener(event, (e) => {
		pageX = e.touches?.length > 0 ? e.touches[0].pageX : e.pageX;
		pageY = e.touches?.length > 0 ? e.touches[0].pageY : e.pageY;
	})
})

function isSet(variable) {
	return (typeof variable != undefined && variable !== null);
}

function clamp(min, val, max) {
	return Math.min(Math.max(val, min), max);
}

function padZero(num, len = 2, str = '0') {
	return String(num).padStart(len, str);
}

function emitEvent(callback, data) {
	if(typeof callback == 'function')
		callback(data);
}

// Don't forget to update the #loading-screen__icon element
// in '/client/index.html' when editing this function!
function createIconNode({name, src, color, size = 'md', rotate = 0, classList = ''}) {
	const el    = document.createElement(typeof src == 'string' ? 'img' : 'span');
	let classes = [];

	if(typeof src == 'string') {
		el.src = src;
	} else {
		if(typeof name != 'string') name = 'null.null';

		const [ library, icon ] = name.split('.');

		// get classes
		classes = getIconNodeClasses(library, icon);

	}

	classes.push(
		'Icon', 
		`Icon_size_${size}`,
		...classList?.split(' ') || ''
	);

	el.classList = classes.join(' ');

	if(color != undefined)
		el.style.color = `var(--clr-${color})`;

	if(rotate != undefined)
		el.style.transform = `rotate(${rotate}deg)`;

	return el;
}

function getIconNodeClasses(library, icon) {
	switch(library) {
		case 'fab': 
			return ['fa-brands', `fa-${icon}`];
		case 'fad': 
			return ['fa-duotone', `fa-${icon}`];
		case 'fal':
			return ['fa-light', `fa-${icon}`];
		case 'far': 
			return ['fa-regular', `fa-${icon}`];
		case 'fas': 
			return ['fa-solid', `fa-${icon}`];
		case 'fat': 
			return ['fa-thin', `fa-${icon}`];
		default:
			return [];
	}

}

function objectGetValueByPath(object, path) {
	try {
		return path.split('.').reduce((previous, current) => previous[current], object);
	} catch(err) {
		return;
	}
}


function throttle(callback, delay = 300) {
	let timeout;
	return function(...args) {
		if (timeout) return;

		timeout = setTimeout(function() {
			callback(...args)
		}, delay);
	}
}

function debounce(callback, delay = 300) {
	let timeout

	return function(...args) {
		clearTimeout(timeout)

		timeout = setTimeout(() => {
			callback(...args)
		}, delay)
	}
}

function unescapeEntities(str) {
	const span = document.createElement('span');
	span.innerHTML = str;
	return span.textContent;
}

function getURLSearchParam(key) {
	const url      = String(window.location).split('?');
	const queryStr = '?' + url[url.length - 1];

	const urlParams = new URLSearchParams(queryStr);
	return urlParams.get(key);
}

function getCSSVariable(name) {
	return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`);
}

function dateGetMidnight(dateObj) {
	const d = new Date(dateObj);
  	return d.setHours(0,0,0,0);
}

function dateGetFirstWeekday(dateObj) {
  const d = new Date(dateObj);

  const day  = d.getDay();
  const diff = d.getDate() - day + (day == 0 ? -6:1); 

  return d.setDate(diff);
}

function isArray(a) {
    return (!!a) && (a.constructor === Array);
}

function isObject(a) {
    return (!!a) && (a.constructor === Object);
}

// Overwrite String.prototype.trim() function
function trim(str, chars = ' ', fromStart = true, fromEnd = true) {
	let start = 0, 
        end = str.length;

	if(fromStart) {
		while(start < end && chars.indexOf(str[start]) >= 0)
			++start;
	}

	if(fromEnd) {
		while(end > start && chars.indexOf(str[end - 1]) >= 0)
			--end;
		}

    return (start > 0 || end < str.length) ? str.substring(start, end) : str;
}

function trimStart(str, chars) {
	return trim(str, chars, true, false);
}

function trimEnd(str, chars) {
	return trim(str, chars, false, true);
}

function capitalize(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function nthIndexOfStr(haystack, needle, n) {
	let len = haystack.length
	let i   = -1;
	
	n += 1;

    while(n-- && i++ < len){
        i = haystack.indexOf(needle, i);
        if (i < 0) break;
    }

    return i;
}

function mapObject(obj, cb) {
	let res = {};
	Object.entries(obj).forEach(([key, value]) => {
		res[key] = cb(value, key)
	});
	return res;
}

function getOffset(el) {
    const rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

function random(min, max) {
	return Math.floor(min + Math.random() * (max - min))
}

function getUniqueHex(length = 24) {
	let res = '';

	for (let i = res.length; i < length; i++) {
		res += random(0, 16).toString(16);
	}

	// include Date.now() for extra uniqueness
	if(res.length > 16) {
		const dateNowHex = Date.now().toString(16);
		const keepFirstChars = Math.max(res.length - dateNowHex.length, 0);
		res = res.substring(0, keepFirstChars) + dateNowHex + res.substring(keepFirstChars);

		// trim result
		res = res.substring(0, length);
	}

	return res;
}

export { 
	capitalize,
	clamp,
	createIconNode,
	dateGetFirstWeekday,
	dateGetMidnight,
	debounce,
	emitEvent,
	getCSSVariable,
	getIconNodeClasses,
	getUniqueHex,
	getURLSearchParam,
	isArray,
	isObject,
	isSet,
	mapObject,
	nthIndexOfStr,
	objectGetValueByPath,
	padZero,
	pageX,
	pageY,
	random,
	throttle,
	trim,
	trimEnd,
	trimStart,
	unescapeEntities
}
