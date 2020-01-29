const testMode = false; // 为true时可以在浏览器打开不报错
// vscode webview 网页和普通网页的唯一区别：多了一个acquireVsCodeApi方法
const vscode = testMode ? {} : acquireVsCodeApi();
const callbacks = {};

class DataPoint {
    constructor(x,y){
        this.x = x;
        this.y = y;
    }
}

class Matrix {

    /**
     * performs backward substitution on a matrix
     * @param anyMatrix - a matrix that has already undergone forward substitution
     * @param arr - an array that will ultimately be the final output for A0 - Ak
     * @param row - last row index
     * @param col - column index
     * @returns {*}
     */
    backwardSubstitution(anyMatrix, arr, row, col) {
        if (row < 0 || col < 0) {
            return arr;
        }
        else {
            const rows = anyMatrix.length;
            const cols = anyMatrix[0].length - 1;
            let current = 0;
            let counter = 0;

            for (let i = cols - 1; i >= col; i--) {

                if (i === col) {
                    current = anyMatrix[row][cols] / anyMatrix[row][i];


                } else {
                    anyMatrix[row][cols] -= anyMatrix[row][i] * arr[rows - 1 - counter];
                    counter++;
                }
            }

            arr[row] = current;
            return this.backwardSubstitution(anyMatrix, arr, row - 1, col - 1);
        }
    }


    /**
     * Combines a square matrix with a matrix with K rows and only 1 column for GJ Elimination
     * @param left
     * @param right
     * @returns {*[]}
     */
    combineMatrices(left, right) {

        const rows = right.length;
        const cols = left[0].length;
        const returnMatrix = [];

        for (let i = 0; i < rows; i++) {
            returnMatrix.push([]);

            for (let j = 0; j <= cols; j++) {

                if (j === cols) {

                    returnMatrix[i][j] = right[i];

                } else {

                    returnMatrix[i][j] = left[i][j];
                }
            }
        }

        return returnMatrix;
    };

    /**
     * Performs forward elimination for GJ elimination to form an upper right triangle matrix
     * @param anyMatrix
     * @returns {*[]}
     */
    forwardElimination(anyMatrix) {

        const rows = anyMatrix.length;
        const cols = anyMatrix[0].length;
        const matrix = [];
        //returnMatrix = anyMatrix;
        for (let i = 0; i < rows; i++) {

            matrix.push([]);

            for (let j = 0; j < cols; j++) {
                matrix[i][j] = anyMatrix[i][j];
            }
        }

        for (let x = 0; x < rows - 1; x++) {

            for (let z = x; z < rows - 1; z++) {

                const numerator = matrix[z + 1][x];
                const denominator = matrix[x][x];
                const result = numerator / denominator;


                for (let i = 0; i < cols; i++) {

                    matrix[z + 1][i] = matrix[z + 1][i] - (result * matrix[x][i]);
                }
            }
        }
        return matrix;
    };

    /**
     * THIS METHOD ACTS LIKE A CONTROLLER AND PERFORMS ALL THE NECESSARY STEPS OF GJ ELIMINATION TO PRODUCE
     * THE TERMS NECESSARY FOR POLYNOMIAL REGRESSION USING THE LEAST SQUARES METHOD WHERE SUM(RESIDUALS) = 0
     * @param leftMatrix
     * @param rightMatrix
     * @returns {*}
     */
    gaussianJordanElimination(leftMatrix, rightMatrix) {

        const combined = this.combineMatrices(leftMatrix, rightMatrix);
        const fwdIntegration = this.forwardElimination(combined);
        //NOW, FINAL STEP IS BACKWARD SUBSTITUTION WHICH RETURNS THE TERMS NECESSARY FOR POLYNOMIAL REGRESSION
        return this.backwardSubstitution(fwdIntegration, [], fwdIntegration.length - 1, fwdIntegration[0].length - 2);
    }

