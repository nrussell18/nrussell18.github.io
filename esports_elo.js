
const LOL_LP_MULT = .13;
const OW_MULT = .102;
const DOTA_MULT = .11;
const SC2_MULT = .088;
const R6_MULT = .098;
const APEX_MULT = 0.072;
const CHESS_MULT = 0.18;
const HIVE_MULT = 0.45;
const CLASH_ROYALE_MULT = 0.055;
const FACEIT_MULT = 0.22;
const SMASH_MULT = 0.000042;
const SPLITGATE_MULT = 0.088;


const RANK_DIST = [
    {"name":"GRANDMASTER III", "value":2400, "color":"#E62A34", "icon":"grandmaster_3.fw.png"},
    {"name":"GRANDMASTER II", "value":2000, "color":"#E62A34", "icon":"grandmaster_2.fw.png"},
    {"name":"GRANDMASTER I", "value":1800, "color":"#E62A34", "icon":"grandmaster_1.fw.png"},
    {"name":"MASTER III", "value":1700, "color":"#B973FF", "icon":"master_3.fw.png"},
    {"name":"MASTER II", "value":1600, "color":"#B973FF", "icon":"master_2.fw.png"},
    {"name":"MASTER I", "value":1500, "color":"#B973FF", "icon":"master_1.fw.png"},
    {"name":"DIAMOND III", "value":1450, "color":"#22CBD6", "icon":"diamond_3.fw.png"},
    {"name":"DIAMOND II", "value":1400, "color":"#22CBD6", "icon":"diamond_2.fw.png"},
    {"name":"DIAMOND I", "value":1350, "color":"#22CBD6", "icon":"diamond_1.fw.png"},
    {"name":"PLATINUM III", "value":1300, "color":"#888888", "icon":"plat_3.fw.png"},
    {"name":"PLATINUM II", "value":1250, "color":"#888888", "icon":"plat_2.fw.png"},
    {"name":"PLATINUM I", "value":1200, "color":"#888888", "icon":"plat_1.fw.png"},
    {"name":"GOLD III", "value":1150, "color":"#FFD24D", "icon":"gold_3.fw.png"},
    {"name":"GOLD II", "value":1100, "color":"#FFD24D", "icon":"gold_2.fw.png"},
    {"name":"GOLD I", "value":1050, "color":"#FFD24D", "icon":"gold_1.fw.png"},
    {"name":"SILVER III", "value":1000, "color":"#DDDDDD", "icon":"silver_3.fw.png"},
    {"name":"SILVER II", "value":950, "color":"#DDDDDD", "icon":"silver_2.fw.png"},
    {"name":"SILVER I", "value":900, "color":"#DDDDDD", "icon":"silver_1.fw.png"},
    {"name":"BRONZE III", "value":800, "color":"#834B00", "icon":"bronze_3.fw.png"},
    {"name":"BRONZE II", "value":700, "color":"#834B00", "icon":"bronze_2.fw.png"},
    {"name":"BRONZE I", "value":600, "color":"#834B00", "icon":"bronze_1.fw.png"},
    {"name":"COPPER III", "value":500, "color":"#D2691E", "icon":"copper_3.fw.png"},
    {"name":"COPPER II", "value":300, "color":"#D2691E", "icon":"copper_2.fw.png"},
    {"name":"COPPER I", "value":0, "color":"#D2691E", "icon":"copper_1.fw.png"}
];


function get_lol_soloduo_rank()
{
    let value = parseInt(document.getElementById("lol_soloduo_rank").value);
    value += document.getElementById("lol_soloduo_lp").value * LOL_LP_MULT;
    return {"name":"League of Legends Soloduo", "value":value, "tier":1};
}

function get_lol_flex_rank()
{
    let value = parseInt(document.getElementById("lol_flex_rank").value);
    value += document.getElementById("lol_flex_lp").value * LOL_LP_MULT;
    return {"name":"League of Legends Flex", "value":value, "tier":5};
}

