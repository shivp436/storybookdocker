const moment = require('moment');

module.exports = {
    formatDate: function (date, format) {
        return moment(date).format(format);
    },
    truncate: function (str, len) {
        if (str.length > len && str.length > 0) {
            let newStr = str + ' ';
            newStr = str.substr(0, len);
            newStr = str.substr(0, newStr.lastIndexOf(' ')); // lastIndexOf() returns the last occurrence of the specified value
            // lastIndexOf(' ') returns the index of the last space in the string - this is the index of the last word in the string
            newStr = newStr.length > 0 ? newStr : str.substr(0, len);
            return newStr + '...';
        }
        return str;
    },
    stripTags: function (input) {
        return input.replace(/<(?:.|\n)*?>/gm, ''); // replaces html tags with an empty string
    },
    editIcon: function (storyUser, loggedUser, storyId, floating = true) {
        if (storyUser._id.toString() == loggedUser._id.toString()) {
            if (floating) {
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fa fa-edit fa-small"></i></a>`;
            } else {
                return `<a href="/stories/edit/${storyId}"><i class="fa fa-edit"></i></a>`;
            }
        } else {
            return '';
        }
    },
    select: function (selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp(' value="' + selected + '"'),
                '$& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            );
    },
};