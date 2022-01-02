"use strict"
const $ =  (selector) => document.querySelector(selector);
let blackJackGame = {
    "you":  {"scoreSpan": "#your-blackjack-result", "div": "#your-box", "score": 0},
    "dealer":  {"scoreSpan": "#dealer-blackjack-result-2", "div": "#dealer-box", "score": 0},
    "cards": ['2','3','4','5','6','7','8','9','10','k','J','Q','A'],
    "cardsMap":{'2': 2, '3':3,'4':4, '5':5, '6': 6,
                '7':7, '8':8, '9':9, '10':10, 'k':10, 
                'J':10, 'Q':10, 'A': [1, 11]},
   "wins": 0,
   "losses": 0,
   "draws": 0,   
   "isStand": false,
   "turnsOver": false, 


};
 const YOU = blackJackGame["you"];
 const DEALER = blackJackGame["dealer"];
 const hitSound = new Audio("blackjack_assets/sounds/swish.m4a");
 const winSound = new Audio("blackjack_assets/sounds/cash.mp3");
 const lostSound = new Audio("blackjack_assets/sounds/aww.mp3");
// //  preload images
//  var Image = new Image();
//  Image.src = "blackjac_asset/images";
const randomCard= ()=>{
    let cardRandom= Math.floor(Math.random()*13);
    return blackJackGame["cards"][cardRandom]
}



const blackJackHit= ()=>{
  if(blackJackGame["isStand"]=== false){
   let card = randomCard()
   showCard(card, YOU);
   scoresUpdate(card, YOU)
   
   showScores(YOU);
   console.log(YOU["score"]);
  }
}

const showCard = (card, activePlayer)=>{
    if (activePlayer["score"] <= 21){
    let cardImage = document.createElement("img")
    cardImage.src = `blackjack_assets/images/${card}.png`;
   $(activePlayer["div"]).appendChild(cardImage);
   hitSound.play();
    }
}

function blackjackDeal(){
    if(blackJackGame["turnsOver"]=== true){
   blackJackGame["isStand"] = false;
        let youCurrentImages = $("#your-box").querySelectorAll("img")
        let dealerCurrentImages = $("#dealer-box").querySelectorAll("img")
        //  console.log(currentImages);
        //  currentImages[0].remove();
        for(let i =0; i<youCurrentImages.length; i++){
            youCurrentImages[i].remove();
        };
        for(let i =0; i<dealerCurrentImages.length; i++){
            dealerCurrentImages[i].remove();
        }
        YOU["score"]= 0;
        DEALER["score"]= 0;
        $("#your-blackjack-result").textContent = 0;
        $("#your-blackjack-result").style.color = "white";
        $("#dealer-blackjack-result-2").textContent = 0;
        $("#dealer-blackjack-result-2").style.color = "white";
        $("#blackjack-result").textContent = "let's play";
        $("#blackjack-result").style.color = "Black";
        blackJackGame["turnsOver"] = true;
    }
}
//scores functions
const scoresUpdate=(card, activePlayer)=>{
    if(card === 'A'){
    //if adding 11 keeps me below 21 add 11, otherwise add 
    
    if( activePlayer["score"]+blackJackGame["cardsMap"][card][1]<= 21){
        activePlayer["score"]+= blackJackGame["cardsMap"][card][1];
    }else{
        activePlayer["score"]+= blackJackGame["cardsMap"][card][0];
    }
}else{
    activePlayer["score"]+= blackJackGame["cardsMap"][card];
}
   
}

const showScores=(activePlayer)=>{
    if(activePlayer["score"] > 21){
        $(activePlayer["scoreSpan"]).textContent = "BUST!"
        $(activePlayer["scoreSpan"]).style.color = "red"
    }else{
        $(activePlayer["scoreSpan"]).textContent = activePlayer["score"]
    }

     
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

// adding dealer logic
async function dealerLogic(){
    blackJackGame["isStand"] = true;

    while(DEALER["score"]< 16 && blackJackGame["isStand"] === true){

    let card = randomCard()
    showCard(card, DEALER)
    scoresUpdate(card, DEALER)
    showScores(DEALER)
    await sleep(1000);
    }
   
        blackJackGame["turnsOver"] = true;
        let winner = computeWinner();
        displayGameResult(winner);
         
}


//update win draws and losses
function computeWinner(){
let winner;

if(YOU["score"]<= 21){
// conditon:
if(YOU["scoree"] > DEALER["score"] || (DEALER["score"] > 21)){
  blackJackGame["wins"]++;
  winner = YOU;

}else if(YOU["score"]< DEALER["score"]){
    blackJackGame["losses"]++;
   winner = DEALER;

}else if(YOU["score"]=== DEALER["score"]){
    blackJackGame["draws"]++;
}
// conditions when user bust but dealer doesn't

}else if(YOU["score"]> 21 && DEALER["score"] <= 21){
    blackJackGame["losses"]++;
winner = DEALER;
// condition when the dealer  burst
}else if (YOU["score"] > 21 && DEALER["score"] > 21){
    blackJackGame["draws"]++;
}
console.log(blackJackGame);
     return winner;
}


function displayGameResult(winner){
    let message= "";
    let messageColor= "";

    if(blackJackGame["turnsOver"]=== true){
            
        if(winner === YOU){
           
            message = "You Won!";
            messageColor = "Green";
            winSound.play();
             $("#wins").textContent = blackJackGame["wins"];
            
            // let winner = computeWinner();
            
        }
        
        else if(winner === DEALER){
            $("#losses").textContent = blackJackGame["losses"];
            message = "You LOST!";
            messageColor = "red"
            lostSound.play();
        }else {
            $("#draws").textContent = blackJackGame["draws"]
            message = "You drew!";
            messageColor = "Black"
        }
        $("#blackjack-result").textContent = message
        $("#blackjack-result").style.color = messageColor
}
console.log(winner);

}





    





$("#button-hit").addEventListener("click",blackJackHit);
$("#button-stand").addEventListener("click",dealerLogic);
$("#button-deal").addEventListener("click",blackjackDeal);
