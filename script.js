const imageUrl = 'download.jpeg';
const puzzleContainer = document.getElementById("puzzle-container");
const message = document.getElementById("message");
const buttons = document.getElementById("buttons");
const noButton = document.getElementById("no");

let pieces = [];
let positions = [];

for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
        let piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `-${col * 100}px -${row * 125}px`;
        piece.dataset.correctX = col * 100;
        piece.dataset.correctY = row * 125;
        pieces.push(piece);
        positions.push({ x: col * 100, y: row * 125 });
    }
}

positions.sort(() => Math.random() - 0.5);
pieces.forEach((piece, index) => {
    piece.style.left = `${positions[index].x}px`;
    piece.style.top = `${positions[index].y}px`;
    puzzleContainer.appendChild(piece);
});

let draggedPiece = null;
pieces.forEach(piece => {
    piece.draggable = true;
    piece.addEventListener("dragstart", () => draggedPiece = piece);
    piece.addEventListener("dragover", e => e.preventDefault());
    piece.addEventListener("drop", e => {
        e.preventDefault();
        if (draggedPiece && draggedPiece !== e.target) {
            let tempX = draggedPiece.style.left;
            let tempY = draggedPiece.style.top;
            draggedPiece.style.left = e.target.style.left;
            draggedPiece.style.top = e.target.style.top;
            e.target.style.left = tempX;
            e.target.style.top = tempY;
            checkCompletion();
        }
    });
});

function checkCompletion() {
    let isCorrect = pieces.every(piece => {
        let currentX = parseInt(piece.style.left) || 0;
        let currentY = parseInt(piece.style.top) || 0;
        let correctX = parseInt(piece.dataset.correctX);
        let correctY = parseInt(piece.dataset.correctY);
        
        return currentX === correctX && currentY === correctY;
    });

    if (isCorrect) {
        message.style.display = "block";
        buttons.style.display = "block";
    }
}

noButton.addEventListener("mouseover", () => {
    const maxX = window.innerWidth - noButton.clientWidth;
    const maxY = window.innerHeight - noButton.clientHeight;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    noButton.style.position = "absolute";
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
});

const button = document.querySelector('#yes')
const element = document.querySelector("#response")

button.addEventListener("click", function(){
    element.style.display = "block";
})