    /**
     * returns the identity matrix for a matrix such that anyMatrix * identitymatrix = anyMatrix
     * This is useful for inverting a matrix
     * @param anyMatrix
     * @returns {*[]}
     */
    identityMatrix(anyMatrix) {

        const rows = anyMatrix.length;
        const cols = anyMatrix[0].length;
        const identityMatrix = [[]];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (j == i) {
                    identityMatrix[i][j] = 1;
                } else {
                    identityMatrix[i][j] = 0;
                }
            }
        }
        return identityMatrix;
    }


    /**
     * calculates the product of 2 matrices
     * @param matrix1
     * @param matrix2
     * @returns {*}
     */
    matrixProduct(matrix1, matrix2) {
        const numCols1 = matrix1[0].length;
        const numRows2 = matrix2.length;

        if (numCols1 != numRows2) {
            return false;
        }

        const product = [[]];

        for (let rows = 0; rows < numRows2; rows++) {
            for (let cols = 0; cols < numCols1; cols++) {
                product[rows][cols] = this.doMultiplication(matrix1, matrix2, rows,
                    cols, numCols1);
            }
        }
        return product;
    };

    /**
     * performs multiplication for an individual matrix cell
     * @param matrix1
     * @param matrix2
     * @param row
     * @param col
     * @param numCol
     * @returns {number}
     */
    doMultiplication(matrix1, matrix2, row, col, numCol) {
        let counter = 0;
        let result = 0;
        while (counter < numCol) {
            result += matrix1[row][counter] * matrix2[counter][col];
            counter++;
        }
        return result;
    }


    /**
     * Multiplies a row of a matrix - 1 of the fundamental matrix operations
     * @param anyMatrix
     * @param rowNum
     * @param multiplier
     * @returns {*[]}
     */
    multiplyRow(anyMatrix, rowNum, multiplier) {
        const rows = anyMatrix.length;
        const cols = anyMatrix[0].length;
        const mMatrix = [[]];

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (i == rowNum) {
                    mMatrix[i][j] = anyMatrix[i][j] * multiplier;
                } else {
                    mMatrix[i][j] = anyMatrix[i][j];
                }
            }
        }

        return mMatrix;
    }
}

class PolynomialRegression {

    /**
     *
     * @param {Array} list
     * @param {Number} degrees
     * @returns {PolynomialRegression}
     */
    static read(list, degrees) {
        const data_points = list.map(item => {
            return new DataPoint(item.x, item.y);
        });

        return new PolynomialRegression(data_points, degrees);
    }

    constructor(data_points, degrees) {
        //private object variables
        this.data = data_points;
        this.degree = degrees;
        this.matrix = new Matrix();
        this.leftMatrix = [];
        this.rightMatrix = [];

        this.generateLeftMatrix();
        this.generateRightMatrix();
    }

    /**
     * Sums up all x coordinates raised to a power
     * @param anyData
     * @param power
     * @returns {number}
     */
    sumX(anyData, power) {
        let sum = 0;
        for (let i = 0; i < anyData.length; i++) {
            sum += Math.pow(anyData[i].x, power);
        }
        return sum;
    }


    /**
     * sums up all x * y where x is raised to a power
     * @param anyData
     * @param power
     * @returns {number}
     */
    sumXTimesY(anyData, power) {
        let sum = 0;
        for (let i = 0; i < anyData.length; i++) {
            sum += Math.pow(anyData[i].x, power) * anyData[i].y;
        }
        return sum;
    }

    /**
     * Sums up all Y's raised to a power
     * @param anyData
     * @param power
     * @returns {number}
     */
    sumY(anyData, power) {
        let sum = 0;
        for (let i = 0; i < anyData.length; i++) {
            sum += Math.pow(anyData[i].y, power);
        }
        return sum;
    }

    /**
     * generate the left matrix
     */
    generateLeftMatrix() {
        for (let i = 0; i <= this.degree; i++) {
            this.leftMatrix.push([]);
            for (let j = 0; j <= this.degree; j++) {
                if (i === 0 && j === 0) {
                    this.leftMatrix[i][j] = this.data.length;
                } else {
                    this.leftMatrix[i][j] = this.sumX(this.data, (i + j));
                }
            }
        }
    }

    /**
     * generates the right hand matrix
     */
    generateRightMatrix() {
        for (let i = 0; i <= this.degree; i++) {
            if (i === 0) {
                this.rightMatrix[i] = this.sumY(this.data, 1);
            } else {
                this.rightMatrix[i] = this.sumXTimesY(this.data, i);
            }
        }
    }


    /**
     * gets the terms for a polynomial
     * @returns {*}
     */
    getTerms() {
        return this.matrix.gaussianJordanElimination(this.leftMatrix, this.rightMatrix);
    }

