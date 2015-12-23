exports.formatTime = function (date) {
    return date.getHours() + ":" + date.getMinutes();
}

exports.formatDate = function (date, breaker) {
    if(breaker) {
        return date.getFullYear() + breaker + (date.getMonth()+1) + breaker + date.getDate();
    }
    return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
}