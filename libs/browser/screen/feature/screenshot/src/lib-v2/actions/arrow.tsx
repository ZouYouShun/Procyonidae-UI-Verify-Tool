import React from 'react';

import SizeColor from '../common/screenshot-size-color.component';
import Action from './action';

export default class Arrow extends Action {
  static title = '箭頭';

  static type = 'arrow';

  static icon = 'screenshot-icon-arrow';

  arrow: any = null;
  isNew = false;
  isEdit = false;
  todo: any = null;

  inStroke: any = {
    is: false,
    index: -1,
  };

  drag: any = {
    isDown: false,
    point: null,
  };

  resize: any = {
    isDown: false,
    name: '',
  };

  get EditPointersResize(): any {
    return {
      start: (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1: x, y1: y, x2, y2 }),
      end: (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1, y1, x2: x, y2: y }),
    };
  }

  constructor(props: any) {
    super(props);
    props.setContext({ cursor: 'crosshair' });
  }

  beforeUnMount() {
    this.props.setContext({ editPointers: [] });
  }

  mousedown = (e: MouseEvent, { el, ctx, context, setContext }: any) => {
    const { left, top } = el.getBoundingClientRect();
    const { border, color } = context;
    const x = e.clientX - left;
    const y = e.clientY - top;

    if (!this.inStroke.is) {
      if (this.isEdit) {
        this.isEdit = false;
        this.setEditPointers();
      }

      this.isNew = true;
      this.arrow = {
        type: 'arrow',
        history: [
          {
            size: border,
            color,
            x1: x,
            y1: y,
            x2: x,
            y2: y,
            path: new Path2D(),
          },
        ],
        draw: this.draw,
        ready: true,
      };
    } else {
      this.isEdit = true;
      this.arrow = context.stack[this.inStroke.index];
      this.setEditPointers(this.arrow.history[0]);
      this.onSizeChange(this.arrow.history[0].size);
      this.onColorChange(this.arrow.history[0].color);

      const record = {
        ...this.arrow.history[0],
        path: new Path2D(),
        ready: true,
      };
      this.arrow.history.unshift(record);

      // resize準備
      if (this.todo === 'resize') {
        this.resize.isDown = true;
      }

      // 拖曳準備
      if (this.todo === 'drag') {
        setContext({ cursor: 'grabbing' });
        this.drag.isDown = true;
        this.drag.point = { x, y };
      }
    }
  };

  mousemove = (
    e: MouseEvent,
    { el, ctx, context, setContext }: any,
    pointInStroke: any,
  ) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;

    if (this.isNew) {
      // 开始move以后再推进栈
      if (this.arrow.ready) {
        delete this.arrow.ready;
        this.arrow.history[0].undoPriority = this.setUndoPriority(context);
        context.stack.push(this.arrow);
      }

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > width) x = width;
      if (y > height) y = height;
      const recent = this.arrow.history[0];
      recent.x2 = x;
      recent.y2 = y;
      setContext({ stack: [...context.stack] });
    } else {
      const { action, index } = pointInStroke;

      if (this.drag.isDown) {
        // 拖曳畫圖
        const last = this.arrow.history[1];
        const now = this.arrow.history[0];
        delete now.ready; // 使用紀錄
        const translateX = x - this.drag.point.x;
        const translateY = y - this.drag.point.y;
        now.x1 = last.x1 + translateX;
        now.y1 = last.y1 + translateY;
        now.x2 = last.x2 + translateX;
        now.y2 = last.y2 + translateY;
        this.setEditPointers(now);
        return;
      }

      if (this.resize.isDown) {
        // resize畫圖
        const now = this.arrow.history[0];
        delete now.ready; // 使用紀錄
        const resize = this.EditPointersResize[this.resize.name];
        const { x1, y1, x2, y2 } = resize(x, y, now.x1, now.y1, now.x2, now.y2);
        now.x1 = x1;
        now.y1 = y1;
        now.x2 = x2;
        now.y2 = y2;
        this.setEditPointers(now);
        return;
      }

      if (action) {
        // 鼠標觸摸路徑
        this.inStroke.is = true;
        this.inStroke.index = index;
        // 赋值todo
        if (this.isEdit) {
          // 找编輯點
          const hit = context.editPointers.find((t: any) => {
            const assertX = x >= t.x - t.size && x <= t.x + t.size;
            const assertY = y >= t.y - t.size && y <= t.y + t.size;
            return assertX && assertY;
          });
          if (hit) {
            this.todo = 'resize';
            setContext({ cursor: hit.cursor });
            this.resize.name = hit.name;
            return;
          }
        }
        this.todo = 'drag';
        setContext({ cursor: 'grab' });
      } else {
        this.inStroke.is = false;
        this.todo = null;
        setContext({ cursor: 'crosshair' });
      }
    }
  };

  mouseup = (e: MouseEvent, { el, ctx, context, setContext }: any) => {
    if (this.isNew) {
      // 初次繪製取消
      this.arrow = null;
      this.isNew = false;
    } else {
      // 路徑操作的取消
      if (this.todo) {
        if (this.arrow.history[0].ready) {
          this.arrow.history.shift();
        }
        this.arrow.history[0].undoPriority = this.setUndoPriority(context);

        if (this.resize.isDown) {
          this.resize.isDown = false;
        }

        if (this.drag.isDown) {
          this.drag.isDown = false;
          setContext({ cursor: 'grab' });
        }
      }
    }
  };

  draw(ctx: CanvasRenderingContext2D, action: any) {
    const { size, color, x1, x2, y1, y2 } = action;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    const path = new Path2D();
    const dx = x2 - x1;
    const dy = y2 - y1;

    // 等边三角形边和高
    const hypotenuse = Math.sqrt(dx * dx + dy * dy);
    const side = hypotenuse > size * 10 ? size * 3 : hypotenuse / 3.5; // 缩放
    const height = (side / 2) * Math.sqrt(3);
    const arcCenter = {
      x:
        x2 +
        Math.sqrt((height * height * dx * dx) / (dx * dx + dy * dy)) *
          (x2 > x1 ? -1 : 1),
      y:
        y2 +
        Math.sqrt((height * height * dy * dy) / (dx * dx + dy * dy)) *
          (y2 > y1 ? -1 : 1),
    };
    // const arcRadius = Math.sqrt(side / 2)
    const arcRadius = side / 4;
    const angle = Math.atan2(dy, dx);
    const PVAngle = angle + Math.PI / 2;

    path.arc(x1, y1, size / 4, PVAngle, PVAngle + Math.PI);
    path.arc(arcCenter.x, arcCenter.y, arcRadius, PVAngle + Math.PI, PVAngle);
    ctx.fill(path);

    path.moveTo(x2, y2);
    path.lineTo(
      x2 - side * Math.cos(angle + Math.PI / 6),
      y2 - side * Math.sin(angle + Math.PI / 6),
    );
    path.lineTo(
      x2 - side * Math.cos(angle - Math.PI / 6),
      y2 - side * Math.sin(angle - Math.PI / 6),
    );
    path.closePath();
    ctx.lineWidth = 1;
    ctx.stroke(path);
    ctx.fill(path);

    action.path = path;
  }

  setEditPointers = (record: any = undefined) => {
    let editPointers: any[] = [];
    if (record) {
      let { size, color, x1, x2, y1, y2 } = record;
      size = size === 3 ? 6 : size;
      editPointers = [
        {
          name: 'start',
          x: x1,
          y: y1,
          cursor: 'nesw-resize',
          size,
          color,
        },
        {
          name: 'end',
          x: x2,
          y: y2,
          cursor: 'nesw-resize',
          size,
          color,
        },
      ];
    }
    this.props.setContext({ editPointers });
  };

  onSizeChange = (size: number) => {
    this.props.setContext({
      border: size,
    });
    this.props.context.border = size;
    this.sizeColorEdit('size', size);
  };

  onColorChange = (color: string) => {
    this.props.setContext({
      color,
    });
    this.props.context.color = color;
    this.sizeColorEdit('color', color);
  };

  sizeColorEdit = (type: string, value: any) => {
    if (this.isEdit) {
      if (this.arrow.history[0][type] === value) return;
      const { context } = this.props;
      const record = {
        ...this.arrow.history[0],
        path: new Path2D(),
        undoPriority: this.setUndoPriority(context),
      };
      record[type] = value;
      this.arrow.history.unshift(record);
      this.setEditPointers(record);
    }
  };

  render() {
    const { border, color } = this.props.context;
    return (
      <SizeColor
        size={border!}
        color={color!}
        onSizeChange={this.onSizeChange}
        onColorChange={this.onColorChange}
      />
    );
  }
}