    /**
     * Predicts the Y value of a data set based on polynomial coefficients and the value of an independent variable
     * @param terms
     * @param x
     * @returns {number}
     */
    predictY(terms, x) {

        let result = 0;
        for (let i = terms.length - 1; i >= 0; i--) {
            if (i === 0) {
                result += terms[i];
            } else {
                result += terms[i] * Math.pow(x, i);
            }
        }
        return result;
    }

}

/**
 * 调用vscode原生api
 * @param data 可以是类似 {cmd: 'xxx', param1: 'xxx'}，也可以直接是 cmd 字符串
 * @param cb 可选的回调函数
 */
function callVscode(data, cb) {
    if (typeof data === 'string') {
        data = { cmd: data };
    }
    if (cb) {
        // 时间戳加上5位随机数
        const cbid = Date.now() + '' + Math.round(Math.random() * 100000);
        callbacks[cbid] = cb;
        data.cbid = cbid;
    }
    vscode.postMessage(data);
}

var arr = new Array();

const canvas = document.getElementById('myCanvas');
const delButton = document.getElementById('delButton');
const clearButton = document.getElementById('clearButton');
const range = document.getElementById('range');
const range_label = document.getElementById('range_label');
const position = document.getElementById('position');
const outputstyle = document.getElementById('outputstyle');
const outputstyle_left = document.getElementById('outputstyle_left');
const outputstyle_middle = document.getElementById('outputstyle_middle');
const outputstyle_right = document.getElementById('outputstyle_right');
const outputstyle_center = document.getElementById('outputstyle_center');
const outputstyle_box = document.getElementById('outputstyle_box');
const outputstyle_none = document.getElementById('outputstyle_none');
const position_quadrant_1 = document.getElementById('position_quadrant_1');
const position_quadrant_2 = document.getElementById('position_quadrant_2');
const position_quadrant_3 = document.getElementById('position_quadrant_3');
const position_quadrant_4 = document.getElementById('position_quadrant_4');
const position_center = document.getElementById('position_center');
const bgimg = document.getElementById('img_div');
const plotBtn = document.getElementById('plot');
const range_text = document.getElementById('range_text');
const generateBtn = document.getElementById('generate');
const max_range_text = document.getElementById('max_range');

position_center.checked = true;
outputstyle_middle.checked = true;

max_range_text.value = 500;

