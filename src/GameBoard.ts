import { Field } from "./Field";
import { SmashBalls } from "./SmashBalls";
export class GameBoard {

    static fieldsObj: fieldsObject = {};
    colorsArr: Array<string> = ["blue", "red", "orange", "green", "yellow", "pink", "gray"];
    threeColors: Array<string> = [];
    constructor() {
        this.create();
    }
    async addBallsToPreview() {
        let previewDiv: HTMLElement = document.getElementById("ballsPreviewDiv")!
        let count: number = 0;
        let toWhichNum = 0;

        while (previewDiv.firstChild) previewDiv.removeChild(previewDiv.firstChild);

        for (let fieldId in GameBoard.fieldsObj) {
            if (GameBoard.fieldsObj[fieldId].isEmpty) count += 1;
        }

        if (count == 0) {
            await new Promise(r => setTimeout(r, 200));
            let points: string = document.getElementById("pointsText")!.innerHTML
            alert(`Koniec gry! Twój wynik to ${points} pkt! Gratulacje :)`)

            document.getElementById("gameBoardMainDiv")!.style.pointerEvents = 'none'

        }
        else {
            if (count >= 3) toWhichNum = 3;
            else if (count > 0 && count < 3) toWhichNum = count;

            for (let i: number = 0; i < toWhichNum; i++) {
                this.threeColors.push(this.colorsArr[Math.floor(Math.random() * this.colorsArr.length)])
            }
        }
        this.threeColors.forEach((color: string) => {
            let ball: HTMLDivElement = document.createElement("div")
            ball.className = "ballInPrev";
            ball.style.backgroundColor = color;
            previewDiv.appendChild(ball);
        })



    }
    drawPlacesForBalls() {
        this.threeColors.forEach(color => {
            let loopAgain: boolean = true
            let xPosition: number = 0;
            let yPosition: number = 0;
            while (loopAgain) {
                xPosition = Math.floor(Math.random() * 9);
                yPosition = Math.floor(Math.random() * 9);
                GameBoard.fieldsObj[`${xPosition}${yPosition}`].isEmpty == true ? loopAgain = false : console.log("again")
            }
            GameBoard.fieldsObj[`${xPosition}${yPosition}`].addBall(color);
        })

        let newSmash = new SmashBalls()
        newSmash.markFieldsToSmash();


        this.threeColors = []
        this.addBallsToPreview();

    }
    create() {
        let gameBoardMainDiv = document.getElementById("gameBoardMainDiv") as HTMLDivElement;
        let boardSize: number = 9;
        for (let i: number = 0; i < boardSize; i++) {
            let row = document.createElement("div") as HTMLDivElement;
            row.id = `row_${i}`;
            row.className = "boardRow";

            for (let j: number = 0; j < boardSize; j++) {
                let NewField = new Field({ row: row, fieldId: `${i}${j}` });
                GameBoard.fieldsObj[`${i}${j}`] = NewField;
            }
            gameBoardMainDiv.appendChild(row);
        }
        this.addBallsToPreview();
        this.drawPlacesForBalls()
    }
}
interface fieldsObject {
    [key: string]: any,
    field?: any;
}

