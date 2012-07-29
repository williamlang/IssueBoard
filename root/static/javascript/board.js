var alphabet = "abcdefghijklmnopqrstuvwxyz";

function stringToColor(str) {
    var r = 0;
    var g = 0;
    var b = 0;

    // Calculate sum

    var sum = 0;

    for (i = 0; i < str.length; i++) {
	sum += alphabet.indexOf(str.charAt(i));
    }

    sum *= str.length;
    var remainderString = sum.toString();
    var remainder = parseInt(remainderString[remainderString.length - 2] + remainderString[remainderString.length - 1]);

    if (remainder <= 16) {
	r += sum;
    }
    else if (remainder <= 32) {
	g += sum;
    }
    else if (remainder <= 48) {
	b += sum;
    }
    else if (remainder <= 64) {
	r += sum;
	g += sum;
    }
    else if (remainder <= 70) {
	r += sum;
	b += sum;
    }
    else {
	g += sum;
	b += sum;
    }

    r = r % 255;
    g = g % 255;
    b = b % 255;

    if (r > 200 || g > 200 || b > 200) {
	r = Math.max(r - 20, 0);
	g = Math.max(g - 20, 0);
	b = Math.max(b - 20, 0);
    }

    return "#" + str_pad(r.toString(16), 2, "0", 'STR_PAD_LEFT') + str_pad(g.toString(16), 2, "0", 'STR_PAD_LEFT')  + str_pad(b.toString(16), 2, "0", 'STR_PAD_LEFT');
}

function str_pad (input, pad_length, pad_string, pad_type) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // + namespaced by: Michael White (http://getsprink.com)
    // +      input by: Marco van Oort
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *     example 1: str_pad('Kevin van Zonneveld', 30, '-=', 'STR_PAD_LEFT');
    // *     returns 1: '-=-=-=-=-=-Kevin van Zonneveld'
    // *     example 2: str_pad('Kevin van Zonneveld', 30, '-', 'STR_PAD_BOTH');
    // *     returns 2: '------Kevin van Zonneveld-----'
    var half = '',
        pad_to_go;

    var str_pad_repeater = function (s, len) {
        var collect = '',
            i;

        while (collect.length < len) {
            collect += s;
        }
        collect = collect.substr(0, len);

        return collect;
    };

    input += '';
    pad_string = pad_string !== undefined ? pad_string : ' ';

    if (pad_type != 'STR_PAD_LEFT' && pad_type != 'STR_PAD_RIGHT' && pad_type != 'STR_PAD_BOTH') {
        pad_type = 'STR_PAD_RIGHT';
    }
    if ((pad_to_go = pad_length - input.length) > 0) {
        if (pad_type == 'STR_PAD_LEFT') {
            input = str_pad_repeater(pad_string, pad_to_go) + input;
        } else if (pad_type == 'STR_PAD_RIGHT') {
            input = input + str_pad_repeater(pad_string, pad_to_go);
        } else if (pad_type == 'STR_PAD_BOTH') {
            half = str_pad_repeater(pad_string, Math.ceil(pad_to_go / 2));
            input = half + input + half;
            input = input.substr(0, pad_length);
        }
    }

    return input;
}