window.addEventListener('DOMContentLoaded', () => {
    canvas.addEventListener('mousedown', (e) => {
        var x = e.clientX;
        var y = e.clientY;
        arr.push([x, y]);
        draw(x, y);
        setRange();
    });
    plotBtn.addEventListener('click', () => {
        preview();
    });
    range_text.addEventListener('change', () => {
        range.value = range_text.value;
        range_label.innerHTML = range.value;
    });
    range.addEventListener('change', () => {
        range_label.innerHTML = range.value;
        range_text.value = range.value;
    });
    range.addEventListener('mousedown', () => {
        range_label.innerHTML = range.value;
        range_text.value = range.value;
    });
    range.addEventListener('mouseenter', () => {
        range_label.innerHTML = range.value;
        range_text.value = range.value;
    });
    range.addEventListener('mouseover', () => {
        range_label.innerHTML = range.value;
        range_text.value = range.value;
    });
    delButton.addEventListener('click', () => {
        console.log(arr.pop());
        repaint();
        setRange();
    });
    clearButton.addEventListener('click', () => {
        clearDots();
        setRange();
    });
    generateBtn.addEventListener('click', () => {
        const m = preview();
        if (m == 'error') { return ; }
        var data = new Array();
        for (var i = 0; i < arr.length; i ++) {
            var q4_x = arr[i][0] - 20, q4_y = -1 * (arr[i][1] - 4);
            const coefficient = parseFloat(max_range_text.value) / 500.0
            if (position_quadrant_4.checked) {
                data.push({x: q4_x * coefficient, y: q4_y * coefficient});
                console.log(data[i]);
            } else if (position_quadrant_3.checked) {
                data.push({x: (q4_x - 500) * coefficient, y: q4_y * coefficient});
            } else if (position_quadrant_1.checked) {
                data.push({x: q4_x * coefficient, y: (500 + q4_y) * coefficient});
            } else if (position_quadrant_2.checked) {
                data.push({x: (q4_x - 500) * coefficient, y: (500 + q4_y) * coefficient});
            } else if (position_center.checked) {
                data.push({x: (q4_x - 250) * coefficient, y: (250 + q4_y) * coefficient});
            }
        }
        //Factory function - returns a PolynomialRegression instance. 2nd argument is the degree of the desired polynomial equation.
        const model = PolynomialRegression.read(data, range.value);
        //terms is a list of coefficients for a polynomial equation. We'll feed these to predict y so that we don't have to re-compute them for every prediction.
        const terms = model.getTerms();
        //10 is just an example of an x value, the second argument is the independent variable being predicted.
        var func_expression = terms[0];
        var tex_expression = Math.round(terms[0] * 10.0) / 10.0 + "";
        for (var i = 1; i < terms.length; i ++) {
            func_expression += terms[i] > 0 ? (' + ' + terms[i] + " * x ^ " + i) : (terms[i] < 0 ? (' ' + terms[i] + " * x ^ " + i) : '');
            tex_expression += terms[i] > 0 ? (' + ' + Math.round(terms[i] * 1000.0) / 1000.0 + "x" + (i == 1 ? "" : " ^ " + i)) : (terms[i] < 0 ? (' ' + Math.round(terms[i] * 1000.0) / 1000.0 + "x" + (i == 1 ? "" : " ^ " + i)) : '');
        }
        var axis_pos = "";
        if (outputstyle_left.checked) {
            axis_pos = "left";
        } else if (outputstyle_middle.checked) {
            axis_pos = "middle";
        } else if (outputstyle_right.checked) {
            axis_pos = "right";
        } else if (outputstyle_center.checked) {
            axis_pos = "center";
        } else if (outputstyle_box.checked) {
            axis_pos = "box";
        } else if (outputstyle_none.checked) {
            axis_pos = "none";
        }
        data.sort((a, b) => a.x - b.x);
        var dot_str = ""
        for (var i = 0; i < data.length; i ++) {
            dot_str += '(' + data[i].x + ',' + data[i].y + ') ';
        }
        const random_flag = Math.round(Math.random() * 10000000);
        const tex_result = 
        `\t\\definecolor{c${random_flag}}{HTML}{${document.getElementById('graph_color').value.substring(1)}}
    \\begin{align*}
    \\begin{tikzpicture}
    \\begin{axis}[
    \tlegend pos=outer north east,
    \ttitle=${document.getElementById("title_text").value},
    \taxis lines = ${axis_pos},
    \txlabel = $x$,
    \tylabel = $y$,
    \tdomain=-${max_range_text.value / 2.0}:${max_range_text.value / 2.0},
    \tvariable = t,
    \ttrig format plots = rad,
    ]
    \\addplot [
    \tsamples=70,
    \tcolor=c${random_flag}
    ]
    \t{${func_expression}};
    \\addlegendentry{$y=${tex_expression}$}${
        document.getElementById("include_dots").checked ? (
    `
    \\addplot+[sharp plot]
    coordinates {
    \t${
        dot_str
    }
    };`
        ) : ""
    }
    \\end{axis}
    \\end{tikzpicture}
    \\end{align*}
    `
        document.getElementById("output").innerHTML = tex_result;
        document.getElementById("output").focus();
        document.getElementById("output").setSelectionRange(0, document.getElementById("output").innerHTML.length);
        document.execCommand('copy');
        callVscode({cmd: 'alert', info: 'Copied to the Pasteboard'}, () => {});
    });
    position.addEventListener('change', () => {
        if (position_center.checked) {
            bgimg.style = "width: 500px; height: 500px; top: 4px; left: 0px; position: relative";
            bgimg.innerHTML = `
            <svg width="500px" height="500px" viewBox="0 0 500 500" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 50 (54983) - http://www.bohemiancoding.com/sketch -->
                <title>middle</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="middle">
                        <g id="Base">
                            <rect id="Rectangle" stroke="#000000" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd" x="0.5" y="0.5" width="499" height="499"></rect>
                            <g id="Path-2" transform="translate(52.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                            <g id="Path-2" transform="translate(250.000000, 250.000000) rotate(90.000000) translate(-250.000000, -250.000000) translate(49.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                        </g>
                        <path d="M251,500 L251,5" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M254,15.8 L251,5 L248,15.8" stroke="#000000" stroke-width="2"></path>
                        <path d="M1,252 L496,252" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M485.2,255 L496,252 L485.2,249" stroke="#000000" stroke-width="2"></path>
                    </g>
                </g>
            </svg>
            `
        } else if (position_quadrant_1.checked) {
            bgimg.style = "width: 500px; height: 500px; top: 4px; left: -4px; position: relative";
            bgimg.innerHTML = `
            <svg width="503px" height="504px" viewBox="0 0 503 504" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <!-- Generator: Sketch 50 (54983) - http://www.bohemiancoding.com/sketch -->
            <title>q1</title>
            <desc>Created with Sketch.</desc>
            <defs></defs>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="q1" transform="translate(3.000000, 0.000000)">
                    <g id="Base">
                        <rect id="Rectangle" stroke="#000000" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd" x="0.5" y="0.5" width="499" height="499"></rect>
                        <g id="Path-2" transform="translate(52.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                            <path d="M251,500 L251,0"></path>
                            <path d="M201,500 L201,0"></path>
                            <path d="M301,500 L301,0"></path>
                            <path d="M351,500 L351,0"></path>
                            <path d="M401,500 L401,0"></path>
                            <path d="M1,500 L1,0"></path>
                            <path d="M51,500 L51,0"></path>
                            <path d="M101,500 L101,0"></path>
                            <path d="M151,500 L151,0"></path>
                        </g>
                        <g id="Path-2" transform="translate(250.000000, 250.000000) rotate(90.000000) translate(-250.000000, -250.000000) translate(49.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                            <path d="M251,500 L251,0"></path>
                            <path d="M201,500 L201,0"></path>
                            <path d="M301,500 L301,0"></path>
                            <path d="M351,500 L351,0"></path>
                            <path d="M401,500 L401,0"></path>
                            <path d="M1,500 L1,0"></path>
                            <path d="M51,500 L51,0"></path>
                            <path d="M101,500 L101,0"></path>
                            <path d="M151,500 L151,0"></path>
                        </g>
                    </g>
                    <path d="M1,500 L1,5" id="Path-2" stroke="#000000" stroke-width="2"></path>
                    <path id="Path-2-decoration-1" d="M4,15.8 L1,5 L-2,15.8" stroke="#000000" stroke-width="2"></path>
                    <path d="M1,500 L496,500" id="Path-2" stroke="#000000" stroke-width="2"></path>
                    <path id="Path-2-decoration-1" d="M485.2,503 L496,500 L485.2,497" stroke="#000000" stroke-width="2"></path>
                </g>
            </g>
        </svg>
            `
        } else if (position_quadrant_2.checked) {
            bgimg.style = "width: 500px; height: 500px; top: 4px; left: 0px; position: relative";
            bgimg.innerHTML = `
            <svg width="504px" height="504px" viewBox="0 0 504 504" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 50 (54983) - http://www.bohemiancoding.com/sketch -->
                <title>q2</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="q2">
                        <g id="Base">
                            <rect id="Rectangle" stroke="#000000" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd" x="0.5" y="0.5" width="499" height="499"></rect>
                            <g id="Path-2" transform="translate(52.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M201,500 L201,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                            <g id="Path-2" transform="translate(250.000000, 250.000000) rotate(90.000000) translate(-250.000000, -250.000000) translate(49.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M201,500 L201,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                        </g>
                        <path d="M500,500 L500,5" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M503,15.8 L500,5 L497,15.8" stroke="#000000" stroke-width="2"></path>
                        <path d="M1,500 L496,500" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M485.2,503 L496,500 L485.2,497" stroke="#000000" stroke-width="2"></path>
                    </g>
                </g>
            </svg>
            `
        } else if (position_quadrant_3.checked) {
            bgimg.style = "width: 500px; height: 500px; top: 0px; left: 0px; position: relative";
            bgimg.innerHTML = `
            <svg width="504px" height="504px" viewBox="0 0 504 504" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 50 (54983) - http://www.bohemiancoding.com/sketch -->
                <title>q3</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="q3" transform="translate(0.000000, 4.000000)">
                        <g id="Base">
                            <rect id="Rectangle" stroke="#000000" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd" x="0.5" y="0.5" width="499" height="499"></rect>
                            <g id="Path-2" transform="translate(52.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M201,500 L201,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                            <g id="Path-2" transform="translate(250.000000, 250.000000) rotate(90.000000) translate(-250.000000, -250.000000) translate(49.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M201,500 L201,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                        </g>
                        <path d="M500,500 L500,5" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M503,15.8 L500,5 L497,15.8" stroke="#000000" stroke-width="2"></path>
                        <path d="M1,0 L496,0" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M485.2,3 L496,0 L485.2,-3" stroke="#000000" stroke-width="2"></path>
                    </g>
                </g>
            </svg>
            `
        } else if (position_quadrant_4.checked) {
            bgimg.style = "width: 500px; height: 500px; top: 0px; left: -4px; position: relative";
            bgimg.innerHTML = `
            <svg width="504px" height="504px" viewBox="0 0 504 504" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                <!-- Generator: Sketch 50 (54983) - http://www.bohemiancoding.com/sketch -->
                <title>q4</title>
                <desc>Created with Sketch.</desc>
                <defs></defs>
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="q4" transform="translate(3.000000, 4.000000)">
                        <g id="Base" transform="translate(1.000000, 0.000000)">
                            <rect id="Rectangle" stroke="#000000" stroke-width="1" fill="#FFFFFF" fill-rule="evenodd" x="0.5" y="0.5" width="499" height="499"></rect>
                            <g id="Path-2" transform="translate(52.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M201,500 L201,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                            <g id="Path-2" transform="translate(250.000000, 250.000000) rotate(90.000000) translate(-250.000000, -250.000000) translate(49.000000, 0.000000)" stroke="#CACACA" stroke-width="2">
                                <path d="M251,500 L251,0"></path>
                                <path d="M201,500 L201,0"></path>
                                <path d="M301,500 L301,0"></path>
                                <path d="M351,500 L351,0"></path>
                                <path d="M401,500 L401,0"></path>
                                <path d="M1,500 L1,0"></path>
                                <path d="M51,500 L51,0"></path>
                                <path d="M101,500 L101,0"></path>
                                <path d="M151,500 L151,0"></path>
                            </g>
                        </g>
                        <path d="M1,500 L1,5" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M4,15.8 L1,5 L-2,15.8" stroke="#000000" stroke-width="2"></path>
                        <path d="M2,0 L497,0" id="Path-2" stroke="#000000" stroke-width="2"></path>
                        <path id="Path-2-decoration-1" d="M486.2,3 L497,0 L486.2,-3" stroke="#000000" stroke-width="2"></path>
                    </g>
                </g>
            </svg>
            `
        }
    });
});

