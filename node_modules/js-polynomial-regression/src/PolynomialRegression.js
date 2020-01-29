import Matrix from "./Matrix";
import DataPoint from "./DataPoint";

/**
 * The constructor for a PolynomialRegression object an example of it's usage is below
 *
 *
 * var someData = [];
 * someData.push(new DataPoint(0.0, 1.0));
 * someData.push(new DataPoint(1.0, 3.0));
 * someData.push(new DataPoint(2.0, 6.0));
 * someData.push(new DataPoint(3.0, 9.0));
 * someData.push(new DataPoint(4.0, 12.0));
 * someData.push(new DataPoint(5.0, 15.0));
 * someData.push(new DataPoint(6.0, 18.0));
 *
 * var poly = new PolynomialRegression(someData, 3);
 * var terms = poly.getTerms();
 *
 * for(var i = 0; i < terms.length; i++){
 *    console.log("term " + i, terms[i]);
 * }
 * console.log(poly.predictY(terms, 5.0));
 *
 *
 *
 * @param theData
 * @param degrees
 * @constructor
 */
export default class PolynomialRegression {

    /**
     *
     * @param {Array} list
     * @param {Number} degrees
     * @returns {PolynomialRegression}
     */
    static read(list, degrees){
        const data_points = list.map(item => {
            return new DataPoint(item.x, item.y);
        });

        return new PolynomialRegression(data_points, degrees);
    }
    
    constructor(data_points, degrees) {
        //private object variables
        this.data        = data_points;
        this.degree      = degrees;
        this.matrix      = new Matrix();
        this.leftMatrix  = [];
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
    sumX (anyData, power) {
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
    sumXTimesY(anyData, power){
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
    sumY (anyData, power){
        let sum = 0;
        for (let i = 0; i < anyData.length; i++) {
            sum += Math.pow(anyData[i].y, power);
        }
        return sum;
    }
    
    /**
     * generate the left matrix
     */
    generateLeftMatrix(){
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
    generateRightMatrix(){
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
    getTerms(){
        return this.matrix.gaussianJordanElimination(this.leftMatrix, this.rightMatrix);
    }
    
    /**
     * Predicts the Y value of a data set based on polynomial coefficients and the value of an independent variable
     * @param terms
     * @param x
     * @returns {number}
     */
    predictY(terms, x){
    
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