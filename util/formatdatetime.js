exports.formatTime = function (date) {
    return checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());
}

exports.formatDate = function (date, breaker) {
    if(breaker) {
        return date.getFullYear() + breaker + checkTime((date.getMonth()+1)) + breaker + checkTime(date.getDate());
    }
    return date.getFullYear() + "/" + checkTime((date.getMonth()+1)) + "/" + checkTime(date.getDate());
}

function checkTime(i)
{
    if (i<10)
    {i="0" + i}
    return i
}