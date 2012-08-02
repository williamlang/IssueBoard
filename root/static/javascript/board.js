var alphabet = "abcdefghijklmnopqrstuvwxyz";

function stringToColor(str) {
    while (str.length < 6) {
	str += str;
    }

    var normalizer = "a".charCodeAt(0);

    var r = ((str.charCodeAt(0) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(1) - normalizer) % 16).toString(16)[0];
    var g = ((str.charCodeAt(2) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(3) - normalizer) % 16).toString(16)[0];
    var b = ((str.charCodeAt(4) - normalizer) % 16).toString(16)[0] + ((str.charCodeAt(5) - normalizer) % 16).toString(16)[0];

    var color = r + g + b;

    return "#" + color;
}

function convertJIRAStatus(jiraStatus) {
    return jiraStatus.toLowerCase().replace(/\s/, "_");
}

