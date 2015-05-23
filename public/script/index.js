/**
 * handle the page damn effect
 * */


$(function () {
    var TopBarHeight = $('#TopBar').height();

    var resizeRestHeightDivs = function () {
        var h = $(this).height() - TopBarHeight;
        $('.rh').height(h);
    };
    resizeRestHeightDivs();

    var calcRightEditor = function () {
        var windowWidth = $(this).width();
        var leftMenuWidth = $('#LeftMenu').width();
        var leftEditorWidth = $('#LeftEditor').width();
        var $vtBar = $('#Vtbar');
        var verticalBarWidth = $vtBar.width();
        $('#RightEditor').width(windowWidth - leftMenuWidth - leftEditorWidth - verticalBarWidth - 8);

        $vtBar.css('left', $('#LeftEditor').position().left + leftEditorWidth + 4);
    }();

    var dragVerticalBar = function () {
        $('#Vtbar').on('mousedown', function () {
            console.log('mouse down');
        }).on('mouseup', function () {
            console.log('mouse up');
        }).on('mousemove', function () {
            console.log('mouse move')
        });


    }();


    $(window).resize(function () {
        resizeRestHeightDivs();
    });
});