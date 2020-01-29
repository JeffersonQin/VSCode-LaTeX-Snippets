![alt tag](/example/polynomial_regression_example.png)

# About

This library can make predictions about data using a technique called polynomial regression.

Polynomial regression uses a technique called Gaussian-Jordan elimination, which creates a predictive model that more accurately fits non-linear data.

# How to use

Let's say you have your typical cartesian coordinates (x and y coordinates)

```javascript
const data = [
    {
        x : 5,
        y : 8
    },
    {
        x : 9,
        y : 12
    }
    // and so on...
];         
```

This library will read this data, and then make a prediction about a y value, given an x.

```javascript
//This library is a UMD module (thanks webpack!)
import PolynomialRegression from "js-polynomial-regression";

//Factory function - returns a PolynomialRegression instance. 2nd argument is the degree of the desired polynomial equation.
const model = PolynomialRegression.read(data, 3);
//terms is a list of coefficients for a polynomial equation. We'll feed these to predict y so that we don't have to re-compute them for every prediction.
const terms = model.getTerms();
//10 is just an example of an x value, the second argument is the independent variable being predicted.
const prediction = model.predictY(terms, 10);
```

That's it! I've created an example using random data in the example folder of this repo. Please use the issues section to communicate any bugs, questions, or feature requests.