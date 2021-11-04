

// ============================================
// CONSTANTS
// ============================================
const MIN_STAT = 10;
const MAX_STAT = 100;

const NUMBER_OF_STATS = 5;

const ROUNDS_IN_MATCH = 15;


const WAIT_BEFORE_GAME = 5000;
const WAIT_BETWEEN_ROUNDS = 1000;
const WAIT_AFTER_GAME = 5000;




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
    add_win()
    {
        this.wins++;
    }

    // add 1 point
    add_point()
    {
        this.points++;
    }

    // get value that this team will be sorted by in standings
    get_sort_value()
    {
        return (this.wins * ROUNDS_IN_MATCH) + this.points;
    }


    // innerHTML for standings (table row)


    // innerHTML for schedule match (table elements)


    // innerHTML for live (div)
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
}




// ============================================
// SCHEDULE CLASS
// ============================================






// ============================================
// PLAYOFFS CLASS
// ============================================





// ============================================
// TOURNAMENT CLASS
// ============================================




// ============================================
// DEFINE TEAMS
// ============================================







