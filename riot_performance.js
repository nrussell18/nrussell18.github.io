
//const fetch = require('node-fetch');

const nat_puuid = "KUqrHjVFfvMZxUO7Ad4F2WE4q7HZ0MqwcxFZ-7Wqt_H0rwVNWDM35zHvM22JRgo9unoSlAoqi4sZjA";
const api_key = "RGAPI-9f93e12d-7248-4ec1-be8f-9d09e18072b4";


async function view_stats()
{
    let gameName = "Natereater";
    let tagLine = "420";

    let link = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine + "?api_key=" + api_key;

    let response = await fetch(link);
    console.log(response);
}


function view_stats2()
{
    let gameName = "Natereater";
    let tagLine = "420";

    let request = new XMLHttpRequest();
    request.open("GET", "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine);
    request.send(null);

    console.log(request.response);
}



function summoner()
{

    var req = new XMLHttpRequest();
    req.open("GET", "https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/Natereater?api_key=" + api_key);
    
    req.addEventListener("load", function()
    {
        var res = JSON.parse(req.responseText);
        console.log(res);
    });
    req.send(null);
    
}



function runMe()
{
    let gameName = "Natereater";
    let tagLine = "420";

    let req = new XMLHttpRequest();
    req.open("GET", "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagLine + "?api_key=" + api_key);
    
    req.addEventListener("load", function()
    {
        var res = JSON.parse(req.responseText);
        console.log(res);
    });
    req.send(null);
    
}



function val_match_from_puuid()
{
    let req = new XMLHttpRequest();
    req.open("GET", "https://americas.api.riotgames.com/val/match/v1/matchlists/by-puuid/" + puuid + "?api_key=" + api_key);
    
    req.addEventListener("load", function()
    {
        var res = JSON.parse(req.responseText);
        console.log(res);
    });
    req.send(null);
    
}




function lol_match_from_puuid()
{
    let req = new XMLHttpRequest();
    req.open("GET", "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?api_key=" + api_key);
    
    req.addEventListener("load", function()
    {
        var res = JSON.parse(req.responseText);
        console.log(res);
    });
    req.send(null);
    
}



function lol_match_by_id()
{
    let id = "NA1_4109900275";

    let req = new XMLHttpRequest();
    req.open("GET", "https://americas.api.riotgames.com/lol/match/v5/matches/" + id + "?api_key=" + api_key);
    
    req.addEventListener("load", function()
    {
        var res = JSON.parse(req.responseText);
        console.log(res);
    });
    req.send(null);

}






// TEST REAL STUFF

async function testeroo()
{
    let summoner = "5E SoCal";
    let games = await get_games_from_summoner(summoner);
    for (let i = 0; i < games.length; i++)
    {
        let player = get_player_stats(summoner, games[i]);
        console.log(player.championName);
        console.log(games[i].info.gameMode);
        console.log(games[i].info.gameType);
        console.log(player.totalDamageDealtToChampions / (games[i].info.gameDuration / 60) );
        console.log(player.visionScore);
        console.log(player.goldEarned / (games[i].info.gameDuration / 60));
        console.log(player.totalMinionsKilled / (games[i].info.gameDuration / 60));
        console.log(get_score(player, games[i]));
    }
}




// REAL STUFF



// FIELDS:
/*

- Champion
- Score
- Icon
- Win/Loss
- KDA
- Date

*/
async function fillTable()
{
    let results_table = document.getElementById("results_table");
    let string_builder = "<tr><th>Champion</th><th>Score</th><th>Icon</th><th>Result</th><th>KDA</th><th>Date</th></tr>";
    let summoner = document.getElementById("username_box").value;
    let games = await get_games_from_summoner(summoner);

    for (let i = 0; i < games.length; i++)
    {
        let player = get_player_stats(summoner, games[i]);
        let score = get_score(player, games[i]);

        string_builder += "<tr>";

        string_builder += "<td>" + player.championName + "</td>";
        string_builder += "<td>" + score + "</td>";
        string_builder += "<td>" + "x" + "</td>";
        string_builder += "<td>" + ((player.win) ? "WIN" : "LOSS") + "</td>";
        string_builder += "<td>" + player.kills + "/" + player.deaths + "/" + player.assists + "</td>";
        string_builder += "<td>" + "x" + "</td>";

        string_builder += "</tr>";
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
const DPM_MULT = 0.1;

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

    return Math.round(score);
}






