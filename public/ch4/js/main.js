        $(document).ready(function () {
            const GAME = getUrlParameter("game");

            //Click function
            clickActivePlayer1();

            //Function Player 1
            function clickActivePlayer1(element) {
                $('.img-fluid.player1').removeClass("active");
                $(element).addClass("active");
                if (GAME == 'computer' && $('.player1').hasClass("active")) {
                    showToasted('Wait For The Computer To Choose!');
                }
            }

            $('.img-fluid.player1').click(function (e) {
                clickActivePlayer1(this);
            });
            //Game Function
            var myInterval = setInterval(function () {
                if (GAME == 'computer') {
                    function compThink() {
                        for (var i = 1; i < 10; i++) {
                            let random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
                            console.log(random);
                            switch (random) {
                                case 1:
                                    $('.img-fluid.player2').removeClass("active");
                                    $('#batu-player2').addClass("active");
                                    break;
                                case 2:
                                    $('.img-fluid.player2').removeClass("active");
                                    $('#kertas-player2').addClass("active");
                                    break;
                                case 3:
                                    $('.img-fluid.player2').removeClass("active");
                                    $('#gunting-player2').addClass("active");
                                    break;
                            }
                        }
                    }
                    if ($('.player1').hasClass("active")) {
                        setTimeout(compThink(), 3000);
                    }
                }
                var player1;
                var player2;
                if ($('.player2').hasClass("active")) {
                    console.log("Player 2 Active");
                    player2 = $('.player2.active').attr("id");
                }
                if ($('.player1').hasClass("active")) {
                    console.log("Player 1 Active");
                    player1 = $('.player1.active').attr("id");
                }

                if (player1 != null && player2 != null) {
                    var player1Choice = player1.split("-");
                    var player2Choice = player2.split("-");
                    $('.img-fluid.player1').off("click");
                    $('.img-fluid.player2').off("click");
                    $('#mains h2').addClass("active");
                    var res = checkWinner(player1Choice[0], player2Choice[0]);
                    if (res == 'DRAW') {
                        $('#mains h2').addClass("draw");
                    }
                    $('#mains h2').html(res);
                    showToasted(res);
                    clearInterval(myInterval);
                } else if (player1 == null && player2 != null) {
                    showToasted('Player 1 not choice yet!');
                } else if (player1 != null && player2 == null) {
                    showToasted('Player 2 not choice yet!');
                } else {
                    showToasted('Choice Now!');
                }
            }, 2000);
            //notif untuk pengguna
            function showToasted(info) {
                $.toast({
                    heading: 'Information',
                    text: info,
                    icon: 'info',
                    loader: true, // Change it to false to disable loader
                    loaderBg: '#9EC600', // To change the background
                    hideAfter: 2000,
                })
            }
            //check pemenang
            function checkWinner(player1, player2) {
                var result;
                var namePlayer2 = $("#player-two h1").text();
                if (player1 == player2) {
                    result = 'DRAW';
                } else {
                    if (player1 == 'batu' && player2 == 'kertas') {
                        result = namePlayer2 + ' win';
                    } else if (player1 == 'batu' && player2 == 'gunting') {
                        result = 'Player 1 win';
                    } else if (player1 == 'kertas' && player2 == 'batu') {
                        result = 'Player 1 win';
                    } else if (player1 == 'kertas' && player2 == 'gunting') {
                        result = namePlayer2 + ' win';
                    } else if (player1 == 'gunting' && player2 == 'kertas') {
                        result = 'Player 1 win';
                    } else if (player1 == 'gunting' && player2 == 'batu') {
                        result = namePlayer2 + ' win';
                    } else {
                        result = 'Game is not match';
                    }
                }

                return result;
            }

            //Get the Game
            if (GAME == 'computer') {
                $("#player-two").html("<h1>COM</h1>");

                function compThink() {
                    for (var i = 1; i < 10; i++) {
                        let random = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
                        console.log(random);
                        switch (random) {
                            case 1:
                                $('.img-fluid.player2').removeClass("active");
                                $('#batu-player2').addClass("active");
                                break;
                            case 2:
                                $('.img-fluid.player2').removeClass("active");
                                $('#kertas-player2').addClass("active");
                                break;
                            case 3:
                                $('.img-fluid.player2').removeClass("active");
                                $('#gunting-player2').addClass("active");
                                break;
                        }
                    }
                }
                if ($('.player1').hasClass("active")) {
                    setTimeout(compThink(), 3000);
                }
            } else {
                //Click Function
                clickActivePlayer2();

                //Function Player 2
                function clickActivePlayer2(element) {
                    $('.img-fluid.player2').removeClass("active");
                    $(element).addClass("active");
                }

                $('.img-fluid.player2').click(function (e) {
                    clickActivePlayer2(this);
                });
            }

            //mulai ulang permainan
            $("#refresh").click(function () {
                location.reload();
            })

        });
        //Pop The Modal Game
        $(window).on('load', function () {
            var game = getUrlParameter('game');
            console.log(game);
            if (game != 'computer') {
                $('#staticBackdrop').modal('show');
            }
        });
        //To get Param Of the page
        var getUrlParameter = function getUrlParameter(sParam) {
            var sPageURL = window.location.search.substring(1),
                sURLVariables = sPageURL.split('&'),
                sParameterName,
                i;

            for (i = 0; i < sURLVariables.length; i++) {
                sParameterName = sURLVariables[i].split('=');

                if (sParameterName[0] === sParam) {
                    return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
                }
            }
            return false;
        };