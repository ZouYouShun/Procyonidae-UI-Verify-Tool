import Action from './action';

export default class Cancel extends Action {
  static title = '取消';

  static icon = 'screenshot-icon-cancel';

  constructor(props: any) {
    super(props);
    const { setContext } = props;
    this.emit('onCancel', null);
    setContext({
      viewer: null,
      action: null,
      stack: [],
      state: {},
      cursor: null,
      editPointers: [],
    });
  }
}
