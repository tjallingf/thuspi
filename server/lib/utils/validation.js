const SchemaValidationError = require('@/errors/SchemaValidationError');
const Ajv = require('ajv');

const ajvDefault = new Ajv();
const ajvRemoveAditional = new Ajv({ removeAdditional: true });

function validate(data, schema, removeAdditional = false) {
    const ajv = (removeAdditional ? ajvRemoveAditional : ajvDefault);
    const validate = ajv.compile(schema);
    const isValid = validate(data);

    // Throw an error if the data is invalid
    if(!isValid)
        throw new SchemaValidationError(validate.errors);
    
    return isValid;
}

module.exports = { validate };