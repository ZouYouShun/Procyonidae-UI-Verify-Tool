import './styles/screenshot-icons.scss';
import './styles/screenshot.component.scss';

import React, { PureComponent } from 'react';

import Arrow from './actions/arrow';
import Brush from './actions/brush';
import Cancel from './actions/cancel';
import Ellipse from './actions/ellipse';
import Mosaic from './actions/mosaic';
import Ok from './actions/ok';
import Rect from './actions/rect';
import Save from './actions/save';
import Text from './actions/text';
import Undo from './actions/undo';
import ScreenshotCanvas from './screenshot-canvas.component';
import ScreenshotMagnifier from './screenshot-magnifier.component';
import ScreenshotViewer from './screenshot-viewer.component';
import ScreenshotContext, { ScreenshotContextType } from './screenshot.context';

interface ScreenshotProps {
  className?: string;
  image: string;
  width?: number;
  height?: number;
}

export default class Screenshot extends PureComponent<ScreenshotProps> {
  bodyRef: React.RefObject<HTMLDivElement>;

  state: ScreenshotContextType = {
    image: undefined,
    viewer: undefined,
    action: undefined,
    actions: [
      {
        key: Ellipse,
        value: {},
      },
      {
        key: Rect,
        value: {},
      },
      {
        key: Arrow,
        value: {},
      },
      {
        key: Brush,
        value: {},
      },
      {
        key: Mosaic,
        value: {},
      },
      {
        key: Text,
        value: {},
      },
      { type: 'divider' },
      {
        key: Undo,
        value: {},
      },
      {
        key: Save,
        value: {},
      },
      { type: 'divider' },
      {
        key: Cancel,
        value: {},
      },
      {
        key: Ok,
        value: {},
      },
    ],
    stack: [],
    border: 6,
    font: 23,
    color: '#ee5126',
    cursor: undefined,
    magnifyPoint: undefined,
    editPointers: [],
  } as ScreenshotContextType;

  constructor(props: ScreenshotProps) {
    super(props);
    this.bodyRef = React.createRef();
  }

  componentDidMount() {
    this.getImage().then((image) => {
      this.setState({ image });
    });

    const $image = new Image();

    // $image.onload = () => {
    //   this.setState({
    //     image: {
    //       el: $image,
    //       width: this.props.width,
    //       height: this.props.height,
    //     },
    //   });
    // };

    // $image.src = this.props.image;

    // this.setState({
    //   image: {
    //     el: $image,
    //     width: this.props.width,
    //     height: this.props.height,
    //   },
    // });

    // Promise.resolve({
    //   el: $image,
    //   width: this.props.width,
    //   height: this.props.height,
    // }).then((image) => {
    //   this.setState({ image });
    // });

    // setTimeout(() => {
    //   this.setState({
    //     image: {
    //       el: $image,
    //       width: this.props.width,
    //       height: this.props.height,
    //     },
    //   });
    // }, 1000);
  }

  // 某些 context 不能變更
  setContext = (
    context:
      | ScreenshotContextType
      | ((...args: any[]) => ScreenshotContextType),
    callback?: () => void,
  ): void => {
    if (typeof context === 'object') {
      context = { ...context };
      delete context.image;
      delete context.width;
      delete context.height;
      this.setState(context, callback);
    } else if (typeof context === 'function') {
      this.setState((...args) => {
        const state = { ...(context as any)(...args) };
        delete state.image;
        delete state.width;
        delete state.height;
        return state;
      }, callback);
    }
  };

  onEmit = (
    event: string,
    data: {
      dataURL: string;
      viewer: {
        resizing: boolean;
        x1: number;
        x2: number;
        y1: number;
        y2: number;
      };
    },
  ) => {
    console.log('onEmit :>> ', { event, data });

    // if (!this.props.hasOwnProperty(event)) {
    //   return;
    // }

    // const fn = (this.props as Record<string, any>)[event];
    // if (typeof fn === 'function') fn(...args);
  };

