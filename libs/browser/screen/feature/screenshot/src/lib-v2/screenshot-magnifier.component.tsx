import React, { PureComponent } from 'react';

import { ScreenshotContextType } from './screenshot.context';

export default class ScreenshotMagnifier extends PureComponent<ScreenshotContextType> {
  state = {
    width: 120,
    height: 90,
    rgb: '',
  };

  explain = {
    width: 120,
    height: 40,
  };

  ctx!: CanvasRenderingContext2D;

  magnifyRate = 3;
  magnifierRef: React.RefObject<any>;

  constructor(props: any) {
    super(props);
    this.magnifierRef = React.createRef();
  }

  componentDidMount() {
    this.ctx = this.magnifierRef.current.getContext('2d');
    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  draw = () => {
    const { image, viewer, magnifyPoint, width, height } = this.props;
    const { x, y } = magnifyPoint || { x: 0, y: 0 };

    if (!image || x < 0 || y < 0 || viewer!?.resizing) return;
    const magnifyX = (image.width * x) / Number(width);
    const magnifyY = (image.height * y) / Number(height);
    const magnifyW = this.state.width;
    const magnifyH = this.state.height;
    const colorData = this.ctx.getImageData(
      magnifyW / 2,
      magnifyH / 2,
      1,
      1,
    ).data;
    this.setState({
      rgb: `(${colorData[0]},${colorData[1]},${colorData[2]})`,
    });

    this.ctx.clearRect(0, 0, magnifyW, magnifyH);
    this.ctx.drawImage(
      image.el!,
      magnifyX - magnifyW / this.magnifyRate / 2,
      magnifyY - magnifyH / this.magnifyRate / 2,
      magnifyW / this.magnifyRate,
      magnifyH / this.magnifyRate,
      0,
      0,
      magnifyW,
      magnifyH,
    );

    // const { width: stateWidth, height: stateHeight } = this.state
    // this.ctx.lineWidth = 1
    // this.ctx.strokeStyle = '#0a72a1'
    // this.ctx.moveTo(stateWidth / 2, 0)
    // this.ctx.lineTo(stateWidth / 2, stateHeight)
    // this.ctx.moveTo(0, stateHeight / 2)
    // this.ctx.lineTo(stateWidth, stateHeight / 2)
    // this.ctx.stroke()
  };

  render() {
    const { width, height, rgb } = this.state;
    const { x, y, right, bottom } = this.props.magnifyPoint || {
      x: 0,
      y: 0,
      right: 0,
      bottom: 0,
    };
    const bias = 5;
    const left = x + width + bias >= right ? x - width - bias : x + bias;
    const top =
      y + height + this.explain.height + bias >= bottom
        ? y - height - this.explain.height - bias
        : y + bias;
    return (
      <div
        className="screenshot-magnifier"
        style={{
          transform: `translate(${left}px, ${top}px)`,
        }}
      >
        <div className="screenshot-magnifier-canvas">
          <canvas ref={this.magnifierRef} width={width} height={height} />
          <div className="screenshot-magnifier-canvas-crosshair" />
        </div>
        <div className="screenshot-magnifier-explain">
          <div className="screenshot-magnifier-explain-rgb">RGB：{rgb}</div>
          <div className="screenshot-magnifier-explain-site">
            座標：({x},{y})
          </div>
        </div>
      </div>
    );
  }
}
