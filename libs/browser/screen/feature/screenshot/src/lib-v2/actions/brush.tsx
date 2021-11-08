import React from 'react';

import SizeColor from '../common/screenshot-size-color.component';
import Action from './action';

export default class Brush extends Action {
  static title = '畫圖';

  static type = 'brush';

  static icon = 'screenshot-icon-brush';

  brush: any = null;
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

  constructor(props: any) {
    super(props);
    props.setContext({ cursor: 'crosshair' });
  }

  get EditPointersResize(): any {
    return {
      start: (x: number, y: number, point: any[]) => {
        point.unshift({ x, y });
        return point;
      },
      end: (x: number, y: number, point: any[]) => {
        point.push({ x, y });
        return point;
      },
    };
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
      this.brush = {
        type: 'brush',
        history: [
          {
            size: border,
            color,
            point: [{ x, y }],
            path: new Path2D(),
          },
        ],
        draw: this.draw,
        ready: true,
      };
    } else {
      this.isEdit = true;
      this.brush = context.stack[this.inStroke.index];
      this.setEditPointers(this.brush.history[0]);
      this.onSizeChange(this.brush.history[0].size);
      this.onColorChange(this.brush.history[0].color);

      const record = {
        ...this.brush.history[0],
        point: [...this.brush.history[0].point],
        path: new Path2D(),
        ready: true,
      };
      this.brush.history.unshift(record);

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
      if (this.brush.ready) {
        delete this.brush.ready;
        this.brush.history[0].undoPriority = this.setUndoPriority(context);
        context.stack.push(this.brush);
      }

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > width) x = width;
      if (y > height) y = height;
      const recent = this.brush.history[0];
      recent.point.push({ x, y });
      setContext({ stack: [...context.stack] });
    } else {
      const { action, index } = pointInStroke;

      if (this.drag.isDown) {
        // 拖曳畫圖
        const last = this.brush.history[1];
        const now = this.brush.history[0];
        delete now.ready; // 使用紀錄
        const translateX = x - this.drag.point.x;
        const translateY = y - this.drag.point.y;
        now.point = last.point.map((t: any) => ({
          x: t.x + translateX,
          y: t.y + translateY,
        }));
        this.setEditPointers(now);
        return;
      }

      if (this.resize.isDown) {
        // resize畫圖
        const now = this.brush.history[0];
        delete now.ready; // 使用紀錄
        const resize = this.EditPointersResize[this.resize.name];
        const point = resize(x, y, now.point);
        now.point = point;
        this.setEditPointers(now);
        return;
      }

      if (action) {
        // 鼠標觸摸路徑
        this.inStroke.is = true;
        this.inStroke.index = index;

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
      this.brush = null;
      this.isNew = false;
    } else {
      // 路徑操作的取消
      if (this.todo) {
        if (this.brush.history[0].ready) {
          this.brush.history.shift();
        }
        this.brush.history[0].undoPriority = this.setUndoPriority(context);

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
    const { size, color, point } = action;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    const path = new Path2D();
    point.forEach((it: any, index: number) => {
      if (index === 0) {
        path.moveTo(it.x, it.y);
      } else {
        path.lineTo(it.x, it.y);
      }
    });
    ctx.stroke(path);
    action.path = path;
  }

  setEditPointers = (record: any = undefined) => {
    let editPointers: any[] = [];
    if (record) {
      let { size, color, point } = record;
      size = size === 3 ? 6 : size;
      editPointers = [
        {
          name: 'start',
          x: point[0].x,
          y: point[0].y,
          cursor: 'nesw-resize',
          size,
          color,
        },
        {
          name: 'end',
          x: point[point.length - 1].x,
          y: point[point.length - 1].y,
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

  sizeColorEdit = (type: any, value: any) => {
    if (this.isEdit) {
      if (this.brush.history[0][type] === value) return;
      const { context } = this.props;
      const record = {
        ...this.brush.history[0],
        path: new Path2D(),
        undoPriority: this.setUndoPriority(context),
      };
      record[type] = value;
      this.brush.history.unshift(record);
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
