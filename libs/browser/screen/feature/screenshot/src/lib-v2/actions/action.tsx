import {
  ActionType,
  EmitDataMapByType,
  IAction,
  IActionProps,
  IHistory,
} from '../interfaces';
import { ScreenshotContextType } from '../screenshot.context';

export default class Action implements IAction {
  props: IActionProps;

  constructor(props: IActionProps) {
    this.props = props;
  }

  beforeUnMount(): void {}

  mousedown = (e: MouseEvent, actionProps: IActionProps) => {};

  mousemove = (
    e: MouseEvent,
    actionProps: IActionProps,
    handlePointInRecord: (
      e: MouseEvent | React.MouseEvent<Element, MouseEvent>,
    ) => {
      action?: IHistory | undefined;
      index: number;
      type: ActionType;
    },
  ) => {};

  mouseup = (e: MouseEvent, actionProps: IActionProps) => {};

  render(): JSX.Element {
    return <></>;
  }

  setUndoPriority(context: Pick<ScreenshotContextType, 'stack'>): number {
    return (
      Math.max.apply(null, [
        ...context.stack!.map((t) => t.history[0].undoPriority),
        0,
      ]) + 1
    );
  }

  emit<
    EmitType extends keyof EmitDataMapByType,
    EmitData extends EmitDataMapByType[EmitType],
  >(type: EmitType, data: EmitData): void {
    this.props.emit!(type, data);
  }
}
