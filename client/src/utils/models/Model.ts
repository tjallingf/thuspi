export interface IModelProps {
  id: number;
  [key: string]: any;
}

export default class Model {
  id: number;
  props: IModelProps;

  constructor(props: IModelProps) {
    this.props = props;
    this.id = props.id;

    return this;
  }

  getProps(): IModelProps {
    return this.props;
  }

  getProp(key: string): any {
    return this.getProps()[key];
  }

  exists() {
    return this.props != undefined;
  }
}
