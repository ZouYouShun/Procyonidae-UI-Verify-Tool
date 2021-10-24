import 'cropperjs/dist/cropper.css';

import { useContextBridge } from '@procyonidae/browser/shared/hooks';
import {
  palette2,
  px,
  radius,
  RcAvatar,
  RcIconButton,
  shadows,
  spacing,
  styled,
  useEventListener,
} from '@ringcentral/juno';
import { Check, Close } from '@ringcentral/juno/icon';
import React, { useEffect, useRef, useState } from 'react';
import { Cropper } from 'react-cropper';

import Tool, { strokeColors, tools } from './enums/Tool';
import { getMergeImage } from './getMergeImage';
import {
  scaleRate,
  setZoomViewPosition,
  translateXValue,
  translateYValue,
  zoomSize,
} from './setZoomViewPosition';
import { useCanvas } from './useDraw';

/* eslint-disable-next-line */
export interface BrowserScreenFeatureScreenshotProps {}

const StyledCropper = styled(Cropper)`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const ZoomView = styled.div<{ src: string }>`
  position: absolute;
  width: ${px(zoomSize)};
  height: ${px(zoomSize)};
  backface-visibility: hidden;
  background-image: url(${({ src }) => src});
  box-shadow: ${shadows('6')};
  pointer-events: none;
  transform-origin: 0 0;
  transform: translateX(-${translateXValue}%) translateY(${translateYValue}%)
    scale(${scaleRate});
`;

const DrawCanvas = styled.canvas`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;
  display: none;
`;

const Mask = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;

  > div {
    border: 1px solid ${palette2('success', 'f11')};
  }
`;

const ToolBox = styled.div`
  padding: ${spacing(0, 2)};
  position: absolute;
  background-color: ${palette2('neutral', 'elevation')};
  left: 0;
  top: 0;
  border-radius: ${radius('round')};
  transform: translateX(-100%) translateY(10px);
  box-shadow: ${shadows(8)};
  display: none;
`;

export function BrowserScreenFeatureScreenshot(
  props: BrowserScreenFeatureScreenshotProps,
) {
  const { screen } = useContextBridge();

  const cropperRef = useRef<HTMLImageElement & { cropper: Cropper }>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    currTool,
    setCurrTool,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    currStrokeColor,
    setCurrStrokeColor,
  } = useCanvas(canvasRef);

  const cropendRef = useRef(false);

  const [image, setImage] = useState('');

  // const getCurrCropperImage = () => {
  //   const cropper = cropperRef?.current?.cropper!;
  //   return cropper.getCroppedCanvas().toDataURL();
  // };

  const confirm = () => {
    // const image = getCurrCropperImage();
    const image = canvasRef.current!.toDataURL();
    screen.confirmCapture(image);
  };

  const cancel = () => {
    window.close();
  };

  const drawImageToCanvas = (boxData: Cropper.CropBoxData) => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d')!;

    const cropper = cropperRef?.current?.cropper!;
    cropper.zoomTo(1);

    const image = cropper.getCroppedCanvas();

    const imageWidth = boxData.width;
    const imageHeight = boxData.height;

    canvas.width = imageWidth;
    canvas.height = imageHeight;
    canvas.style.left = px(boxData.left);
    canvas.style.top = px(boxData.top);

    context.imageSmoothingEnabled = true;
    context.drawImage(image, 0, 0, imageWidth, imageHeight);
  };

  // TODO: fix type in juno, that has problem in ts 4.3.5
  // @ts-ignore
  useEventListener(window, 'keydown', (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter': {
        confirm();
        break;
      }
      case 'Escape':
        cancel();
        break;
      default:
        break;
    }
  });

  useEventListener(window, 'contextmenu', () => cancel());

  useEffect(() => {
    const destroy = screen.onReady(async (originalSources) => {
      const mergedImage = await getMergeImage(originalSources);

      if (mergedImage) setImage(mergedImage);
    });

    return () => destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Wrapper
        onMouseMove={(e) => {
          // when cropend not do anything
          if (!cropendRef.current) {
            setZoomViewPosition(zoomRef.current!, {
              left: e.pageX,
              top: e.pageY,
            });
          }
        }}
      >
        <StyledCropper
          src={image}
          viewMode={1}
          zoomable={false}
          minCropBoxHeight={5}
          minCropBoxWidth={5}
          background={false}
          autoCrop={false}
          checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
          ref={cropperRef as any}
          crop={(e: any) => {
            const detail = e.detail;

            setZoomViewPosition(zoomRef.current!, {
              left: detail.x + detail.width,
              top: detail.y + detail.height,
            });
          }}
          cropstart={() => {
            const toolbarElm = toolbarRef.current!;

            toolbarElm.style.display = 'none';
            canvasRef.current!.style.display = 'none';

            zoomRef.current!.style.display = 'block';

            cropendRef.current = false;
          }}
          cropend={(e) => {
            const toolbarElm = toolbarRef.current!;
            const cropper = cropperRef?.current?.cropper!;
            const boxData = cropper.getCropBoxData();

            toolbarElm.style.left = px(boxData.left + boxData.width);
            toolbarElm.style.top = px(boxData.top + boxData.height);

            toolbarElm.style.display = 'block';
            canvasRef.current!.style.display = 'block';

            zoomRef.current!.style.display = 'none';

            cropendRef.current = true;

            drawImageToCanvas(boxData);
          }}
          guides={true}
        />
        <ZoomView
          data-sign="zoom-view"
          ref={
            zoomRef as any
            // fix type issue in Juno
          }
          src={image}
        >
          <Mask>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </Mask>
        </ZoomView>
        <ToolBox ref={toolbarRef as any}>
          {currTool !== Tool.Select && (
            <>
              {strokeColors.map((color) => {
                const isCurr = currStrokeColor === color;
                return (
                  <RcIconButton
                    key={color}
                    color="neutral.f06"
                    variant={isCurr ? 'contained' : 'round'}
                    onClick={() => {
                      setCurrStrokeColor(color);
                    }}
                  >
                    <RcAvatar color={color} size="xxsmall" />
                  </RcIconButton>
                );
              })}
            </>
          )}
          {tools.map((tool) => {
            const isCurr = currTool === tool.type;

            return (
              <React.Fragment key={tool.label}>
                <RcIconButton
                  symbol={tool.icon}
                  variant={isCurr ? 'contained' : 'round'}
                  color="neutral.f06"
                  onClick={() => {
                    setCurrTool(tool.type);
                  }}
                />
              </React.Fragment>
            );
          })}
          <RcIconButton symbol={Close} color="danger.f02" onClick={cancel} />
          <RcIconButton symbol={Check} color="success.f11" onClick={confirm} />
        </ToolBox>
        <DrawCanvas
          ref={canvasRef as any}
          onMouseMove={onMouseMove}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
        />
      </Wrapper>
    </>
  );
}

export default BrowserScreenFeatureScreenshot;
