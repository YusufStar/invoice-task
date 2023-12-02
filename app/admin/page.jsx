'use client'
import React, {useEffect, useState} from 'react';
import useCanvasDrawing from "@/hooks/canvas";
import {Input, NextUIProvider} from "@nextui-org/react"
import {drawText} from "canvas-txt";
import {act} from "react-dom/test-utils";

const CanvasComponent = () => {
    const [image, setImage] = useState(null)
  const { drawImage, activeInput, canvasRef, setDebugMode, setActiveInput, debugMode, containers, data, setData, dragging } = useCanvasDrawing();

  useEffect(() => {
    const drawCanvas = () => {
        if(canvasRef.current){
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      const img = new Image()
            img.src=image
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if(debugMode) {
        Object.entries(data?.coordinates ?? {}).forEach(([input, coordinate]) => {
          const value = data.data[input];
          const { x, y, w, h } = data.coordinates[input] || coordinate;

          ctx.fillStyle = 'rgba(0, 0, 255, 0.2)';
          ctx.fillRect(x, y, w, h);
           if(value !== "" && value) {
               drawText(ctx, value, {
                   x: x,
                   y: y,
                   width: w,
                   height: h,
                   fontSize: 24,
               })
           }
        });
      }
        }
    };

    const animationFrameId = requestAnimationFrame(drawCanvas);

    return () => cancelAnimationFrame(animationFrameId);
  }, [data, dragging, activeInput]);

  useEffect(() => {
      drawImage(image)
  }, [image])

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = event.target.result
                setImage(img);
                drawImage(img)
            };
            reader.readAsDataURL(file);
        }
    };

  return (
      <NextUIProvider className="flex items-center justify-center gap-12 h-screen w-screen">
        <div className="flex flex-col gap-2">
            <div className="flex items-center">
                <input type="file" onChange={handleImageUpload}/>

                <label className="flex items-center gap-2">
                    Debug Mode:
                    <input type="checkbox" checked={debugMode} onChange={() => setDebugMode((prev) => !prev)} />
                </label>
            </div>
            <canvas ref={canvasRef} width={800} height={600} style={{ border: '1px solid black' }} />
        </div>

        <div className="flex flex-col gap-3">
          {Object.keys(data.data).map((input) => (
              <div className="flex items-center gap-4">
                  <Input onChange={(e) => setData(prev => ({
                      ...prev,
                      data: {
                          ...prev.data,
                          [input]: e.target.value
                      }
                  }))} type="text" label={input} className={`max-w-sm`} color={activeInput === input ? "primary" : "secondary"}/>

                  <span onClick={() => setActiveInput(input)} className="text-md cursor-pointer rounded-full w-8 flex-shrink-0 h-8 hover:opacity-70 bg-purple-100 flex items-center justify-center">
                      #
                  </span>
              </div>
            ))}
        </div>
      </NextUIProvider>
  );
};

export default CanvasComponent;