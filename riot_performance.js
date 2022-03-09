
//CONSTANTS
const api_key = "RGAPI-88a1df1a-05c5-43e1-ae30-af768245c6f4";


const RANKS = [
    {"name":"GRANDMASTER III", "value":1500, "color":"#E62A34", "icon":"grandmaster_3.fw.png"},
    {"name":"GRANDMASTER II", "value":1200, "color":"#E62A34", "icon":"grandmaster_2.fw.png"},
    {"name":"GRANDMASTER I", "value":900, "color":"#E62A34", "icon":"grandmaster_1.fw.png"},
    {"name":"MASTER III", "value":800, "color":"#B973FF", "icon":"master_3.fw.png"},
    {"name":"MASTER II", "value":750, "color":"#B973FF", "icon":"master_2.fw.png"},
    {"name":"MASTER I", "value":700, "color":"#B973FF", "icon":"master_1.fw.png"},
    {"name":"DIAMOND III", "value":660, "color":"#22CBD6", "icon":"diamond_3.fw.png"},
    {"name":"DIAMOND II", "value":630, "color":"#22CBD6", "icon":"diamond_2.fw.png"},
    {"name":"DIAMOND I", "value":600, "color":"#22CBD6", "icon":"diamond_1.fw.png"},
    {"name":"PLATINUM III", "value":560, "color":"#1fc464", "icon":"plat_3.fw.png"},
    {"name":"PLATINUM II", "value":530, "color":"#1fc464", "icon":"plat_2.fw.png"},
    {"name":"PLATINUM I", "value":500, "color":"#1fc464", "icon":"plat_1.fw.png"},
    {"name":"GOLD III", "value":460, "color":"#FFD24D", "icon":"gold_3.fw.png"},
    {"name":"GOLD II", "value":430, "color":"#FFD24D", "icon":"gold_2.fw.png"},
    {"name":"GOLD I", "value":400, "color":"#FFD24D", "icon":"gold_1.fw.png"},
    {"name":"SILVER III", "value":360, "color":"#DDDDDD", "icon":"silver_3.fw.png"},
    {"name":"SILVER II", "value":330, "color":"#DDDDDD", "icon":"silver_2.fw.png"},
    {"name":"SILVER I", "value":300, "color":"#DDDDDD", "icon":"silver_1.fw.png"},
    {"name":"BRONZE III", "value":260, "color":"#834B00", "icon":"bronze_3.fw.png"},
    {"name":"BRONZE II", "value":230, "color":"#834B00", "icon":"bronze_2.fw.png"},
    {"name":"BRONZE I", "value":200, "color":"#834B00", "icon":"bronze_1.fw.png"},
    {"name":"COPPER III", "value":100, "color":"#D2691E", "icon":"copper_3.fw.png"},
    {"name":"COPPER II", "value":50, "color":"#D2691E", "icon":"copper_2.fw.png"},
    {"name":"COPPER I", "value":0, "color":"#D2691E", "icon":"copper_1.fw.png"}
];




// Main function that calls all of the others and constructs the table
async function fillTable()
{
    let results_table = document.getElementById("results_table");
    let string_builder = "<tr><th>Champion</th><th>Score</th><th>Icon</th><th>Result</th>" +
    "<th>KDA</th><th>DPM</th><th>CS</th><th>Duration</th><th>Date</th></tr>";
    let summoner = document.getElementById("username_box").value;
    let games = await get_games_from_summoner(summoner);
    let ranks = [];


    for (let i = 0; i < ((games.length < 10) ? games.length : 10); i++)
    {
        let player = get_player_stats(summoner, games[i]);
        let score = get_score(player, games[i]);
        
        let found_rank = false;

        let index = 0;
        while (!found_rank)
        {
            if (RANKS[index].value <= score)
            {
                found_rank = true;
                break;
            }
            else
            {
                index++;
            }
        }
        let rank = RANKS[index];
        ranks.push(rank);


        string_builder += "<tr id=\"table_row_" + i + "\">";

        string_builder += "<td>" + player.championName + "</td>";
        string_builder += "<td>" + score + "</td>";

        // Handle icon
        string_builder += "<td><img src=\"rank_icons/" + rank.icon + "\" alt=\"icon\" width=\"100\" height=\"100\"></td>";

        string_builder += "<td>" + ((player.win) ? "WIN" : "LOSS") + "</td>";
        string_builder += "<td>" + player.kills + "/" + player.deaths + "/" + player.assists + "</td>";
        string_builder += "<td>" + Math.round(player.totalDamageDealtToChampions / (games[i].info.gameDuration / 60)) + "</td>";
        string_builder += "<td>" + player.totalMinionsKilled + "</td>";
        string_builder += "<td>" + Math.floor(games[i].info.gameDuration / 60) + ":" +
                            ((games[i].info.gameDuration % 60 < 10) ? "0" : "") + 
                            (games[i].info.gameDuration % 60)  + "</td>";

        // handle date
        let date = new Date(0);
        date.setUTCMilliseconds(games[i].info.gameEndTimestamp);
        string_builder += "<td>" + date.toString().substring(0,21) + "</td>";

        string_builder += "</tr>";
    }

    results_table.innerHTML = string_builder;

    for (let i = 0; i < ((games.length < 10) ? games.length : 10); i++)
    {
        let table_row = document.getElementById("table_row_" + i);
        //table_row.style.backgroundColor = "#1D1D1D";
        //table_row.style.color = ranks[i].color;
        table_row.style.color = "#000000";
        table_row.style.backgroundColor = ranks[i].color;
    }

}





