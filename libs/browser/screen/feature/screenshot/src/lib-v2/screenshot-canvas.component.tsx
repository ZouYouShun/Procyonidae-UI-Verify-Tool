import React, { PureComponent } from 'react';

import dpr from '../../dpr';
import { ScreenshotContextType } from './screenshot.context';

export default class ScreenshotCanvas extends PureComponent<
  ScreenshotContextType & {
    onChange?: (item: {
      x1: number;
      y1: number;
      x2: number;
      y2: number;
    }) => void;
    onMagnifyChange?: (item?: { x: number; y: number }) => void;
  }
> {
  ctx!: CanvasRenderingContext2D;

  is = false;

  point!: { x: number; y: number };

  canvasRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext('2d');
    this.draw();
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mouseup', this.onMouseup);
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
  }

  draw = () => {
    const { image, width, height } = this.props;
    if (!image) return;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    this.ctx.clearRect(0, 0, width!, height!);
    this.ctx.drawImage(
      image.el!,
      0,
      0,
      image.width,
      image.height,
      0,
      0,
      width!,
      height!,
    );
  };

  onMousedown = (e: React.MouseEvent) => {
    // 初始化 viewer
    const { viewer } = this.props;
    if (viewer || e.button !== 0) return; // e.button 鼠標左键
    this.props.setContext!({
      viewer: undefined,
      action: undefined,
      stack: [],
      state: {},
      cursor: undefined,
    });
    this.is = true;
    this.point = { x: e.clientX, y: e.clientY };
    this.props.setContext!((state) => ({
      viewer: { ...state.viewer, resizing: true },
    }));
    this.update(e);
  };

  onMousemove = (e: any) => {
    const { viewer } = this.props;
    if (!viewer || (viewer && viewer.resizing)) {
      this.props.onMagnifyChange!({
        x: e.clientX,
        y: e.clientY,
      });
    }
    if (!this.is) return;
    this.update(e);
  };

  onMouseup = (e: any) => {
    if (this.is) {
      this.update(e);
      this.is = false;
      this.props.setContext!((state) => ({
        viewer: { ...state.viewer, resizing: false },
      }));
      this.props.onMagnifyChange!(undefined);
    }
  };

  update = (e: any) => {
    const { x, y } = this.point;
    this.props.onChange!({
      x1: x,
      y1: y,
      x2: e.clientX,
      y2: e.clientY,
    });
  };

  render() {
    const { width, height } = this.props;
    return (
      <div className="screenshot-canvas" onMouseDown={this.onMousedown}>
        <canvas
          ref={this.canvasRef}
          width={width! * dpr}
          height={height! * dpr}
          style={{
            width,
            height,
          }}
        />
        <div className="screenshot-canvas-mask" />
      </div>
    );
  }
}
