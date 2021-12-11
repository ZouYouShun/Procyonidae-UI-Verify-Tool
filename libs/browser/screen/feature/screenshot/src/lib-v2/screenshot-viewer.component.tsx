import React, { PureComponent } from 'react';

import dpr from '../../dpr';
import Cancel from './actions/cancel';
import Ok from './actions/ok';
import ScreenshotViewerBar from './screenshot-viewer-bar.component';
import ScreenshotViewerEditPoint from './screenshot-viewer-edit-point.component';
import ScreenshotContext, { ScreenshotContextType } from './screenshot.context';

export default class ScreenshotViewer extends PureComponent<
  ScreenshotContextType & {
    onChange: (data: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }) => void;
    onEmit: (event: string, ...args: any[]) => void;
  }
> {
  /**
   * 主要畫布
   */
  ctx!: CanvasRenderingContext2D;

  /**
   * move 和 resize 的標誌
   */
  actionType?: string;

  /**
   * 鼠標起始位置
   */
  point?: { x: number; y: number };

  /**
   * 保存初始的 Viewer 狀態
   */
  viewer?: ScreenshotContextType['viewer'];
  viewerRef!: React.RefObject<HTMLDivElement>;
  canvasRef!: React.RefObject<HTMLCanvasElement>;

  constructor(props: any) {
    super(props);
    this.viewerRef = React.createRef();
    this.canvasRef = React.createRef();
  }

  get size() {
    const { viewer } = this.props;
    if (!viewer) {
      return {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };
    } else {
      const { x1, y1, x2, y2 } = viewer;
      return {
        x: x1,
        y: y1,
        width: x2 - x1,
        height: y2 - y1,
      };
    }
  }

  get cursor() {
    if (this.props.cursor) {
      return this.props.cursor;
    }

    if (this.props.action) {
      return 'default';
    }

    return 'grab';
  }

  get pointers() {
    const pointers = [
      'top',
      'top-right',
      'right',
      'right-bottom',
      'bottom',
      'bottom-left',
      'left',
      'left-top',
    ];
    const { action } = this.props;
    return action ? [] : pointers;
  }

  get actionArgs() {
    const {
      image,
      viewer,
      width,
      height,
      stack,
      action,
      actions,
      border,
      font,
      color,
      cursor,
      editPointers,
    } = this.props;
    return {
      viewer: this.viewerRef.current,
      el: this.canvasRef.current,
      ctx: this.ctx,
      context: {
        image,
        viewer,
        width,
        height,
        stack,
        action,
        actions,
        border,
        font,
        color,
        cursor,
        editPointers,
      },
      setContext: this.props.setContext,
      emit: this.props.onEmit,
    };
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current!.getContext('2d')!;
    this.draw();
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mouseup', this.onMouseup);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    const { image, width, height, stack } = this.props;

    if (!image) return;

    const { x, y, width: w, height: h } = this.size;
    const rx = image.width / width!;
    const ry = image.height / height!;

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.ctx.clearRect(0, 0, w, h);

    if (image.el) {
      this.ctx.drawImage(image.el, x * rx, y * ry, w * rx, h * ry, 0, 0, w, h);
    }

    stack!.forEach((item) => item.draw(this.ctx, item.history[0], item)); // action draw
  };

  onMousedown = (e: React.MouseEvent, type: string) => {
    const { viewer, action, actions } = this.props;
    if (!viewer) return;
    if (!action) {
      if (!type || e.button !== 0) return;
      this.actionType = type;
      this.point = { x: e.clientX, y: e.clientY };
      this.viewer = { ...this.props.viewer! };
      if (this.actionType === 'move') {
        this.props.setContext!((state) => {
          return {
            viewer: { ...state.viewer, moving: true },
            cursor: 'grabbing',
          };
        });
      } else {
        this.props.setContext!((state) => ({
          viewer: { ...state.viewer, resizing: true },
        }));
      }
    } else {
      const current = this.handlePointInRecord(e);
      if (
        current.type &&
        current.type !== Object.getPrototypeOf(action).constructor.type
      ) {
        // 根據路徑更改 action
        const Action = actions!.find(
          (item) => item.key.type === current.type,
        )?.key;
        const nextAction = this.onAction(Action);

        // 模擬新 action 操作
        if (typeof nextAction.mousemove === 'function') {
          nextAction.mousemove(e, this.actionArgs, current);
        }
        if (typeof nextAction.mousedown === 'function') {
          nextAction.mousedown(e, this.actionArgs);
        }
      } else {
        if (typeof action.mousedown === 'function') {
          action.mousedown(e.nativeEvent, this.actionArgs);
        }
      }
    }
  };

  onMousemove = (e: MouseEvent) => {
    const { viewer, action } = this.props;
    if (!viewer) return;
    if (!action) {
      if (this.actionType === 'move') {
        this.move(e);
      } else if (this.actionType) {
        this.resize(e);
      }
    } else {
      if (typeof action.mousemove === 'function') {
        action.mousemove(e, this.actionArgs, this.handlePointInRecord(e));
      }
    }
  };

  onMouseup = (e: MouseEvent) => {
    const { viewer, action } = this.props;
    if (!viewer) return;
    if (!action) {
      if (this.actionType) {
        if (this.actionType === 'move') {
          this.props.setContext!({ cursor: undefined });
        }
        this.props.setContext!((state) => ({
          viewer: { ...state.viewer, resizing: false, moving: false },
        }));
        this.actionType = undefined;
        this.point = undefined;
        this.viewer = undefined;
      }
    } else {
      if (typeof action.mouseup === 'function') {
        action.mouseup(e, this.actionArgs);
      }
    }
  };

  onRightClick = (e: React.MouseEvent) => {
    const { actions } = this.props;
    if (
      e.target === e.currentTarget &&
      e.button === 2 &&
      actions!.some(({ key }) => key === Cancel)
    ) {
      e.preventDefault();
      this.onAction(Cancel);
    }
  };

  onDblClick = (e: React.MouseEvent) => {
    const { actions } = this.props;
    if (
      e.target === e.currentTarget &&
      e.button === 0 &&
      actions!.some(({ key }) => key === Ok)
    ) {
      this.onAction(Ok);
    }
  };

  handlePointInRecord = (e: React.MouseEvent | MouseEvent) => {
    const { left, top } = this.canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - left) * dpr;
    const y = (e.clientY - top) * dpr;

    let action = null;
    let type = '';
    let index = -1;

    this.props.stack!.some((t, i) => {
      const recent = t.history[0];

      if (['rect', 'ellipse', 'brush'].includes(t.type)) {
        if (this.ctx.isPointInStroke(recent.path, x, y)) {
          action = recent;
          type = t.type;
          index = i;
          return true;
        }
      }

      if (['arrow'].includes(t.type)) {
        if (
          this.ctx.isPointInStroke(recent.path, x, y) ||
          this.ctx.isPointInPath(recent.path, x, y)
        ) {
          action = recent;
          type = t.type;
          index = i;
          return true;
        }
      }

      if (t.type === 'text') {
        const textRect = recent.domClientRect;
        const textX = textRect.left - left;
        const textY = textRect.top - top;
        const assertX = x >= textX && x <= textX + textRect.width;
        const assertY = y >= textY && y <= textY + textRect.height;
        if (assertX && assertY) {
          action = recent;
          type = t.type;
          index = i;
          return true;
        }
      }

      return false;
    });

    return { action, index, type };
  };

  move = (e: MouseEvent) => {
    if (!this.viewer) return;
    const x = e.clientX - this.point!.x;
    const y = e.clientY - this.point!.y;
    const { x1, y1, x2, y2 } = this.viewer;
    this.props.onChange({
      x1: x1 + x,
      y1: y1 + y,
      x2: x2 + x,
      y2: y2 + y,
    });
  };

  resize = (e: MouseEvent) => {
    if (!this.viewer) return;
    const x = e.clientX - this.point!.x;
    const y = e.clientY - this.point!.y;
    let { x1, y1, x2, y2 } = this.viewer;
    switch (this.actionType) {
      case 'top':
        y1 += y;
        break;
      case 'top-right':
        x2 += x;
        y1 += y;
        break;
      case 'right':
        x2 += x;
        break;
      case 'right-bottom':
        x2 += x;
        y2 += y;
        break;
      case 'bottom':
        y2 += y;
        break;
      case 'bottom-left':
        x1 += x;
        y2 += y;
        break;
      case 'left':
        x1 += x;
        break;
      case 'left-top':
        x1 += x;
        y1 += y;
        break;
      default:
        return;
    }
    this.props.onChange({
      x1,
      y1,
      x2,
      y2,
    });
  };

  onAction = (Action: any) => {
    const lastAction = this.props.action;
    if (
      Action.type !== 'undo' && // 復原 action 不執行
      lastAction &&
      Action.prototype !== Object.getPrototypeOf(lastAction)
    ) {
      lastAction.beforeUnMount && lastAction.beforeUnMount();
    }
    const nextAction = new Action(this.actionArgs);
    const action = Object.keys(nextAction).length ? nextAction : null;
    this.props.setContext!({
      action,
    });
    return action;
  };

  render() {
    const { x, y, width, height } = this.size;
    const { viewer, action, editPointers } = this.props;
    return (
      <div
        className="screenshot-viewer"
        style={{
          display: viewer ? 'block' : 'none',
        }}
        onMouseUp={this.onRightClick}
        onDoubleClick={($event) => this.onDblClick($event)}
      >
        <div
          ref={this.viewerRef}
          className="screenshot-viewer-body"
          style={{
            left: x,
            top: y,
            width,
            height,
            overflow: action ? 'hidden' : 'inherit',
          }}
        >
          <canvas
            ref={this.canvasRef}
            width={width * dpr}
            height={height * dpr}
            style={{
              width,
              height,
            }}
          />
          <div
            className="screenshot-viewer-border"
            style={{
              cursor: this.cursor,
            }}
            onMouseDown={(e) => this.onMousedown(e, 'move')}
          />
          {this.pointers.map((pointer) => {
            return (
              <div
                key={pointer}
                className={`screenshot-viewer-pointer-${pointer}`}
                onMouseDown={(e) => this.onMousedown(e, pointer)}
              />
            );
          })}
          {action && <ScreenshotViewerEditPoint pointers={editPointers!} />}
        </div>
        <ScreenshotContext.Consumer>
          {(context) => (
            <ScreenshotViewerBar
              {...context}
              onAction={(x) => this.onAction(x)}
            />
          )}
        </ScreenshotContext.Consumer>
      </div>
    );
  }
}
