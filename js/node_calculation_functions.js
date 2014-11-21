/**
 * Created by thor on 11/21/14.
 */


function compute(computation_name, input_vals) {
    switch (computation_name) {
        case 'multiply':
            return multiply(input_vals)
        case 'divide':
            return divide(input_vals)
        case 'minus_multiply':
            return minus_multiply(input_vals)
        case 'plus':
            return plus(input_vals)
        case 'minus':
            return minus(input_vals)
        case 'multiply_power':
            return multiply_power(input_vals)
        default:
            // TODO: What to do in this case?
    }
}

function plus(input_vals){
    var result = 0
    var i = 0
    for (i in input_vals) {
        result += input_vals[i]
    }
    return result
}

function minus(input_vals){
    return input_vals[0] - input_vals[1]
}

function multiply(input_vals){
    var result = 1
    var i = 0
    for (i in input_vals) {
        result *= input_vals[i]
    }
    return result
}

function divide(input_vals){
    return input_vals[0] / input_vals[1]
}

function power(input_vals) {
    return Math.pow(input_vals[0], input_vals[1])
}

function multiply_power(input_vals) {
    return input_vals[0] * Math.pow(input_vals[1], input_vals[2])
}

function minus_multiply(input_vals) {
    return input_vals[0] - input_vals[1] * input_vals[2]
}
