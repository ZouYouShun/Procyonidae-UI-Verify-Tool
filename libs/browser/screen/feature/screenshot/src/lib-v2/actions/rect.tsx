import React from 'react';

import SizeColor from '../common/screenshot-size-color.component';
import Action from './action';

export default class Rect extends Action {
  static title = '矩形';

  static type = 'rect';

  static icon = 'screenshot-icon-rect';

  rect: any = null;
  isNew = false;
  isEdit = false;
  todo: any = null;

  inStroke = {
    is: false,
    index: -1,
  };

  drag: any = {
    isDown: false,
    point: null,
  };

  resize = {
    isDown: false,
    name: '',
  };

  get EditPointersResize(): any {
    return {
      'top-center': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1, y1: y, x2, y2 }),
      'top-left': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1: x, y1: y, x2, y2 }),
      'top-right': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1, y1: y, x2: x, y2 }),
      'center-left': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1: x, y1, x2, y2 }),
      'center-right': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1, y1, x2: x, y2 }),
      'bottom-left': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1: x, y1, x2, y2: y }),
      'bottom-center': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1, y1, x2, y2: y }),
      'bottom-right': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ) => ({ x1, y1, x2: x, y2: y }),
    };
  }

  get EditPointersFlip(): any {
    return {
      'top-left': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ): any => {
        if (x >= x2 && y >= y2)
          return { name: 'bottom-right', cursor: 'nwse-resize' };
        if (x >= x2) return { name: 'top-right', cursor: 'nesw-resize' };
        if (y >= y2) return { name: 'bottom-left', cursor: 'nesw-resize' };
      },
      'top-right': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ): any => {
        if (x <= x1 && y >= y2)
          return { name: 'bottom-left', cursor: 'nesw-resize' };
        if (x <= x1) return { name: 'top-left', cursor: 'nwse-resize' };
        if (y >= y2) return { name: 'bottom-right', cursor: 'nwse-resize' };
      },
      'bottom-left': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ): any => {
        if (x >= x2 && y <= y1)
          return { name: 'top-right', cursor: 'nesw-resize' };
        if (x >= x2) return { name: 'bottom-right', cursor: 'nwse-resize' };
        if (y <= y1) return { name: 'top-left', cursor: 'nwse-resize' };
      },
      'bottom-right': (
        x: number,
        y: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number,
      ): any => {
        if (x <= x1 && y <= y1)
          return { name: 'top-left', cursor: 'nwse-resize' };
        if (x <= x1) return { name: 'bottom-left', cursor: 'nesw-resize' };
        if (y <= y1) return { name: 'top-right', cursor: 'nesw-resize' };
      },
    };
  }

  constructor(props: any) {
    super(props);
    props.setContext({ cursor: 'crosshair' });
  }

  beforeUnMount() {
    this.props.setContext({ editPointers: [] });
  }

  mousedown = (e: any, { el, ctx, context, setContext }: any) => {
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
      this.rect = {
        type: 'rect',
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
      this.rect = context.stack[this.inStroke.index];
      this.setEditPointers(this.rect.history[0]);
      this.onSizeChange(this.rect.history[0].size);
      this.onColorChange(this.rect.history[0].color);

      const record = {
        ...this.rect.history[0],
        path: new Path2D(),
        ready: true,
      };
      this.rect.history.unshift(record);

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
    e: any,
    { el, ctx, context, setContext }: any,
    pointInStroke: any,
  ) => {
    const { left, top, width, height } = el.getBoundingClientRect();
    let x = e.clientX - left;
    let y = e.clientY - top;

    if (this.isNew) {
      if (this.rect.ready) {
        delete this.rect.ready;
        this.rect.history[0].undoPriority = this.setUndoPriority(context);
        context.stack.push(this.rect);
      }

      if (x < 0) x = 0;
      if (y < 0) y = 0;
      if (x > width) x = width;
      if (y > height) y = height;
      const recent = this.rect.history[0];
      recent.x2 = x;
      recent.y2 = y;
      setContext({ stack: [...context.stack] });
    } else {
      const { action, index } = pointInStroke;

      if (this.drag.isDown) {
        // 拖曳畫圖
        const last = this.rect.history[1];
        const now = this.rect.history[0];
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
        const now = this.rect.history[0];
        delete now.ready; // 使用紀錄
        const flip = this.EditPointersFlip[this.resize.name];
        const resize = this.EditPointersResize[this.resize.name];
        if (flip) {
          const newPoint = flip(x, y, now.x1, now.y1, now.x2, now.y2);
          if (newPoint) {
            const { name, cursor } = newPoint;
            this.resize.name = name;
            setContext({ cursor });
          }
        }
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

  mouseup = (e: any, { el, ctx, context, setContext }: any) => {
    if (this.isNew) {
      // 初次繪製取消
      this.rect = null;
      this.isNew = false;
    } else {
      // 路徑操作的取消
      if (this.todo) {
        if (this.rect.history[0].ready) {
          this.rect.history.shift();
        }
        this.rect.history[0].undoPriority = this.setUndoPriority(context);

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
    let { size, color, x1, x2, y1, y2 } = action;
    ctx.lineCap = 'butt';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.strokeStyle = color;
    if (x1 > x2) {
      const x = x1;
      x1 = x2;
      x2 = x;
    }
    if (y1 > y2) {
      const y = y1;
      y1 = y2;
      y2 = y;
    }
    const path = new Path2D();
    path.rect(x1, y1, x2 - x1, y2 - y1);
    ctx.stroke(path);
    action.path = path;
  }

  setEditPointers = (record: any = undefined) => {
    let editPointers: any[] = [];
    if (record) {
      let { size, color, x1, x2, y1, y2 } = record;
      size = size === 3 ? 6 : size;
      editPointers = [
        {
          name: 'top-center',
          x: (x1 + x2) / 2,
          y: y1,
          cursor: 'ns-resize',
          size,
          color,
        },
        {
          name: 'top-left',
          x: x1,
          y: y1,
          cursor: 'nwse-resize',
          size,
          color,
        },
        {
          name: 'top-right',
          x: x2,
          y: y1,
          cursor: 'nesw-resize',
          size,
          color,
        },
        {
          name: 'center-left',
          x: x1,
          y: (y1 + y2) / 2,
          cursor: 'ew-resize',
          size,
          color,
        },
        {
          name: 'center-right',
          x: x2,
          y: (y1 + y2) / 2,
          cursor: 'ew-resize',
          size,
          color,
        },
        {
          name: 'bottom-left',
          x: x1,
          y: y2,
          cursor: 'nesw-resize',
          size,
          color,
        },
        {
          name: 'bottom-center',
          x: (x1 + x2) / 2,
          y: y2,
          cursor: 'ns-resize',
          size,
          color,
        },
        {
          name: 'bottom-right',
          x: x2,
          y: y2,
          cursor: 'nwse-resize',
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
      if (this.rect.history[0][type] === value) return;
      const { context } = this.props;
      const record = {
        ...this.rect.history[0],
        path: new Path2D(),
        undoPriority: this.setUndoPriority(context),
      };
      record[type] = value;
      this.rect.history.unshift(record);
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
