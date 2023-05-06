import FlowBlockManifestParameter, { FlowBlockManifestParameterData } from './FlowBlockManifestParameter';
import EventEmitter from 'events';

export interface FlowBlockManifestData {
    icon: string;
    allowChildren: boolean;
    tooltip: string;
    helpUrl: string;
    allowTopConnection: boolean;
    allowBottomConnection: boolean;
    warningKey: string;
    parameters: FlowBlockManifestParameter[];
    returns: {
        type: [string, ...any[]];
    };
}

export default class FlowBlockManifest extends EventEmitter {
    private data: FlowBlockManifestData = {
        icon: null,
        allowChildren: false,
        allowTopConnection: true,
        allowBottomConnection: true,
        tooltip: null,
        helpUrl: null,
        warningKey: null,
        parameters: [],
        returns: {
            type: [null, null],
        },
    };
    private _isClone: boolean = false;
    get isClone() {
        return this._isClone;
    }

    constructor(data?: FlowBlockManifestData, isClone: boolean = false) {
        super();
        this._isClone = isClone;
        if (data) {
            this.data = data;
        }
    }

    setIcon(icon: string) {
        this.data.icon = icon;
        return this;
    }
    setTooltip(tooltip: string) {
        this.data.tooltip = tooltip;
        return this;
    }
    setHelpUrl(helpUrl: string) {
        this.data.helpUrl = helpUrl;
        return this;
    }
    setAllowChildren(allow: boolean) {
        this.data.allowChildren = allow;
        return this;
    }
    setAllowTopConnection(allow: boolean) {
        this.data.allowTopConnection = allow;
        return this;
    }
    setAllowBottomConnection(allow: boolean) {
        this.data.allowBottomConnection = allow;
        return this;
    }
    setWarning(key: string) {
        this.data.warningKey = key;
        return this;
    }

    addParameter(name: string, type: FlowBlockManifestParameterData['type']) {
        const parameter = new FlowBlockManifestParameter(name, type);
        this.data.parameters.push(parameter);
        return parameter;
    }

    getParameter(name: string) {
        return this.data.parameters.find((p) => p.getName() === name);
    }

    getParameters() {
        return this.data.parameters;
    }

    toJSON() {
        return this.data;
    }
}
