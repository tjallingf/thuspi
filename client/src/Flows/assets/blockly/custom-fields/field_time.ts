import * as Blockly from 'blockly/core';

export default class TimeField extends Blockly.FieldTextInput {
    onClickWrapper_: Blockly.browserEvents.Data;
    picker_: HTMLDivElement;

    constructor(value: string) {
        console.log({ value });
        super(value);

        this.SERIALIZABLE = true;
    }

    fromJson(options) {
        const value = Blockly.utils.parsing.replaceMessageReferences(options['value']);
        return new TimeField(value);
    }

    protected bindInputEvents_(htmlInput: HTMLElement): void {
        super.bindInputEvents_(htmlInput);

        this.onClickWrapper_ = Blockly.browserEvents.conditionalBind(
            this.getClickTarget_(),
            'click',
            this,
            this.onClick_,
        );
    }

    unbindInputEvents_() {
        super.unbindInputEvents_();
        if (this.onClickWrapper_) {
            Blockly.browserEvents.unbind(this.onClickWrapper_);
            this.onClickWrapper_ = null;
        }
    }

    onClick_(e) {
        console.log('click!');
        if (this.isTextValid_) {
            this.showDropdown_();
        }
    }

    showDropdown_() {
        this.picker_ = document.createElement('div');
        this.picker_.innerText = 'hallo wereld!';
        const div = Blockly.DropDownDiv.getContentDiv();
        div.appendChild(this.picker_);
    }
}

Blockly.fieldRegistry.register('field_time', TimeField);
