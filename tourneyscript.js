
const INT_MAX = 2147000000;
const BYE = "##$!BYE##$!";

const WIN_COLOR = "#FFFF00";
const LOSS_COLOR = "white";

const SELECT_CLASS = "selected";
const UNSELECTED_CLASS = "unselected";



//https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array)
{
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}


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





class Tourney 
{
    constructor(participants)
    {
        this.participants = participants;
        this.wins = new Map();
        this.losses = new Map();
        this.rounds = 2;

        for (let i = 0; i < this.participants.length; i++)
        {
            this.wins.set(this.participants[i], 0);
            this.losses.set(this.participants[i], 0);
        }
    }

    // Update the standings table
    set_standings = function()
    {
        let standings_table = document.getElementById("standings");
        let build_string = "<tr><th>Place</th><th>Name</th><th>Wins</th><th>Losses</th></tr>";
        let sorted_participants = [];
        let temp_participants = [...this.participants];

        while(temp_participants.length > 0)
        {
            let best = 0;
            let max_wins = 0;
            let losses = INT_MAX;
            for (let j = 0; j < temp_participants.length; j++)
            {
                if (this.wins.get(temp_participants[j]) > max_wins || 
                    (this.wins.get(temp_participants[j]) == max_wins && 
                    this.losses.get(temp_participants[j]) < losses))
                {
                    best = j;
                    max_wins = this.wins.get(temp_participants[j]);
                    losses = this.losses.get(temp_participants[j]);
                }
            }

            sorted_participants.push(temp_participants[best]);
            temp_participants.splice(best, 1);
        }

    
        for (let i = 0; i < sorted_participants.length; i++)
        {
            build_string += "<tr>";
            build_string += "<td>" + (i + 1) + "</td>";
            build_string += "<td>" + sorted_participants[i] + "</td>";
            build_string += "<td>" + this.wins.get(sorted_participants[i]) + "</td>";
            build_string += "<td>" + this.losses.get(sorted_participants[i]) + "</td>";
            build_string += "</tr>";
        }
    
        standings_table.innerHTML = build_string;
    }





    // Update the list of matches
    set_matches = function()
    {
        let matches_div = document.getElementById("matches_div");
        let temp_participants = [...this.participants];

        // If odd number of participants, add a bye
        if(temp_participants.length % 2 == 1)
        {
            temp_participants.push(BYE);
        }
        // shuffle order for random generation
        temp_participants = shuffle(temp_participants);
        
        let string_builder = "";

        for (let round = 0; round < this.rounds; round++)
        {
            for(let subround = 0; subround < temp_participants.length - 1; subround++)
            {
                // start new subround in stringbuilder
                string_builder += "<h3>Round #" + (subround + 1 + round * (temp_participants.length - 1)) + "</h3><table>";

                for (let match = 0; match < temp_participants.length / 2; match++)
                {
                    // get 2 participants
                    let first = temp_participants[match];
                    let second = temp_participants[(temp_participants.length - 1) - match];
                    
                    // If neither is the bye, then it is real match
                    if (first != BYE && second != BYE)
                    {
                        string_builder += "<tr><td onclick=\"clicked_participant(this)\">" + first + 
                        "</td><td onclick=\"clicked_participant(this)\"> -- </td><td onclick=\"clicked_participant(this)\">" 
                        + second + "</td></tr>";
                    }
                }
                
                // close subround
                string_builder += "</table>";
                temp_participants = array_leave_one_out_vtape(temp_participants);
            }

            // reverse order of list (makes it so mirrored across sides in second round)
            temp_participants = temp_participants.reverse();
        }

        matches_div.innerHTML = string_builder;
    }





    // Add and sutract wins / losses from a given participant
    add_draw = function(participant)
    {
        this.wins.set(participant, this.wins.get(participant) + 0.5);
        this.losses.set(participant, this.losses.get(participant) + 0.5);
    }

    sub_draw = function(participant)
    {
        this.wins.set(participant, this.wins.get(participant) - 0.5);
        this.losses.set(participant, this.losses.get(participant) - 0.5);
    }

    add_win = function(participant)
    {
        console.log(participant);
        this.wins.set(participant, this.wins.get(participant) + 1);
    }

    sub_win = function(participant)
    {
        this.wins.set(participant, this.wins.get(participant) - 1);
    }

