$(document).ready(function () {
    $(window).scroll(function () {

        var CoHeight = $('body').height(); //ページ全体の高さ代入
        var Scrolly = $(window).scrollTop(); //スクロール位置代入

        var percent1 = CoHeight / 100; //1%を計算
        var percentAll = (Scrolly * 1.6) / percent1; //スクロール位置を1％で割る＆誤差補正

        var percentFin = Math.round(percentAll); //小数点を四捨五入
        if (percentFin > 100) percentFin = 100; //100%以上加算されないように制御

        $(".percent_text").html("<span>" + percentFin + "</span>%"); //パーセントを数字で表示
        $(".percent_block .string").css("height", percentFin + "%"); //パーセントをバーで表示
        $(".opposite_block .string").css("height", 100 - percentFin + "%"); //パーセントをバーで表示
    });
});


$(document).ready(function () {
    $(window).scroll(function () {

        var CoHeight = $('body').height(); //ページ全体の高さ代入
        var Scrolly = $(window).scrollTop(); //スクロール位置代入

        var percent1 = CoHeight / 100; //1%を計算
        var percentAll = (Scrolly * 1.6) / percent1; //スクロール位置を1％で割る＆誤差補正

        var percentFin = Math.round(percentAll); //小数点を四捨五入
        if (percentFin > 100) percentFin = 100; //100%以上加算されないように制御

        $(".percent_text").html("<span>" + percentFin + "</span>%"); //パーセントを数字で表示
        $(".percent_block .string").css("height", percentFin + "%"); //パーセントをバーで表示
        $(".opposite_block .string").css("height", 100 - percentFin + "%"); //パーセントをバーで表示
    });
});
