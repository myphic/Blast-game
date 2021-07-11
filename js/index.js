import {gameSettings} from './GameSettings.js'
import {Blast, tileMatrix} from './Blast.js'

window.addEventListener('load', function () {
    let BLAST = new Blast(460, 450, 0, 0);
    BLAST.start(460, 450);
    
    let swapCount = document.getElementById('swapCount');
    swapCount.textContent = gameSettings.amountResetBooster;
    let swapField = document.getElementById('swapField');

    swapField.addEventListener('click', function () {
        gameSettings.amountResetBooster--;
        swapCount.textContent = gameSettings.amountResetBooster;
        let id = 0;

        for (let j = 0; j < gameSettings.fieldHeight; j++) {
            tileMatrix[j] = [];
            for (let i = 0; i < gameSettings.fieldWidth ; i++) {
                const colors = ["red", "green", "blue", "yellow", "purple"];
                let color = colors[Math.floor(Math.random() * colors.length)];
                tileMatrix[j][i] = (BLAST.create_node(id,30 + (20 + 20) * i, 20 + (20 + 20) * j, 40, 40, color, j, i, false));
                id++;
            }
        }

        if(gameSettings.amountResetBooster==0) {
            swapCount.textContent = "";
            swapField.style.opacity = 0.3;
            swapField.style.pointerEvents = 'none';
        }
    })

    BLAST.clickListener();
    
    let id = 0;
    for (let j = 0; j < gameSettings.fieldWidth; j++) {
        tileMatrix[j] = [];
        for (let i = 0; i < gameSettings.fieldHeight; i++) {
            let colors = ["red", "green", "blue", "yellow", "purple"];
            let color = colors[Math.floor(Math.random() * colors.length)];
            tileMatrix[j][i] = (BLAST.create_node(id, 30 + (20 + 20) * i, 20 + (20 + 20) * j, 40, 40, color, j, i, false));   
            id++;
        }
    }
});