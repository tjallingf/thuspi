const schema = {
    type: 'object',
    properties: {
        controller: { type: 'string' },
        optionsSchema: { type: 'string' }
    },
    required: [ 'controller' ]
}

module.exports = schema;