  getImage(): Promise<ScreenshotContextType['image']> {
    const { image } = this.props;
    return new Promise((resolve, reject) => {
      if (!image) {
        return resolve({
          el: undefined,
          width: 0,
          height: 0,
        });
      }

      const $image = new Image();

      $image.onload = () => {
        resolve({
          el: $image,
          width: $image.width,
          height: $image.height,
        });
      };

      $image.onerror = (err) => {
        resolve({
          el: undefined,
          width: 0,
          height: 0,
        });
      };

      $image.src = image;
    });
  }

  onCanvasChange = ({
    x1,
    y1,
    x2,
    y2,
  }: NonNullable<ScreenshotContextType['viewer']>) => {
    const { left, top } = this.bodyRef.current!.getBoundingClientRect();

    x1 = x1 - left;
    y1 = y1 - top;
    x2 = x2 - left;
    y2 = y2 - top;
    this.setViewer({ x1, y1, x2, y2 });
  };

  onMagnifyChange = (pointer?: { x: number; y: number }) => {
    if (pointer) {
      const { left, top, width, height } =
        this.bodyRef.current!.getBoundingClientRect();
      const { x, y } = pointer;
      if (x >= left && x <= left + width && y >= top && y <= top + height) {
        this.setState({
          magnifyPoint: {
            x: x - left,
            y: y - top,
            right: left + width,
            bottom: top + height,
          },
        });
      }
    } else {
      this.setState({
        magnifyPoint: undefined,
      });
    }
  };

  onViewerChange = ({
    x1,
    y1,
    x2,
    y2,
  }: NonNullable<ScreenshotContextType['viewer']>) => {
    this.setViewer({ x1, y1, x2, y2 });
  };

  setViewer = ({
    x1,
    y1,
    x2,
    y2,
  }: NonNullable<ScreenshotContextType['viewer']>) => {
    const { width, height } = this.props;
    const { viewer } = this.state as { viewer: any };
    const x = x1;
    const y = y1;

    // 交換值
    if (x1 > x2) {
      x1 = x2;
      x2 = x;
    }

    if (y1 > y2) {
      y1 = y2;
      y2 = y;
    }

    // 把圖形限制在元素裡面
    if (x1 < 0) {
      x1 = 0;
      x2 = viewer.x2;
    }

    if (x2 > width!) {
      x2 = width!;
      x1 = viewer.x1;
    }

    if (y1 < 0) {
      y1 = 0;
      y2 = viewer.y2;
    }

    if (y2 > height!) {
      y2 = height!;
      y1 = viewer.y1;
    }

    this.setState((state: ScreenshotContextType) => ({
      viewer: { ...state.viewer, x1, y1, x2, y2 },
    }));
  };

  render() {
    const classNames = ['screenshot'];
    const {
      image,
      viewer,
      action,
      actions,
      stack,
      border,
      font,
      color,
      cursor,
      magnifyPoint,
      editPointers,
    } = this.state;
    const { className, width, height } = this.props;
    if (className) classNames.push(className);

    console.log('this.state :>> ', this.state);

    return (
      <ScreenshotContext.Provider
        value={{
          image,
          viewer,
          width,
          height,
          action,
          actions,
          stack,
          border,
          font,
          color,
          cursor,
          magnifyPoint,
          editPointers,
          setContext: this.setContext,
        }}
      >
        <div
          className={classNames.join(' ')}
          ref={this.bodyRef}
          style={{ width, height }}
        >
          <ScreenshotContext.Consumer>
            {(context) => (
              <ScreenshotCanvas
                {...context}
                onChange={this.onCanvasChange}
                onMagnifyChange={this.onMagnifyChange}
              />
            )}
          </ScreenshotContext.Consumer>

          {viewer?.resizing && magnifyPoint && (
            <ScreenshotContext.Consumer>
              {(context) => {
                console.log('context :>> ', context);
                return <ScreenshotMagnifier {...context} />;
              }}
            </ScreenshotContext.Consumer>
          )}

          <ScreenshotContext.Consumer>
            {(context) => (
              <ScreenshotViewer
                {...context}
                onChange={this.onViewerChange}
                onEmit={this.onEmit}
              />
            )}
          </ScreenshotContext.Consumer>
        </div>
      </ScreenshotContext.Provider>
    );
  }
}
