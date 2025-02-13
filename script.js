const imageUrl = 'us.jpg';
const puzzleContainer = document.getElementById("puzzle-container");
const message = document.getElementById("message");
const buttons = document.getElementById("buttons");
const noButton = document.getElementById("no");

let pieces = [];
let positions = [];

// Create puzzle pieces
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
        let piece = document.createElement("div");
        piece.classList.add("puzzle-piece");
        piece.style.backgroundImage = `url(${imageUrl})`;
        piece.style.backgroundPosition = `-${col * 100}px -${row * 125}px`;
        piece.dataset.correctX = col * 100;
        piece.dataset.correctY = row * 125;
        pieces.push(piece);
    }
}

// Assign initial random positions
let availablePositions = [];
for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
        availablePositions.push({ x: col * 100, y: row * 125 });
    }
}

availablePositions.sort(() => Math.random() - 0.5);

pieces.forEach((piece, index) => {
    piece.style.left = `${availablePositions[index].x}px`;
    piece.style.top = `${availablePositions[index].y}px`;
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
            // Swap the two adjacent pieces
            swapPieces(draggedPiece, e.target);
            checkCompletion();
        }
    });
});

// Swap pieces function
function swapPieces(piece1, piece2) {
    let tempX = piece1.style.left;
    let tempY = piece1.style.top;

    piece1.style.left = piece2.style.left;
    piece1.style.top = piece2.style.top;

    piece2.style.left = tempX
    piece2.style.top = tempY;
}

// Mobile touch events for swapping
let previousPosition = { left: null, top: null };

pieces.forEach(piece => {
    piece.addEventListener('touchstart', (e) => {
        draggedPiece = piece;  
        let tempX = piece.style.left;
        let tempY = piece.style.top;
    
        piece.style.left = piece.style.left;
        piece.style.top = piece.style.top;
    
        piece.style.left = tempX
        piece.style.top = tempY;
        piece.style.transition = 'none';

    

        // Touchend event for swapping
        piece.addEventListener('touchend', () => {
            if (draggedPiece) {
                piece.style.transition = ''; // Enable transition after dragging
                let adjacentPiece = findAdjacentPiece(draggedPiece);

                if (adjacentPiece) {
                    // Swap the dragged piece with the adjacent piece
                    swapPieces(draggedPiece, adjacentPiece);
                    checkCompletion();
                }

                draggedPiece = null; 
            }
        });
    });
});

// Function to find adjacent piece for mobile
function findAdjacentPiece(draggedPiece) {
    let draggedX = parseInt(draggedPiece.style.left);
    let draggedY = parseInt(draggedPiece.style.top);

    for (let piece of pieces) {
        if (piece !== draggedPiece) {
            let pieceX = parseInt(piece.style.left);
            let pieceY = parseInt(piece.style.top);

            // If the pieces are adjacent horizontally or vertically
            if ((Math.abs(draggedX - pieceX) === 100 && draggedY === pieceY) || 
                (Math.abs(draggedY - pieceY) === 125 && draggedX === pieceX)) {
                return piece;
            }
        }
    }
    return null; 
}

// Completion check (only one function now)
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

// "No" button random movement
noButton.addEventListener("mouseover", () => {
    const maxX = window.innerWidth - noButton.clientWidth;
    const maxY = window.innerHeight - noButton.clientHeight;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;

    noButton.style.position = "absolute";
    noButton.style.left = `${newX}px`;
    noButton.style.top = `${newY}px`;
});

// "Yes" button event
const button = document.querySelector('#yes');
const element = document.querySelector("#response");

button.addEventListener("click", function() {
    element.style.display = "block";
});
