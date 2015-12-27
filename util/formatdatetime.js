exports.formatTime = function (date) {
    return checkTime(date.getHours()) + ":" + checkTime(date.getMinutes());
}

exports.formatDate = function (date, breaker) {
    if(breaker) {
        return date.getFullYear() + breaker + (date.getMonth()+1) + breaker + date.getDate();
    }
    return date.getFullYear() + "/" + (date.getMonth()+1) + "/" + date.getDate();
}

function checkTime(i)
{
    if (i<10)
    {i="0" + i}
    return i
}