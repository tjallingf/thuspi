class Model {
    id;
    props;

    constructor(props) {
        this.props = props;
        this.id = props.id;

        return this;
    }

    getProps() {
        return this.props;
    }

    getProp(propName) {
        return this.getProps()[propName];
    }

    exists() {
        return (this.props != undefined)
    }
}

export default Model;