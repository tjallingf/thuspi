const items = [
    'ConfigController',
    'Controller',
    'DeviceController',
    'ExtensionController',
    'FlowController',
    'LocaleController',
    'RouteController',
    'SerialController',
    'StorageController',
    'TokenController',
    'UserController'
];

module.exports = Object.fromEntries(items.map(item => [ item, require('./'+item)]));