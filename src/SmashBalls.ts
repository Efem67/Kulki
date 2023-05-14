import { GameBoard } from "./GameBoard";
export class SmashBalls {
    optionsArr: optionsArrConfig[] = [
        {
            down: { x: -1, y: 1 },
            up: { x: 1, y: -1 }
        },
        {
            down: { x: 1, y: 1 },
            up: { x: -1, y: -1 }
        },
        {
            down: { x: 0, y: 1 },
            up: { x: 0, y: -1 }
        },
        {
            up: { x: -1, y: 0 },
            down: { x: 1, y: 0 }
        },
    ]

    markFieldsToSmash() {
        let arrayWithIds: Array<string> = []
        let finalArr: Array<string> = []
        for (let fieldId in GameBoard.fieldsObj) {
            if (!GameBoard.fieldsObj[fieldId].isEmpty && !GameBoard.fieldsObj[fieldId].toSmash) {
                let color: string = GameBoard.fieldsObj[fieldId].fieldObject.firstElementChild?.id!;

                for (let option of this.optionsArr) {
                    let count: number = 1;
                    let ballsToSmash: number = 1;
                    let doWhile = true;
                    let opOrDown: keyof optionsArrConfig = 'up'

                    while (doWhile) {
                        let id: string = `${Number(fieldId.charAt(0)) + count * option[opOrDown].y}${Number(fieldId.charAt(1)) + count * option[opOrDown].x}`
                        let position: any = GameBoard.fieldsObj[id]
                        if (position != undefined) {
                            if (position.fieldObject.firstElementChild?.id! == color) {
                                if (arrayWithIds.indexOf(id) == -1) {
                                    arrayWithIds.push(id)
                                    position.toSmash = true;
                                    ballsToSmash += 1;
                                }

                                count += 1;

                            }
                            else if (position.fieldObject.firstElementChild?.id! != color && opOrDown == 'up') {
                                opOrDown = 'down';
                                count = 1;
                            } else {
                                doWhile = false
                            }
                        }
                        else if (position == undefined && opOrDown == 'up') {
                            opOrDown = 'down'
                            count = 1;
                        }
                        else if (position == undefined && opOrDown == 'down') doWhile = false
                    }
                    if (ballsToSmash >= 5) {
                        GameBoard.fieldsObj[fieldId].toSmash = true;
                        arrayWithIds.push(fieldId)
                        arrayWithIds.forEach((id: string) => {
                            finalArr.push(id)
                        })
                    } else {
                        arrayWithIds = []
                        arrayWithIds.forEach((id: string) => {
                            GameBoard.fieldsObj[id].toSmash = false
                        })
                    }
                }

            }

        }

        finalArr = [...new Set(finalArr)];

        finalArr.forEach((id: string) => {
            GameBoard.fieldsObj[id].deleteBall()
        })

        let pointsH2: HTMLElement = document.getElementById("pointsText")!
        let prevPoints: number = Number(pointsH2.innerHTML);
        let newPoints: number = prevPoints + finalArr.length
        pointsH2.innerHTML = String(newPoints);

        for (let fieldId in GameBoard.fieldsObj) {
            GameBoard.fieldsObj[fieldId].toSmash = false;
        }
        return finalArr.length
    }
}

interface optionsArrConfig {

    up: {
        x: number,
        y: number
    },
    down: {
        x: number,
        y: number,
    }

}