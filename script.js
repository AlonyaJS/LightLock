$(document).ready(function () {

    // Selectors
    const startGameButtonSelector = $("#start-btn");
    const blockGameSelector = $("#block-game");
    const confirmButtonSelector = $("#confirm-btn");

    // Fixed
    let blocks;
    let randomBlocksObj;
    let selectedRandomBlocks = [];
    let selectedBlocks = [];
    let currentScore = 0;

    // Game Rules
    let progressTimer = 4; // How Long the blocks will be lighted up
    let AmountOfBlocks = 6; // How many blocks to be displayed
    const DisplayBlockNumbers = false // Should blocks have numbers in them?
    

    // Start Game button - click Event
    startGameButtonSelector.click(function() { 

        startGameButtonSelector.animate({ opacity: 0 }, 500, () => {
            startGameButtonSelector.css("display", "none");
            $("#game-layout").animate({opacity: 1,}, 1000);
        });

        $("#container").animate({ height: "844px" }, 1500, () => {
            displayBlocks()
        });

    });

    // Blocks - click Event
    $("#block-game").on("click", ".block-style", function () {

        const blockId = this.id; // Get the button's ID

        $(this).toggleClass("btn-style-active");
    
        if ($(this).hasClass("btn-style-active")) {
            if (!selectedBlocks.includes(blockId)) {
                selectedBlocks.push(blockId);
            }
        } else {
            const index = selectedBlocks.indexOf(blockId);
            if (index !== -1) {
                selectedBlocks.splice(index, 1);
            }
        }

        if (selectedBlocks.length >= AmountOfBlocks) {
            confirmButtonSelector.removeClass("btn-non-selectable");
        } else {
            confirmButtonSelector.addClass("btn-non-selectable");
        }

    });

    // Confirm button - click Event
    confirmButtonSelector.click( () => {

        confirmButtonSelector.addClass("btn-non-selectable"); // Makes confirm button Non selectable

        // Removes the Game container
        blockGameSelector.css({
            display: "none",
            opacity: 0,
        });
        
        if (checkGameResult(selectedRandomBlocks, selectedBlocks)) {
            // Win
            $("#block-win").css("display", "flex").animate({ opacity: 1,}, 300,);

        } else {
            // Lose
            $("#lose-text").text(loseText());
            $("#block-lose").css("display", "flex").animate({ opacity: 1,}, 300,);
        }

        // removes Selected blocks
        $(blockGameSelector.children()).removeClass("btn-style-active");

        // makes the arrays empty
        selectedRandomBlocks = [];
        selectedBlocks = [];

    });

    // Next button - click Event (Resume the game)
    $("#next-btn").click( () => { 
        $("#block-win").css({
            display: "none",
            opacity: 0,
        })
        displayBlocks();
    });

    // Try again button - click Event (Lose the Game)
    $("#tryagain-btn").click( () => {
        $("#block-lose").css({
            display: "none",
            opacity: 0,
        })
        currentScore = 0; // Sets current game score to 0
        displayBlocks();
    });

    // 
    function displayBlocks() {

        const displaytimer = .5 // Sets time of how long it will take to start the function in seconds

        setTimeout(() => {

            // Checks if There is already blocks. If so create blocks
            if (!blockGameSelector.children().length) {
                
                for (let i = 1; i <= 36; i++) {
                    blockGameSelector.append(`<div class="block-style btn-style" id="block${i}">${DisplayBlockNumbers ? i : ""}</div>`);  // Adds Blocks
                };

            };

            // makes blocks non-selectable - display flex - animate opacity
            blockGameSelector.toggleClass("btn-non-selectable").css("display", "flex").animate({ opacity: 1 }, 300, () => {
                selectRandomBlocks(); // Next stage: Choose Random blocks
            });

        }, displaytimer * 1000);

    };

    function selectRandomBlocks() {

        blocks = blockGameSelector.children().toArray(); // Convert jQuery object to an array
        randomBlocksObj = $(blocks.sort(() => 0.5 - Math.random()).slice(0, AmountOfBlocks)); // Shuffle & pick AmountOfBlocks
        selectedRandomBlocks = randomBlocksObj.toArray().map(block => block.id); // Extract IDs

        updateScore(); // Updates the score +1

        randomBlocksObj.addClass("btn-style-active"); // Highlight selected blocks

        $("#progress").css("width", "100%").animate({ width: "0%" }, progressTimer * 1000, () => {
            randomBlocksObj.removeClass("btn-style-active"); // Remove highlight after animation
            blockGameSelector.toggleClass("btn-non-selectable"); // Make Blocks Selectable again  
        });

    };

    function updateScore() {
        currentScore++;
        $("#score").text(currentScore);
    }

    function checkGameResult(a1, a2) {
        // Check if lengths are the same
        if (a1.length !== a2.length) {
            return false;
        }

        // Sort both arrays and compare values
        a1 = [...a1].sort();
        a2 = [...a2].sort();

        return a1.every((value, index) => value === a2[index]);
    }

    function loseText() {
        const text = [
            '"Well… that was something."',
            '"Did you even try? 😅"',
            '"Brain.exe has stopped working."',
            '"Memory not found. Please insert brain."',
            '"That was… creative. But wrong."',
            '"I’d be impressed… if this were opposite day."',
            '"You sure you weren’t just guessing?"',
            `"If forgetting was a sport, you'd be a champion!"`,
            '"Wow. Even my goldfish has better memory."',
            '"Are you playing or just clicking randomly?"'
        ];

        return text[Math.floor(Math.random() * text.length)];;
    };

});