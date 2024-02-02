// Set selectors
let userInput = document.querySelector(".control-buttons input");
let userName = document.querySelector(".info-container .name span");
let score = document.querySelector(".tries span")
let blocks = Array.from(document.querySelectorAll(".game-block"));
let blocksContainer = document.querySelector(".memory-game-blocks")
let tryAgainButton = document.querySelector(".try-again-button");
let levels = document.querySelector("select")
let timer = document.querySelector(".timer span")
let duration = 500;
let time

// Set game levels
let lvls = {
    "Easy" :45,
    "Medium":30,
    "Hard":15
}

// Set timer
timer.innerHTML = lvls[levels.value]
levels.onchange =function () {
    timer.innerHTML = lvls[levels.value]
}

// Focus on input when window loaded
window.onload = () => userInput.focus();

// Start Game with start button OR with keyboard button "Enter"
document.querySelector(".control-buttons span").onclick = startGame;
document.onkeyup = function (e) {
    if (e.key ===  "Enter") {
        startGame()
    }
}
function startGame () {
    if (userInput.value == null || userInput.value == "") {
        userName.innerHTML = "Unknown";
    }else {
        userName.innerHTML = userInput.value;
    }
    document.querySelector(".control-buttons").remove()
    time = setInterval(() => {
        timer.innerHTML--
        if (timer.innerHTML == 0) {
            clearInterval(time)
            timeOut()
        }
    }, 1000);
}

// Get array from shuffled orders
let orderRange = Array.from(new Set(shuffle([...Array(blocks.length).keys()])))

function shuffle(array) {
    let current = array.length;
    while (current > 0) {
        let random = Math.floor(Math.random() * blocks.length);
        current--;
        [array[random],array[current]] = [array[current],array[random]]
    }
    return array
}

//Loop on all blocks
blocks.forEach((block, index)=>{
    // Set shuffled orders to game block 
    block.style.order = orderRange[index];
    
    // Function fliped blocks
    block.addEventListener("click", function () {
        flipBlocks(this)
        tryAgain()
        playAgain();
    })
})

function flipBlocks(block) {
    // Add class show to selected block to flip it
    block.classList.add("show")
    
    // Collect all flipped blocks
    let allFlipedBlocks = blocks.filter(block => block.classList.contains("show"));
    
    // Check if there are only 2 blocks is flipped
    if (allFlipedBlocks.length === 2) {
        stopClicking();
        checkMatched(allFlipedBlocks[0], allFlipedBlocks[1])
    }
}

// Stop Clicking function
function stopClicking() {
    blocksContainer.classList.add("stop-click")
    setTimeout(() => {
        blocksContainer.classList.remove("stop-click")
    }, duration);
}

// Check matched blocks function
function checkMatched(firstBlock, secondBlock) {
    // check if two blocks are matched
    if (firstBlock.dataset.technology === secondBlock.dataset.technology) {
        firstBlock.classList.remove("show")
        secondBlock.classList.remove("show")
        firstBlock.classList.add("correct")
        secondBlock.classList.add("correct")
        timer.innerHTML = parseInt(timer.innerHTML) + 3;
        // check if two blocks are not matched
    }else{
        score.innerHTML++;
        
        setTimeout(() => {
            firstBlock.classList.remove("show")
            secondBlock.classList.remove("show")
        }, duration);
    }
}

// Try again function 
function timeOut() {
    if (timer.innerHTML == 0) {
        let div = document.createElement("div");
        let span = document.createElement("span")
        let txt = document.createTextNode("Try Again")
        let quitButton = document.createElement("span")
        let quit = document.createTextNode("Quit")
        div.className = "try-again"
        span.className = "try-again-button"
        quitButton.className = "quit"
        quitButton.appendChild(quit)
        span.appendChild(txt);
        div.appendChild(span)
        div.appendChild(quitButton)
        document.body.prepend(div)
        span.addEventListener("click", function(){
            this.parentElement.remove()
            resetGame()
            time = setInterval(() => {
                timer.innerHTML--
                if (timer.innerHTML == 0) {
                    clearInterval(time)
                    timeOut()
                }
            }, 1000);
        })
    }
}

// Try again function
function tryAgain() {
    if (score.innerHTML == 10) {
        let div = document.createElement("div");
        let span = document.createElement("span")
        let txt = document.createTextNode("Try Again")
        let quitButton = document.createElement("span")
        let quit = document.createTextNode("Quit")
        div.className = "try-again"
        span.className = "try-again-button"
        quitButton.className = "quit"
        span.appendChild(txt);
        quitButton.appendChild(quit)
        div.appendChild(span)
        div.appendChild(quitButton)
        document.body.prepend(div)
        clearInterval(time)
        span.addEventListener("click", function(){
            this.parentElement.remove()
            resetGame()
        })
        quitButton.onclick = ()=> location.reload();
    }
}
function playAgain() {
    let test = blocks.filter(block => block.classList.contains("correct"))
    if (test.length === blocks.length) {
        let div = document.createElement("div");
        let span = document.createElement("span")
        let txt = document.createTextNode("Play Again")
        let congratz = document.createElement("span")
        let message = document.createTextNode("Congratulations")
        let quitButton = document.createElement("span")
        let quit = document.createTextNode("Quit")
        quitButton.className = "quit"
        div.className = "try-again"
        span.className = "try-again-button"
        congratz.className = "message"
        congratz.appendChild(message)
        div.appendChild(congratz)
        span.appendChild(txt)
        div.appendChild(span)
        quitButton.appendChild(quit)
        div.appendChild(quitButton)
        document.body.prepend(div)
        span.addEventListener("click", function(){
            setTimeout(() => {
                this.parentElement.remove()
                resetGame()
            }, 1000);
        })
        quitButton.onclick = ()=> location.reload();
    }
}

// Reset Game Settings
function resetGame() {
    score.innerHTML = 0
    timer.innerHTML = lvls[levels.value]
    blocks.forEach((block, index)=>{
        if (block.classList.contains("show") || block.classList.contains("correct")) {
            block.style.transition = "none"
            block.classList.remove("show")
            block.classList.remove("correct")
            setTimeout(() => {
                block.style.transition = "transform 0.8s"
            }, duration);
        }
        let orders = Array.from(new Set(shuffle([...Array(blocks.length).keys()])))
        block.style.order = orders[index];
    })
}