function get_ow_primary_rank()
{
    let value = document.getElementById("ow_primary_rank").value * OW_MULT;
    return {"name":"Overwatch Primary Role", "value":value, "tier":1};
}

function get_ow_secondary_rank()
{
    let value = document.getElementById("ow_secondary_rank").value * OW_MULT;
    return {"name":"Overwatch Secondary Role", "value":value, "tier":5};
}

function get_valorant_rank()
{
    let value = parseInt(document.getElementById("valorant_rank").value);
    return {"name":"Valorant", "value":value, "tier":1};
}

function get_csgo_rank()
{
    let value = parseInt(document.getElementById("csgo_rank").value);
    return {"name":"CSGO", "value":value, "tier":1};
}

function get_dota_rank()
{
    let value = document.getElementById("dota_rank").value * DOTA_MULT;
    return {"name":"Dota 2", "value":value, "tier":1};
}

function get_rl_primary_rank()
{
    let value = parseInt(document.getElementById("rl_primary_rank").value);
    value += parseInt(document.getElementById("rl_primary_division").value);
    return {"name":"Rocket League Primary Gamemode", "value":value, "tier":1};
}

function get_rl_secondary_rank()
{
    let value = parseInt(document.getElementById("rl_secondary_rank").value);
    value += parseInt(document.getElementById("rl_secondary_division").value);
    return {"name":"Rocket League Secondary Gamemode", "value":value, "tier":5};
}

function get_sc2_primary_rank()
{
    let value = document.getElementById("sc2_primary_rank").value * SC2_MULT;
    return {"name":"Starcraft 2 Primary Race", "value":value, "tier":1};
}

function get_sc2_secondary_rank()
{
    let value = document.getElementById("sc2_secondary_rank").value * SC2_MULT;
    return {"name":"Starcraft 2 Secondary Race", "value":value, "tier":5};
}

function get_r6_rank()
{
    let value = document.getElementById("r6_rank").value * R6_MULT;
    return {"name":"Rainbow Six Siege", "value":value, "tier":1};
}

function get_lor_rank()
{
    let value = parseInt(document.getElementById("lor_rank").value);
    value += document.getElementById("lor_lp").value * LOL_LP_MULT;
    return {"name":"Legends of Runeterra", "value":value, "tier":2};
}

function get_apex_rank()
{
    let value = document.getElementById("apex_rank").value * APEX_MULT;
    return {"name":"Apex Legends", "value":value, "tier":2};
}

function get_chess_rank()
{
    let value = document.getElementById("chess_rank").value * CHESS_MULT;
    return {"name":"Chess", "value":value, "tier":2};
}

function get_hive_rank()
{
    let value = document.getElementById("hive_rank").value * HIVE_MULT;
    return {"name":"Hive", "value":value, "tier":3};
}

function get_hearthstone_rank()
{
    let value = parseInt(document.getElementById("hearthstone_rank").value);
    value += parseInt(document.getElementById("hearthstone_division").value);
    return {"name":"Hearthstone", "value":value, "tier":4};
}

function get_smite_rank()
{
    let value = parseInt(document.getElementById("smite_rank").value);
    value += parseInt(document.getElementById("smite_division").value);
    return {"name":"Smite", "value":value, "tier":2};
}

function get_clash_royale_rank()
{
    let value = document.getElementById("clash_royale_rank").value * CLASH_ROYALE_MULT;
    return {"name":"Clash Royale", "value":value, "tier":5};
}

function get_faceit_rank()
{
    let value = document.getElementById("faceit_rank").value * FACEIT_MULT;
    return {"name":"CSGO Faceit", "value":value, "tier":5};
}

function get_smash_rank()
{
    let value = document.getElementById("smash_rank").value * SMASH_MULT;
    return {"name":"Smash Ultimate", "value":value, "tier":3};
}

function get_splitgate_rank()
{
    let value = document.getElementById("splitgate_rank").value * SPLITGATE_MULT;
    return {"name":"Splitgate", "value":value, "tier":4};
}