// https://stackoverflow.com/questions/48969495/in-javascript-how-do-i-should-i-use-async-await-with-xmlhttprequest
// function to await on that will aid in getting API calls
function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}



async function get_puuid_from_summoner(summoner_name)
{
    let result = await makeRequest("GET", "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summoner_name + "?api_key=" + api_key);

    return JSON.parse(result).puuid;
}


async function get_games_from_puuid(puuid)
{
    let address = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?api_key=" + api_key;
    let result = await makeRequest("GET", address);

    return JSON.parse(result);
}


async function get_games_from_match_ids(match_ids)
{
    let match_list = [];
    for (let i = 0; i < match_ids.length; i++)
    {
        let address = "https://americas.api.riotgames.com/lol/match/v5/matches/" + match_ids[i] + "?api_key=" + api_key;
        let result = JSON.parse(await makeRequest("GET", address));

        if (result.info.gameMode == "CLASSIC")
        {
            match_list.push(result);
        }
    }
    return match_list;
}


async function get_games_from_summoner(summoner)
{
    let puuid = await get_puuid_from_summoner(summoner);
    let games = await get_games_from_match_ids(await get_games_from_puuid(puuid));

    return games;
}



// Get the stats for an individual player based on their summoner name and the game.
function get_player_stats(summoner, game)
{
    let participants = game.info.participants;
    let participant = null;

    for (let i = 0; i < participants.length; i++)
    {
        if (participants[i].summonerName.toLowerCase() == summoner.toLowerCase())
        {
            participant = participants[i];
        }
    }

    return participant;
}



const BASE_POINTS = 200;

const WIN_POINTS = 50;
// kda consts
const KILL_POINTS = 25;
const ASSIST_POINTS = 15;
const DEATH_POINTS = -25;

// performance consts
const GPM_MULT = 0.2;
const VISION_SCORE_MULT = 1.5;
const CSPM_MULT = 7;
const DPM_MULT = 0.12;

// bonus consts
const DOUBLE_KILL_BONUS = 4;
const TRIPLE_KILL_BONUS = 9;
const QUADRAKILL_BONUS = 16;
const PENTAKILL_BONUS = 25;
const BARON_KILL = 8;
const DRAGON_KILL = 4;
const TURRET_TAKEDOWN = 2;


function get_score(participant, game)
{
    let duration = game.info.gameDuration / 60;
    let score = BASE_POINTS;

    // KDA POINTS
    score += participant.kills * KILL_POINTS;
    score += participant.assists * ASSIST_POINTS;
    score += participant.deaths * DEATH_POINTS;

    // WIN POINTS
    if (participant.win)
    {
        score += WIN_POINTS;
    }

    // VISION SCORE
    score += participant.visionScore * VISION_SCORE_MULT;

    // PER MINUTE STATS
    score += (participant.totalMinionsKilled / duration) * CSPM_MULT;
    score += (participant.goldEarned / duration) * GPM_MULT;
    score += (participant.totalDamageDealtToChampions / duration) * DPM_MULT;

    // BONUS STATS
    score += participant.doubleKills * DOUBLE_KILL_BONUS;
    score += participant.tripleKills * TRIPLE_KILL_BONUS;
    score += participant.quadraKills * QUADRAKILL_BONUS;
    score += participant.pentaKills * PENTAKILL_BONUS;
    score += participant.baronKills * BARON_KILL;
    score += participant.dragonKills * DRAGON_KILL;
    score += participant.turretTakedowns * TURRET_TAKEDOWN;

    if (score < 0)
    {
        score = 0;
    }
    if (isNaN(score))
    {
        score = 0;
    }

    return Math.round(score);
}