    add_loss = function(participant)
    {
        this.losses.set(participant, this.losses.get(participant) + 1);
    }

    sub_loss = function(participant)
    {
        this.losses.set(participant, this.losses.get(participant) - 1);
    }
}



// main tourney for page
var main_tourney = null;




function generate()
{
    let input_text = document.getElementById("input_box").value.split("\n");
    main_tourney = new Tourney(input_text);

    main_tourney.set_standings();
    main_tourney.set_matches();
}








// Handle a piece of a match being clicked
function clicked_participant(element)
{
    let table_row = element.parentElement;


    // player 1
    if (table_row.children[0] == element)
    {
        if (element.className == SELECT_CLASS)
        {
            element.style.backgroundColor = LOSS_COLOR;
            element.className = UNSELECTED_CLASS;
            main_tourney.sub_win(element.innerHTML);
            main_tourney.sub_loss(table_row.children[2].innerHTML);
        }
        else
        {
            element.style.backgroundColor = WIN_COLOR;
            element.className = SELECT_CLASS;
            main_tourney.add_win(element.innerHTML);
            main_tourney.add_loss(table_row.children[2].innerHTML);
            table_row.children[1].style.backgroundColor = LOSS_COLOR;
            table_row.children[2].style.backgroundColor = LOSS_COLOR;
            if (table_row.children[1].className == SELECT_CLASS)
            {
                main_tourney.sub_draw(element.innerHTML);
                main_tourney.sub_draw(table_row.children[2].innerHTML);
            }
            else if (table_row.children[2].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[2].innerHTML);
                main_tourney.sub_loss(element.innerHTML);
            }
            table_row.children[1].className = UNSELECTED_CLASS;
            table_row.children[2].className = UNSELECTED_CLASS;
        }
    }

    // player 2
    else if (table_row.children[2] == element)
    {
        if (element.className == SELECT_CLASS)
        {
            element.style.backgroundColor = LOSS_COLOR;
            element.className = UNSELECTED_CLASS;
            main_tourney.sub_win(element.innerHTML);
            main_tourney.sub_loss(table_row.children[0].innerHTML);
        }
        else
        {
            element.style.backgroundColor = WIN_COLOR;
            element.className = SELECT_CLASS;
            main_tourney.add_win(element.innerHTML);
            main_tourney.add_loss(table_row.children[0].innerHTML);
            table_row.children[0].style.backgroundColor = LOSS_COLOR;
            table_row.children[1].style.backgroundColor = LOSS_COLOR;
            if (table_row.children[1].className == SELECT_CLASS)
            {
                main_tourney.sub_draw(element.innerHTML);
                main_tourney.sub_draw(table_row.children[0].innerHTML);
            }
            else if (table_row.children[0].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[0].innerHTML);
                main_tourney.sub_loss(element.innerHTML);
            }
            table_row.children[0].className = UNSELECTED_CLASS;
            table_row.children[1].className = UNSELECTED_CLASS;
        }
    }

    // draw button
    else
    {
        if (element.className == SELECT_CLASS)
        {
            element.style.backgroundColor = LOSS_COLOR;
            element.className = UNSELECTED_CLASS;
            main_tourney.sub_draw(table_row.children[0].innerHTML);
            main_tourney.sub_draw(table_row.children[2].innerHTML);
        }
        else
        {
            element.style.backgroundColor = WIN_COLOR;
            element.className = SELECT_CLASS;
            main_tourney.add_draw(table_row.children[0].innerHTML);
            main_tourney.add_draw(table_row.children[2].innerHTML);
            table_row.children[0].style.backgroundColor = LOSS_COLOR;
            table_row.children[2].style.backgroundColor = LOSS_COLOR;
            if (table_row.children[0].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[0].innerHTML);
                main_tourney.sub_loss(table_row.children[2].innerHTML);
            }
            else if (table_row.children[2].className == SELECT_CLASS)
            {
                main_tourney.sub_win(table_row.children[2].innerHTML);
                main_tourney.sub_loss(table_row.children[0].innerHTML);
            }
            table_row.children[0].className = UNSELECTED_CLASS;
            table_row.children[2].className = UNSELECTED_CLASS;
        }
    }


    main_tourney.set_standings();
}