function tier_sort_list(list)
{
    const place_tiers = {
        0:1,
        1:2,
        2:3,
        3:4,
        4:4,
        5:5,
        6:5,
        7:5,
        8:6,
        9:6
    };

    new_list = [];

    for (let i = 0; i < 10; i++)
    {
        let next = 0;
        while(list[next].tier > place_tiers[i])
        {
            next++;
        }

        new_list.push(list[next]);
        list.splice(next, 1);
    }

    return new_list;
}



function sort_list(list)
{
    list.sort(function(a, b){return b.value - a.value});
    return list;
}






function get_all_ranks()
{
    let list = [];
    list.push(get_lol_soloduo_rank());
    list.push(get_lol_flex_rank());
    list.push(get_ow_primary_rank());
    list.push(get_ow_secondary_rank());
    list.push(get_valorant_rank());
    list.push(get_csgo_rank());
    list.push(get_dota_rank());
    list.push(get_rl_primary_rank());
    list.push(get_rl_secondary_rank());
    list.push(get_sc2_primary_rank());
    list.push(get_sc2_secondary_rank());
    list.push(get_r6_rank());
    list.push(get_lor_rank());
    list.push(get_apex_rank());
    list.push(get_chess_rank());
    list.push(get_hive_rank());
    list.push(get_hearthstone_rank());
    list.push(get_smite_rank());
    list.push(get_clash_royale_rank());
    list.push(get_faceit_rank());
    list.push(get_smash_rank());
    list.push(get_splitgate_rank());



    list = sort_list(list);
    list = tier_sort_list(list);

    return list;
}



function get_result_list(list)
{
    let new_list = [];

    for (let i = 0; i < 10; i++)
    {
        new_list.push(
            {
                "name":list[i].name, 
                "tier":list[i].tier,
                "old":Math.round(list[i].value), 
                "multiplier": (1.0 - (0.1 * i)).toFixed(1),
                "final_value": Math.round( ( 1.0 - (0.10 * i) ) * list[i].value )
            }
        );
    }

    return new_list;
}






function view_rank()
{
    let tier_changer = {
        1:"S",
        2:"A",
        3:"B",
        4:"C",
        5:"D",
        6:"F"
    };
    let list = get_all_ranks();
    list = get_result_list(list);
    let number_div = document.getElementById("rank_number");
    let icon_div = document.getElementById("rank_icon");
    let results_table = document.getElementById("results");
    let grand_total = 0;


    let string_builder = "<tr><th>Name</th><th>Tier</th><th>Points</th><th>Multiplier</th><th>Final Points</th></tr>";

    for (let i = 0; i < list.length; i++)
    {
        grand_total += list[i].final_value;

        string_builder += "<tr>";
        string_builder += "<td>" + list[i].name + "</td>";
        string_builder += "<td>" + tier_changer[list[i].tier] + "</td>";
        string_builder += "<td>" + list[i].old + "</td>";
        string_builder += "<td>" + list[i].multiplier + "</td>";
        string_builder += "<td>" + list[i].final_value + "</td>";
        string_builder += "</tr>";
    }

    number_div.innerHTML = "<h1 id=\"final_number\">" + grand_total + "</h1>";
    results_table.innerHTML = string_builder;



    let final_number = document.getElementById("final_number");
    let found_rank = false;

    let index = 0;
    while (!found_rank)
    {
        if (RANK_DIST[index].value <= grand_total)
        {
            found_rank = true;
        }
        else
        {
            index++;
        }
    }
    let rank = RANK_DIST[index];


    final_number.style.color = rank.color;
    number_div.innerHTML += "<h3 id=\"text_rank\">" + rank.name + "</h3>";
    let text_rank = document.getElementById("text_rank");
    text_rank.style.color = rank.color;
    icon_div.innerHTML = "<img src=\"rank_icons\\" + rank.icon + "\" alt=\"icon\" id=\"icon_img\">";



}

