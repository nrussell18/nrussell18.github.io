

// ============================================
// CONSTANTS
// ============================================
const MIN_STAT = 10;
const MAX_STAT = 100;

const NUMBER_OF_STATS = 5;

const ROUNDS_IN_MATCH = 15;


const WAIT_BEFORE_GAME = 4000;
const WAIT_BETWEEN_ROUNDS = 1000;
const WAIT_AFTER_GAME = 4000;



// ============================================
// SLEEP FUNCTION
// ============================================
function sleep(milliseconds)
{
    const date = Date.now();
    let currentDate = null;
    do 
    {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}



// ============================================
// VTAPE FUNCTION
// ============================================
// Moves tape for round robin scheduling algorithm
function array_leave_one_out_vtape(array)
{
    let last = array[array.length - 1];
    for (let i = array.length - 1; i > 1; i--)
    {
        array[i] = array[i - 1];
    }
    array[1] = last;

    return array;
}



// ============================================
// PSEUDORANDOM NUMBER GENERATOR
// https://newbedev.com/seeding-the-random-number-generator-in-javascript
// ============================================
function pseudoRNG()
{
    // Function for seeded pseudorandom number generator
    function xmur3(str) 
    {
        for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
            h = h << 13 | h >>> 19;
        return function() 
        {
            h = Math.imul(h ^ h >>> 16, 2246822507);
            h = Math.imul(h ^ h >>> 13, 3266489909);
            return (h ^= h >>> 16) >>> 0;
        }
    }

    // Function for seeded pseudorandom number generator
    function sfc32(a, b, c, d) 
    {
        return function() 
        {
            a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
            var t = (a + b) | 0;
            a = b ^ b >>> 9;
            b = c + (c << 3) | 0;
            c = (c << 21 | c >>> 11);
            d = d + 1 | 0;
            t = t + d | 0;
            c = c + t | 0;
            return (t >>> 0) / 4294967296;
        }
    }

    // Create xmur3 state:
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    var seed = xmur3(today);
    // Output four 32-bit hashes to provide the seed for sfc32.
    return sfc32(seed(), seed(), seed(), seed());
}


// RAND IS NOW PSEUDORANDOM NUMBER GENERATOR WITH TODAY AS THE SEED
var rand = pseudoRNG();








// ============================================
// TEAM CLASS
// ============================================
class Team
{
    constructor(name, primary_color, secondary_color, icon)
    {
        this.name = name;
        this.primary_color = primary_color;
        this.secondary_color = secondary_color;
        this.icon = icon;

        this.points = 0;
        this.wins = 0;
        this.losses = 0;
        // new array with n number of 0s
        this.stats = new Array(NUMBER_OF_STATS).fill(0);
        
        // initialize stats
        for (let i = 0; i < this.stats.length; i++)
        {
            this.stats[i] = ((MAX_STAT - MIN_STAT) + 1) * rand() + MIN_STAT;
        }
    }

    // gets a random one of the stats
    get_stat = function()
    {
        return this.stats[rand() * this.stats.length];
    }

    // add 1 win
    add_win = function()
    {
        this.wins++;
    }

    // add 1 loss
    add_loss = function()
    {
        this.losses++;
    }

    // add 1 point
    add_point = function()
    {
        this.points++;
    }

    // get value that this team will be sorted by in standings
    get_sort_value = function()
    {
        return ((1000 * ROUNDS_IN_MATCH * this.wins) - (10 * ROUNDS_IN_MATCH * this.losses)) + this.points;
    }


    // innerHTML for standings (table row)
    set_standings_row = function(team_table)
    {
        return "<tr id=\"" + this.name + "_standings\"><td><img src=\"" + this.icon + 
        "\" alt=\"icon\" width=\"20\" height=\"20\"></td><td>" + this.name + 
        "</td><td>" + this.wins + "</td><td>" + this.losses + "</td><td>" + this.points + "</td></tr>";
    }

    // style the row pertaining to this team in the standings
    style_standings_row = function()
    {
        let row = document.getElementById(this.name + "_standings");
        row.style.backgroundColor = this.primary_color;
        row.style.color = this.secondary_color;
    }


    // innerHTML for live (div)
    set_live_HTML = function(team_div)
    {
        team_div.style.backgroundColor = this.primary_color;
        team_div.style.color = this.secondary_color;
        let string_builder = "";

        string_builder += "<img src=\"" + this.icon + "\" alt=\"icon\" width=\"300\" height=\"300\"><br>";
        string_builder += "<h4>" + this.name + "</h4>";
        string_builder += "<h2 id=\"" + this.name + "_scoreboard\">0</h2>";
        team_div.innerHTML = string_builder;
    }
}





// ============================================
// MATCH CLASS
// ============================================
class Match
{
    constructor(team1, team2)
    {
        this.team1 = team1;
        this.team2 = team2;
        this.score1 = 0;
        this.score2 = 0;
    }


    play_match = function()
    {
        // setup live part of page
        let team1_div = document.getElementById("live_left");
        let team2_div = document.getElementById("live_right");

        this.team1.set_live_HTML(team1_div);
        this.team2.set_live_HTML(team2_div);

        let team1_scoreboard = document.getElementById(this.team1.name + "_scoreboard");
        let team2_scoreboard = document.getElementById(this.team2.name + "_scoreboard");


        // sleep certain amount of time before game
        sleep(WAIT_BEFORE_GAME);



        for (let round = 0; round < ROUNDS_IN_MATCH; round++)
        {
            // get stats from each team
            let stat1 = this.team1.get_stat();
            let stat2 = this.team2.get_stat();

            // figure out round winner
            let value = rand() * (stat1 + stat2);

            if (value < stat1)
            {
                this.score1 += 1;
                this.team1.add_point();

                // update scoreboard
                team1_scoreboard.innerHTML = this.score1;
            }
            else
            {
                this.score2 += 1;
                this.team2.add_point();

                // update scoreboard
                team2_scoreboard.innerHTML = this.score2;
            }

            // wait certain amount of time between rounds
            sleep(WAIT_BETWEEN_ROUNDS);
        }



        if (this.stat1 > this.stat2)
        {
            this.team1.add_win();
            this.team2.add_loss();
        }
        else
        {
            this.team2.add_win();
            this.team1.add_loss();
        }

        // wait a certain amount of time after game has finished
        sleep(WAIT_AFTER_GAME);
    }



    // get row for schedule
    return_schedule_row = function()
    {
        return "<tr><td style=\"background-color: " + 
        this.team1.primary_color + "; color: " + this.team1.secondary_color + ";\">" + 
        this.team1.name + "</td><td>" + this.score1 + "</td><td>" + this.score2 + 
        "</td><td style=\"background-color: " + 
        this.team2.primary_color + "; color: " + this.team2.secondary_color + ";\">" + 
        this.team2.name + "</td></tr>";
    }


}




// ============================================
// SCHEDULE CLASS
// ============================================
class Schedule
{
    constructor(teams)
    {
        this.teams = teams;
        this.matches = [];


        for (let round = 0; round < this.teams.length; round++)
        {
            for (let match = 0; match < this.teams.length / 2; match++)
            {
                // get 2 participants
                let first = this.teams[match];
                let second = this.teams[(this.teams.length - 1) - match];

                this.matches.push(new Match(first, second));
            }

            array_leave_one_out_vtape(this.teams);
        }

        //this.display_schedule();
    }



    display_schedule = function()
    {
        let table = document.getElementById("schedule");

        let string_builder = "";

        for(let i = 0; i < this.matches.length; i++)
        {
            string_builder += this.matches[i].return_schedule_row();
        }

        table.innerHTML = string_builder;
    }



    play_schedule = function()
    {
        for (let match = 0; match < this.matches.length; match++)
        {
            this.matches[match].play_match();
            //this.display_schedule();
        }
    }
}





// ============================================
// PLAYOFFS CLASS
// ============================================





// ============================================
// TOURNAMENT CLASS
// ============================================








// ============================================
// DEFINE TEAMS
// ============================================


var ALL_TEAMS = [];
ALL_TEAMS.push(new Team("BIG GALACTICA", "#0C2340", "#DDCBA4", "icons/big_galactica.png"));
ALL_TEAMS.push(new Team("BUTTERFLY PALACE", "#FF5733", "#111111", "icons/butterfly_palace.png"));
ALL_TEAMS.push(new Team("CROWNE EMPIRIUM", "#FFF000", "#211C1E", "icons/crowne_empirium.png"));
ALL_TEAMS.push(new Team("GRAYWINTER", "#444444", "#999999", "icons/graywinter.png"));
ALL_TEAMS.push(new Team("JACKALOPES", "#390F10", "#22CBD6", "icons/jackalopes.png"));
ALL_TEAMS.push(new Team("KING COBRA", "#3CA243", "#E5D661", "icons/king_cobra.png"));
ALL_TEAMS.push(new Team("NOT BROCCOLI", "#14A958", "#1C1A1B", "icons/not_broccoli.png"));
ALL_TEAMS.push(new Team("POGGERS UNITED", "#141414", "#AA8A00", "icons/poggers_united.png"));
ALL_TEAMS.push(new Team("POLAR MOOSEGANG", "#A9E0EB", "#383F7A", "icons/polar_moosegang.png"));
ALL_TEAMS.push(new Team("POTATO", "#1C0A00", "#C48448", "icons/potato.png"));
ALL_TEAMS.push(new Team("QUASIBROCCOLI UNITED", "#1C1A1B", "#1ED760", "icons/quasibroccoli_united.png"));
ALL_TEAMS.push(new Team("STICKBUG INCORPORATED", "#123731", "#EFB34C", "icons/stickbug_incorporated.png"));
ALL_TEAMS.push(new Team("THE PENGUIN ITSELF", "#230445", "#9871FF", "icons/the_penguin_itsef.png"));
ALL_TEAMS.push(new Team("TRITONS", "#2B58E9", "#F22431", "icons/tritons.png"));
ALL_TEAMS.push(new Team("WUMPUS UPRISING", "#7289D9", "#FFFFFF", "icons/wumpus_uprising.png"));
ALL_TEAMS.push(new Team("YAKS ETERNAL", "#F6412D", "#FFFFFF", "icons/yaks_eternal.png"));

var big_schedule = new Schedule(ALL_TEAMS);
big_schedule.play_schedule();






