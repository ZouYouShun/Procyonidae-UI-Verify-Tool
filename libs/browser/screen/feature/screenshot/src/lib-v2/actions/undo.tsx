export default class Undo {
  static title = '復原';

  static type = 'undo';

  static icon = 'screenshot-icon-undo';

  constructor({ el, ctx, context, setContext }: any) {
    const findPriority = (stack: any[]) => {
      let index = -1;
      const priority = stack.reduce(
        (p, c, i) => {
          if (
            !c.history.length ||
            p.history[0].undoPriority > c.history[0].undoPriority
          ) {
            return p;
          } else {
            index = i;
            return c;
          }
        },
        { history: [{ undoPriority: -1 }] },
      );
      return { priority, index };
    };
    let { action, stack } = context;
    const { priority, index } = findPriority(stack);
    if (priority.history[0].undoPriority >= 0) {
      priority.history.shift();

      if (priority.undoCB) {
        priority.undoCB(priority, action);
      }

      if (!priority.history.length) {
        stack.splice(index, 1);
        if (!stack.length && !action.$textarea) {
          action = null;
          setContext({ cursor: 'grab' });
        }
      }
    }
    setContext({ editPointers: [] });
    if (action) {
      action.props.context.stack = stack;
    }
    return action;
  }
}
