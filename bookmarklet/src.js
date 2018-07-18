$(function () {

    var type = 'turn';

    setInterval(tick, 1500);
    setInterval(anime, 150);

    function anime() {
        var bodybox = $('#bodybox');
        // bodybox.find('.anime:not(.act_chara)')
        bodybox.find('.anime')
            .animate({ 'marginLeft': '8px' }, 75)
            .animate({ 'marginLeft': '5px' }, 75);
    }

    function tick() {
        var bodybox = $('#bodybox');
        var obj = bodybox.children().eq(3);
        reset_eff();

        if (obj.find('p#pagename').length) {
            return;
        }
        obj.remove();
        var obj = bodybox.children().eq(3);

        if (obj.is('.turnStart')) {
        } else if (obj.is('.TSS')) {
            set_status();
            reset_eff();
        } else {
            var act_cha = obj.find('.statusBox:first');
            var target_cha = obj.find('.statusBox');
            var name = act_cha.find('.nameInBox');
            var logs = obj.find('.logs').text();
            name = name.text();
            set_status();
            reset_eff(/*same_color=*/true);
            log = logs.split("\n");
            var chain_act_flg = 0;
            for (var i = 0; i < log.length; i++) {
                log_text = log[i];
                // console.log(log_text);
                if (i == 1 || chain_act_flg == 1) {
                    chain_act_flg = 0;
                    match = log_text.match(/^(.*)の([^の]*?)$/);
                    if (match) {
                        chara_eff(match[1], 'skill', match[2]);
                    }
                    match = log_text.match(/^(.*?)の通常攻撃$/);
                    if (match) {
                        chara_eff(match[1], 'atk');
                    }
                    match = log_text.match(/^(.*?)の通常回復$/);
                    if (match) {
                        chara_eff(match[1], 'heal');
                    }
                }
                if(log_text == '連続行動'){
                    chain_act_flg = 1;
                }
                match = log_text.match(/^(.*?)は戦闘を離脱$/);
                if (match) {
                    chara_del(match[1]);
                }
                match = log_text.match(/^(.*?)に小ダメージ$/);
                if (match) {
                    chara_eff(match[1], 'dmg_S');
                }
                match = log_text.match(/^(.*?)に中ダメージ$/);
                if (match) {
                    chara_eff(match[1], 'dmg_M');
                }
                match = log_text.match(/^(.*?)に大ダメージ$/);
                if (match) {
                    chara_eff(match[1], 'dmg_L');
                }
                match = log_text.match(/^(.*?)の小ダメージを回復$/);
                if (match) {
                    chara_eff(match[1], 'dmg_S');
                }
                match = log_text.match(/^(.*?)の中ダメージを回復$/);
                if (match) {
                    chara_eff(match[1], 'dmg_M');
                }
                match = log_text.match(/^(.*?)の大ダメージを回復$/);
                if (match) {
                    chara_eff(match[1], 'dmg_L');
                }
                match = log_text.match(/^(.*?)の中ダメージを軽減$/);
                if (match) {
                    // chara_eff(match[1], 'dmg_S');
                    chara_eff(match[1], 'dmg_M');
                }
                match = log_text.match(/^(.*?)の大ダメージを軽減$/);
                if (match) {
                    // chara_eff(match[1], 'dmg_M');
                    chara_eff(match[1], 'dmg_L');
                }
            }
            chara_act(name);
            for (var i = 1; i < target_cha.length; i++) {
                var name = $(target_cha[i]).find('.nameInBox');
                name = name.text();
                target_chara(name);
            }
        }
    }

    function set_status() {
        var bodybox = $('#bodybox');
        var act_obj = bodybox.children().eq(3);
        act_obj.find('.statusBox').each(function () {
            var name = $(this).find('.nameInBox').text();
            var statuses = $(this).find('.statuses').clone();
            var bodybox = $('#bodybox');
            var obj = bodybox.children().eq(2);
            obj.find('.statusBox').each(function () {
                var sb_name = $(this).find('.nameInBox').text();
                if (name == sb_name) {
                    $(this).find('.statuses').remove();
                    $(this).append(statuses);
                }
            });
        });
    }

    function chara_act(name) {
        var bodybox = $('#bodybox');
        var obj = bodybox.children().eq(2);
        obj.find('.statusBox').each(function () {
            var sb_name = $(this).find('.nameInBox').text();
            if (name == sb_name) {
                $(this).addClass('act_chara');
                if ($(this).is('.blueTeam')) {
                    $(this).css('left', '50px');
                } else {
                    $(this).css('left', '-50px');
                }
            } else {
                $(this).css('left', '0');
            }
        });
    }

    function target_chara(name) {
        var bodybox = $('#bodybox');
        var obj = bodybox.children().eq(2);
        obj.find('.statusBox').each(function () {
            var sb_name = $(this).find('.nameInBox').text();
            if (name == sb_name) {
                $(this).addClass('anime');
            }
        });
    }

    function chara_del(name) {
        var bodybox = $('#bodybox');
        var obj = bodybox.children().eq(2);
        obj.find('.statusBox').each(function () {
            var sb_name = $(this).find('.nameInBox').text();
            if (name == sb_name) {
                $(this).remove();
            }
        });
    }

    function chara_eff(name, type, act_name) {
        var bodybox = $('#bodybox');
        var obj = bodybox.children().eq(2);
        obj.find('.statusBox').each(function () {
            var sb_name = $(this).find('.nameInBox').text();
            if (name == sb_name) {
                if ($(this).is('.blueTeam')) {
                    // $(this).css('margin-left', '10px');
                } else {
                    // $(this).css('margin-left', '-10px');
                }
                if (type == 'atk') {
                    $(this).css('background-color', '#ffdddd');
                }
                if (type == 'heal') {
                    $(this).css('background-color', '#ddddff');
                }
                if (type == 'skill') {
                    $(this).css('background-color', '#ffffdd');
                    $(this).find('.nameInBox').after('<div class="act_name" style="'+
                    'float: right; top: -20px; background-color: white; z-index: 1; position: relative; padding: 2px 5px;'+
                    '">' + act_name + '</div>');
                }
                if (type == 'dmg_S') {
                    $(this).find('.statuses').children().eq(2).css('width', '50px');
                    $(this).find('.statuses').children().eq(3).css('font-size', '34px');
                    // $(this).css('border-style', 'dashed');
                    // $(this).css('border-width', '2px');
                    // $(this).css('border-left-width', '5px');
                }
                if (type == 'dmg_M') {
                    $(this).find('.statuses').children().eq(4).css('width', '50px');
                    $(this).find('.statuses').children().eq(5).css('font-size', '34px');
                    // $(this).css('border-style', 'dashed');
                    // $(this).css('border-width', '2px');
                    // $(this).css('border-left-width', '5px');
                }
                if (type == 'dmg_L') {
                    $(this).find('.statuses').children().eq(6).css('width', '50px');
                    $(this).find('.statuses').children().eq(7).css('font-size', '34px');
                    // $(this).css('border-style', 'dashed');
                    // $(this).css('border-width', '2px');
                    // $(this).css('border-left-width', '5px');
                }
            }
        });
    }

    function reset_eff(same_color) {
        var bodybox = $('#bodybox');
        var obj = bodybox.children().eq(2);
        obj.find('.act_name').remove();
        obj.find('.statusBox').each(function () {
            $(this).removeClass('anime');
            $(this).removeClass('act_chara');
            $(this).css('margin', '5px');
            $(this).css('left', '0');
            $(this).find('.statuses').children().css('width', 'auto');
            $(this).find('.statuses').children().css('font-size', '17px');
            // $(this).css('border-style', '');
            // $(this).css('border-width', '');
            var statuses = $(this).find('.statuses');
            $(this).css('background-color', 'rgb(250,250,250)');
            for (var i = 1; i < 6; i++) {
                if (!same_color) {
                    $(this).find('.statuses').children().eq(1 + i * 2).removeClass('good').removeClass('bad');
                }
                if ($(this).find('.statuses').children().eq(1 + i * 2).text() != '0') {
                    $(this).find('.statuses').children().eq(1 + i * 2).css('font-size', '30px');
                } else {
                    $(this).find('.statuses').children().eq(1 + i * 2).css('font-size', '17px');
                }
            }
        });
    }
});