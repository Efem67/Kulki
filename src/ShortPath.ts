import { Field } from "./Field";
import { GameBoard } from "./GameBoard";
export class ShortPath {

    static createArray(properties: createArrConfig) {
        let startY: number = Number(properties.startId.charAt(0))
        let startX: number = Number(properties.startId.charAt(properties.startId.length - 1))
        let metaY: number = Number(properties.metaId.charAt(0))
        let metaX: number = Number(properties.metaId.charAt(properties.metaId.length - 1))
        let arrayA: Array<Array<Array<string>>> = []

        for (let i: number = 0; i < 9; i++) {
            let row: Array<Array<string>> = [];
            for (let j = 0; j < 9; j++) {
                if (i == startY && j == startX) {
                    row.push(['s'])
                }
                else if (i == metaY && j == metaX) {
                    row.push(['m'])
                } else {
                    if (document.getElementById(`${i}${j}`)?.hasChildNodes()) {
                        row.push(['x'])
                    } else {
                        row.push(['0'])
                    }
                }
            }
            arrayA.push(row)
        }

        return ShortPath.ShortPath(arrayA)

    }

    static ShortPath(currentPositionsArr: Array<Array<Array<string>>>) {

        let sFieldX: number, sFieldY: number;
        let arrayB: Array<Array<Array<string>>> = []

        let optionsArr = [
            { x: 0, y: 1 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: -1, y: 0 },
        ]

        for (let i = 0; i < currentPositionsArr.length; i++) {
            let row = [];
            for (let j = 0; j < currentPositionsArr.length; j++) {
                row.push([''])
            }
            arrayB.push(row)
        }

        let positionsArr: positionsArr[] = []
        let continueAlgorithm = false;
        currentPositionsArr.forEach((row, rowIndex) => {
            row.forEach((field, index) => {
                if (field[0] == 'm') {
                    optionsArr.forEach((el) => {
                        try {
                            let position = currentPositionsArr[rowIndex + el.y][index + el.x][0]
                            if (position == 's' || position == '0') { continueAlgorithm = true }
                        } catch { }
                    })
                }
            });
        })

        if (continueAlgorithm == false) return [];


        currentPositionsArr.forEach((row, rowIndex) => {
            row.forEach((el, index) => {
                if (el[0] == 's') {

                    positionsArr.push({ startX: index, startY: rowIndex })
                    sFieldY = rowIndex;
                    sFieldX = index;
                    arrayB[rowIndex][index][0] += `${rowIndex}_${index},`
                }
            });
        })

        let wantReturn = false;
        let end = true;
        let i = 0;
        while (end == true) {

            if (i > 0) {
                currentPositionsArr.forEach((row, rowIndex) => {
                    row.forEach((el, index) => {
                        if (el[0] == String(i)) {
                            positionsArr.push({ startX: index, startY: rowIndex })
                        }
                    });
                })
            }

            let biggerCount: number = 0;
            positionsArr.forEach((indexes: positionsArr) => {
                // console.log(positionsArr.length)
                let smallCount: number = 0
                optionsArr.forEach((el) => {
                    try {
                        let field = currentPositionsArr[indexes.startY + el.y][indexes.startX + el.x][0];
                        if (field == "x") {
                            smallCount += 1;
                        }
                        let prevValues
                        if (i == 1) prevValues = `${sFieldY}_${sFieldX},`
                        else prevValues = arrayB[indexes.startY][indexes.startX][0]

                        if (field == '0') {
                            currentPositionsArr[indexes.startY + el.y][indexes.startX + el.x][0] = `${i + 1}`;
                            arrayB[indexes.startY + el.y][indexes.startX + el.x][0] = prevValues + `${indexes.startY}_${indexes.startX},`
                        }
                        if (field == 'm') {
                            arrayB[indexes.startY + el.y][indexes.startX + el.x][0] = prevValues + `${indexes.startY}_${indexes.startX},`
                            end = false
                        }
                    } catch (error) {
                        smallCount += 1;
                    }
                })
                if (smallCount == optionsArr.length) {
                    biggerCount += 1;
                }
            })

            if (biggerCount == positionsArr.length) {
                end = false
                wantReturn = true;
            }
            positionsArr = [];
            i += 1;

        }
        if (wantReturn) {
            return []
        }
        let shortPathFields: shortPathFields[] = []
        currentPositionsArr.forEach((row, rowIndex) => {
            row.forEach((el, index) => {
                if (el[0] == 'm') {

                    let arr = arrayB[rowIndex][index][0].split(',')
                    arr.forEach((el: any) => {
                        let indexes = el.split('_')
                        let object = { y: indexes[0], x: indexes[1] }
                        shortPathFields.push(object);
                    })
                    shortPathFields.pop()
                    shortPathFields.push({ y: rowIndex, x: index })
                }
            });
        })
        return shortPathFields;
    }

}

interface positionsArr {
    startX: number,
    startY: number
}

interface shortPathFields {
    y: number,
    x: number
}

interface createArrConfig {
    startId: string;
    metaId: string;
}