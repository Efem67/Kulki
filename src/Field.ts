import { GameBoard } from "./GameBoard";
import { ShortPath } from "./ShortPath";
import { Ball } from "./Ball";
import { Index } from "./index";
import { SmashBalls } from "./SmashBalls";

export class Field {
    row: HTMLDivElement;
    fieldId: string;
    isEmpty: boolean = true;
    toSmash: boolean = false;
    fieldObject?: HTMLDivElement;
    shortPath: any = []

    constructor(properties: constructorConfig) {
        this.row = properties.row;
        this.fieldId = properties.fieldId;
        this.createField();
    }

    addBall(color: string, field?: HTMLDivElement) {

        let newBall = new Ball({ color: color, parentDiv: this.fieldObject! });
        this.isEmpty = false;


    }
    deleteBall() {
        while (this.fieldObject?.firstChild) this.fieldObject.removeChild(this.fieldObject.firstChild);
        this.isEmpty = true;
    }
    createField() {
        let field = document.createElement("div") as HTMLDivElement;
        field.id = this.fieldId;
        field.className = "field";
        this.fieldObject = field;
        this.row.appendChild(field);

    }
    addHoverListener() {
        this.fieldObject?.addEventListener("mouseenter", this.hoverListener)
    }
    removeHoverListener() {
        this.fieldObject?.removeEventListener("mouseenter", this.hoverListener);
    }
    addBallListener() {
        this.fieldObject?.addEventListener("mouseenter", this.ballListener)
    }
    removeBallListener() {
        this.fieldObject?.removeEventListener("mouseenter", this.ballListener);
    }
    addClickListener() {
        this.fieldObject?.addEventListener("click", this.clickListener)
    }
    removeClickListener() {
        this.fieldObject!.style.cursor = "auto";
        this.fieldObject?.removeEventListener("click", this.clickListener)
    }
    clickListener = async () => {
        let startId: string = "";
        let ballColor: string = "";
        const collection = document.getElementsByClassName("selectedBall") as HTMLCollectionOf<HTMLElement>;
        for (let item of collection) {
            startId = item.parentElement?.id!
            ballColor = item.id;
        }
        GameBoard.fieldsObj[startId].deleteBall();

        for (let fieldId in GameBoard.fieldsObj) {
            if (GameBoard.fieldsObj[fieldId].isEmpty) {
                GameBoard.fieldsObj[fieldId].removeHoverListener()
                GameBoard.fieldsObj[fieldId].changeColor("white")
            } else {
                GameBoard.fieldsObj[fieldId].removeBallListener()
            }
            GameBoard.fieldsObj[fieldId].removeClickListener()

        }
        GameBoard.fieldsObj[this.fieldId].addBall(ballColor)

        await this.stopTime()
        let newSmash = new SmashBalls()
        let isSmash: number = newSmash.markFieldsToSmash();

        if (isSmash == 0)
            Index.NewGameBoard.drawPlacesForBalls()

    }
    stopTime = async () => {
        // console.log(this.shortPath)

        this.shortPath.forEach((el: any) => {
            document.getElementById(`${el.y}${el.x}`)!.style.backgroundColor = "lightgray"
        })
        document.getElementById("gameBoardMainDiv")!.style.pointerEvents = 'none'
        await new Promise(r => setTimeout(r, 700));
        this.shortPath.forEach((el: any) => {
            document.getElementById(`${el.y}${el.x}`)!.style.backgroundColor = "white"
        })
        document.getElementById("gameBoardMainDiv")!.style.pointerEvents = 'auto'
    }
    ballListener = () => {
        for (let fieldId in GameBoard.fieldsObj) {
            GameBoard.fieldsObj[fieldId].changeColor("white")
        }
    }
    hoverListener = () => {
        for (let fieldId in GameBoard.fieldsObj) {
            GameBoard.fieldsObj[fieldId].changeColor("white")
        }

        let startId: string = "";
        let metaId: string = this.fieldId;



        const collection: HTMLCollection = document.getElementsByClassName("selectedBall");
        for (let item of collection) { startId = item.parentElement?.id! }
        let shortPath: shortPathConfig[] = ShortPath.createArray({ startId: startId, metaId: metaId })

        this.shortPath = shortPath;
        // console.log(shortPath)
        shortPath.forEach((el: any) => {
            document.getElementById(`${el.y}${el.x}`)!.style.backgroundColor = "red"
            document.getElementById(`${el.y}${el.x}`)!.style.cursor = "pointer"
        })

        if (shortPath.length > 0) {

            this.addClickListener()
        }

    }

    changeColor(color: string) {
        this.fieldObject!.style.backgroundColor = color;
    }
}

interface constructorConfig {
    row: HTMLDivElement;
    fieldId: string;
}

interface ballObject {
    object: HTMLDivElement;
}

interface shortPathConfig {

    x: number,
    y: number

}