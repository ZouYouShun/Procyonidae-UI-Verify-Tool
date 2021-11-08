import Action from './action';

export default class Ok extends Action {
  static title = '確定';

  static icon = 'screenshot-icon-ok';

  constructor(props: any) {
    super(props);
    const { el, setContext, context } = props;
    this.emit('onOk', {
      viewer: { ...context.viewer },
      dataURL: el.toDataURL('image/png'),
    });
    setContext({
      viewer: null,
      action: null,
      stack: [],
      state: {},
      cursor: null,
    });
  }
}
