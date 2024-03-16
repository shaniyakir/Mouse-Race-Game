import { Game } from './Game';

let game: Game | null = null;
let playMessageVisible = false;
let startButtonVisible = true;

document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById("start-button") as HTMLButtonElement;
    const playMessage = document.getElementById("play-message") as HTMLDivElement;

    if (!startButton || !playMessage) {
        console.error("Start button or play message not found.");
        return; // Exit early if either element is not found
    }

    startButton.addEventListener("click", function() {
        startButton.style.display = "none";
        startButtonVisible = false;
        game = new Game();
        hidePlayMessage(); // Ensure play message is hidden when starting the game
    });

    document.addEventListener("click", function(event) {
        if (startButtonVisible && event.target !== startButton && !startButton.contains(event.target as Node)) {
            showPlayMessage();
        }
    });

    function showPlayMessage() {
        playMessageVisible = true;
        playMessage.style.display = "contents";
    }

    function hidePlayMessage() {
        playMessageVisible = false;
        playMessage.style.display = "none";
    }
});

export { game };
