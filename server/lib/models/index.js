const items = [
    'DeviceModel',
    'ExtensionModel',
    'Model',
    'SerialModel',
    'UserModel'
];

module.exports = {
    'Model': nodeRequire('./Model'),
    'DeviceModel': nodeRequire('./DeviceModel'),
    'UserModel': nodeRequire('./UserModel'),
    'ExtensionModel': nodeRequire('./ExtensionModel'),
    'SerialModel': nodeRequire('./SerialModel')
}
