
//const fetch = require('node-fetch');

const nat_puuid = "KUqrHjVFfvMZxUO7Ad4F2WE4q7HZ0MqwcxFZ-7Wqt_H0rwVNWDM35zHvM22JRgo9unoSlAoqi4sZjA";
const api_key = "RGAPI-679e049a-02a0-4bd9-a0ac-04a6e6b7966c";


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






// REAL STUFF




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
    console.log(address);
    let result = await makeRequest("GET", address);

    return JSON.parse(result);
}


async function get_games_from_match_ids(match_ids)
{
    let match_list = [];
    for (let i = 0; i < match_ids.length; i++)
    {
        let address = "https://americas.api.riotgames.com/lol/match/v5/matches/" + match_ids[i] + "?api_key=" + api_key;
        console.log(address);
        let result = await makeRequest("GET", address);

        match_list.push(JSON.parse(result));
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
        if (participants[i].summonerName == summoner)
        {
            participant = participants[i];
        }
    }

    return participant;
}



const BASE_POINTS = 200;

const WIN_POINTS = 50;
// kda consts
const KILL_POINTS = 20;
const ASSIST_POINTS = 12;
const DEATH_POINTS = -20;

// performance consts
const GPM_MULT = 0.2;
const VISION_SCORE_MULT = 0.9;
const CS_MULT = 0.2;
const DAMAGE_SCORE_MULT = 0.001;

// bonus consts
const DOUBLE_KILL_BONUS = 5;
const TRIPLE_KILL_BONUS = 12;
const QUADRAKILL_BONUS = 21;
const PENTAKILL_BONUS = 32;
const BARON_KILL = 8;
const DRAGON_KILL = 4;


function get_score(participant, game)
{
    let duration = game.info.gameDuration;
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
}