function preview() {
    repaint();
    var data = new Array();
    for (var i = 0; i < arr.length; i ++) {
        data.push({x: arr[i][0] - 20, y: -1 * (arr[i][1] - 4)});
    }
    //Factory function - returns a PolynomialRegression instance. 2nd argument is the degree of the desired polynomial equation.
    const model = PolynomialRegression.read(data, range.value);
    //terms is a list of coefficients for a polynomial equation. We'll feed these to predict y so that we don't have to re-compute them for every prediction.
    const terms = model.getTerms();
    if (isNaN(terms[0])) {
        callVscode({cmd: 'error', info: 'Invalid input, please recheck your data.'}, () => {})
        return 'error';
    }
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(0, -model.predictY(terms, 0));
        for (var i = 1; i <= 500; i ++) {
            ctx.lineTo(i, -model.predictY(terms, i));
        }
        ctx.strokeStyle = 'rgba(255, 0, 0, 1)'
        ctx.stroke();
    }
    return 'success';
}

function setRange() {
    range.max = arr.length - 1;
}

/**
 * Repaint the canvas area
 */
function repaint() {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 500, 500);
        for (var i = 0; i < arr.length; i++) {
            draw(arr[i][0], arr[i][1]);
        }
    }
}

function clearDots() {
    arr = new Array();
    repaint();
}

/**
 * @param {number} x
 * @param {number} y
 */
function draw(x, y) {
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d');
        ctx.strokeStyle = 'rgba(255, 165, 0, 1)';
        ctx.fillStyle = 'rgba(255, 165, 0, 1)';
        var circle = new Path2D();
        circle.arc(x - 20, y - 4, 5, 0, 2 * Math.PI);
        ctx.stroke(circle);
        circle = new Path2D();
        circle.arc(x - 20, y - 4, 3, 0, 2 * Math.PI);
        ctx.fill(circle);
    }
}