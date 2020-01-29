

export default class Matrix {

    /**
     * performs backward substitution on a matrix
     * @param anyMatrix - a matrix that has already undergone forward substitution
     * @param arr - an array that will ultimately be the final output for A0 - Ak
     * @param row - last row index
     * @param col - column index
     * @returns {*}
     */
    backwardSubstitution (anyMatrix, arr, row, col) {
        if (row < 0 || col < 0) {
            return arr;
        } 
        else {
            const rows  = anyMatrix.length;
            const cols  = anyMatrix[0].length - 1;
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
    combineMatrices (left, right){

        const rows         = right.length;
        const cols         = left[0].length;
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
    forwardElimination(anyMatrix){

        const rows    = anyMatrix.length;
        const cols    = anyMatrix[0].length;
        const matrix  = [];
        //returnMatrix = anyMatrix;
        for (let i = 0; i < rows; i++) {

            matrix.push([]);

            for (let j = 0; j < cols; j++) {
                matrix[i][j] = anyMatrix[i][j];
            }
        }

        for (let x = 0; x < rows - 1; x++) {

            for (let z = x; z < rows - 1; z++) {

                const numerator   = matrix[z + 1][x];
                const denominator = matrix[x][x];
                const result      = numerator / denominator;


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

        const combined       = this.combineMatrices(leftMatrix, rightMatrix);
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
    identityMatrix (anyMatrix){

        const rows           = anyMatrix.length;
        const cols           = anyMatrix[0].length;
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
    matrixProduct (matrix1, matrix2) {
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
    doMultiplication (matrix1, matrix2, row, col, numCol) {
        let counter = 0;
        let result  = 0;
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
    multiplyRow (anyMatrix, rowNum, multiplier){
        const rows    = anyMatrix.length;
        const cols    = anyMatrix[0].length;
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