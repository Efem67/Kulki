import { GameBoard } from "./GameBoard";
import { ShortPath } from "./ShortPath";
export class Ball {
    color: string;
    parentDiv: HTMLDivElement;
    constructor(properties: constructorConfig) {
        this.color = properties.color;
        this.parentDiv = properties.parentDiv;
        this.createBall();
    }
    createBall = () => {
        let ball = document.createElement("div") as HTMLDivElement;
        ball.className = "ball";
        ball.id = this.color;
        ball.style.backgroundColor = this.color;
        ball.addEventListener("click", () => {
            this.selectBall({ object: ball })
            // console.log("muja")
        });
        this.parentDiv.appendChild(ball);
    }

    selectBall = (ball: ballObject) => {

        if (ball.object.className == "selectedBall") {
            ball.object.className = "ball";

            for (let fieldId in GameBoard.fieldsObj) {
                if (GameBoard.fieldsObj[fieldId].isEmpty) {
                    GameBoard.fieldsObj[fieldId].removeHoverListener()
                    GameBoard.fieldsObj[fieldId].changeColor("white")
                } else {
                    GameBoard.fieldsObj[fieldId].removeBallListener()
                }
                GameBoard.fieldsObj[fieldId].removeClickListener()

            }


        } else if (ball.object.className == "ball") {

            let stop: boolean = true;
            let optionsArr = [
                { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 },
            ]
            let ballParent: any = ball.object.parentNode


            const collection2: HTMLCollection = document.getElementsByClassName("selectedBall");
            for (let item of collection2) { item.className = "ball" }
            ball.object.className = "selectedBall";


            optionsArr.forEach((el) => {
                try {
                    let position = GameBoard.fieldsObj[`${Number(ballParent.id.charAt(0)) + el.y}${Number(ballParent.id.charAt(ballParent.id.length - 1)) + el.x}`]
                    if (position.isEmpty) {
                        stop = false;
                    }
                } catch { }
            })

            if (stop) return;

            for (let fieldId in GameBoard.fieldsObj) {
                if (GameBoard.fieldsObj[fieldId].isEmpty) {
                    GameBoard.fieldsObj[fieldId].addHoverListener()
                } else {
                    GameBoard.fieldsObj[fieldId].addBallListener()
                }
                GameBoard.fieldsObj[fieldId].removeClickListener()

            }

        }
    }
}

interface constructorConfig {
    color: string;
    parentDiv: HTMLDivElement;
}


interface ballObject {
    object: HTMLDivElement;
}