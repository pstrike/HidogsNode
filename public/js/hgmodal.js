function showHgModal(itemId) {
    var el = document.getElementById(itemId);
    el.style.visibility = "visible";
    $('#'+itemId).removeClass('fade-out');
    $('#'+itemId).addClass('fade-in');
    $("body").addClass("hg-modal-open");
    $('body').animate({
        scrollTop: 0
    }, 0);

}

function hideHgModal(itemId) {
    var el = document.getElementById(itemId);
    $('#'+itemId).removeClass('fade-in');
    $('#'+itemId).addClass('fade-out');
    $("body").removeClass("hg-modal-open");
    setTimeout(function(){
        el.style.visibility = "hidden";
    }, 100);
}
