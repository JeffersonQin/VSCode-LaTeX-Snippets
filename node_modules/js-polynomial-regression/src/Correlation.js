/**
 * Created by rbmenke on 8/3/15.
 *
 * Check out a live demo on codepen http://codepen.io/RobertMenke/pen/ONvVXq
 *
 */

/**
 * constructs a Correlation object with a few public methods for analyzing data sets
 * @param x - an array of Numbers
 * @param y - an array of Numbers
 * @constructor
 */
export default class Correlation {
    
    constructor(x, y) {
        this.x       = x;
        this.y       = y;
    }
    
    /**
     * Gets the correlation coefficient of 2 lists
     * @returns {number}
     */
    correlationCoefficient() {
        return this.diffFromAvg() / (Math.sqrt(this.diffFromAvgSqrd(this.x) * this.diffFromAvgSqrd(this.y)));
    }
    
    
    /**
     * get the average of a list
     * @param {Array} list
     * @returns {number}
     */
    avg(list) {
        return list.reduce((carry, item) => item + carry, 0) / list.length;
    }
    
    /**
     * gets the standard deviation of an array
     * @param aList
     * @returns {number}
     */
    stdv(aList) {
        return Math.sqrt(this.diffFromAvgSqrd(aList) / (aList.length - 1));
    }
    
    /**
     * The B part of the regression equation -> y = mx + B
     * @returns {number}
     */
    b0() {
        return this.avg(this.y) - this.b1() * this.avg(this.x);
    }
    
    /**
     * the M part of the regression equation -> y = Mx + b
     * @returns {number}
     */
    b1() {
        return this.diffFromAvg() / this.diffFromAvgSqrd(X);
    }
    
    
    /**
     * gets the sum of (Xi - Mx)(Yi - My)
     * @returns {number}
     */
    diffFromAvg() {
        const avg_x = this.avg(this.x);
        const avg_y = this.avg(this.y);

        return this.x.reduce((carry, item, i) =>
            carry + (item - avg_x) * (this.y[i] - avg_y)
        , 0);
    }
    
    /**
     * Returns the sum of (Xi - Mx)^2
     * @param list
     * @returns {number}
     */
    diffFromAvgSqrd(list) {
        return list.reduce((carry, item) =>
            carry + Math.pow((item - this.avg(list)), 2)
        , 0);
    }
    
    /**
     * Gets the sum of a list
     * @param list
     * @returns {number}
     */
    sumList(list){
        return list.reduce((carry, item) => carry + item, 0);
    }
    
    /**
     * sum of each list item squared
     * @param list
     * @returns {number}
     */
    sumSquares (list){
        return list.reduce((carry, item) => carry + Math.pow(item, 2), 0);
    };

    /**
     * Sums x * y
     * @returns {*}
     */
    sumXTimesY (){
        return this.x.reduce((carry, item, i) =>
            carry + (this.y[i] * item)
        , 0);
    }
    
    /**
     * Gives the predicted value of the dependent variable based on the independent variable.
     * The equation is in the from y = mx + b
     * @param independentVariable
     * @returns {number}
     */
    linearRegression (independentVariable){
        return this.b1() * independentVariable + this.b0();
    }
}