'use client'
import FileInput from '@/components/FileInput';
import TextInput from '@/components/TextInput';
import React, { useEffect, useRef, useState } from 'react'

const Admin = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const canvasRef = useRef();
  const [data, setData] = useState({
    inputs: {
      address: "",
      date: "",
      total: ""
    },
    coordinates: {
      total: null,
      address: null,
      date: null
    },
    activeInput: "",
    width: 0,
    height: 0
  });

  const handleImageUpload = (event) => {
    const input = event.target;

    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const imageUrl = e.target.result;

        setFileUrl(imageUrl);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.addEventListener('click', handleCanvasClick);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasClick);
      }
    };
  }, [canvasRef, data, data.activeInput]);

  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setData((prev) => ({
      ...prev,
      coordinates: {
        ...prev.coordinates,
        [prev.activeInput]: { x, y }
      }
    }));
  };

  const clearCanvas = () => {
    setData((prev) => ({
      ...prev,
      coordinates: {
        total: null,
        address: null,
        date: null
      },
      inputs: {
        address: "",
        date: "",
        total: ""
      }
    }));

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);

    if (fileUrl) {
      const img = new Image();
      img.src = fileUrl;
      img.onload = () => {
        context.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  };

  const convertCanvasToDataURL = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    return dataURL
  };

  const handleDownload = () => {
    const url = convertCanvasToDataURL()
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const drawText = (text, x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = "#000";
    context.font = "14px Arial";
    context.fillText(text, x, y);
  };

  const handleInputChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [key]: value
      }
    }));
  };

  return (
    <div className='flex flex-col items-center bg-gray-950 w-screen h-screen gap-4 p-12'>
      <span className='text-2xl font-semibold'>Draw text</span>

      <div className="w-full h-full flex gap-6 justify-center">
        <canvas className='!w-[450px] !h-[636px] hover:cursor-crosshair' width={450} height={636} ref={canvasRef}>
        </canvas>

        {fileUrl && <form onSubmit={(e) => {
          e.preventDefault();
          Object.entries(data.inputs).forEach(([inputKey, inputValue]) => {
            drawText(inputValue, data.coordinates?.[inputKey]?.x, data.coordinates?.[inputKey]?.y);
          });
        }} className="flex flex-col gap-4">
          {Object.entries(data.inputs).map(([key, value]) => {
            return (
              <div key={key} className='w-fit h-fit flex items-center'>
                <TextInput
                  id={key}
                  placeholder={key}
                  value={value}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                />
                <button
                  title={`Set coordinat ${key}`}
                  type="button"
                  className='ml-4 px-2 py-2 bg-gray-300 text-black rounded-md transition-all duration-200 hover:opacity-75'
                  onClick={() => setData((prev) => ({ ...prev, activeInput: key }))}
                >
                  <svg fill="#000000" width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><title /><path d="M21.31,52.45h-.17a2,2,0,0,1-1.82-2.16l2.87-34.72a2,2,0,1,1,4,.33L23.3,50.61A2,2,0,0,1,21.31,52.45Z" /><path d="M36.82,50.28l-.24,0A2,2,0,0,1,34.83,48l.33-2.71a2,2,0,1,1,4,.48l-.32,2.7A2,2,0,0,1,36.82,50.28Z" /><path d="M38,36.62h-.17A2,2,0,0,1,36,34.46L37.7,13.39a2,2,0,1,1,4,.33L39.94,34.79A2,2,0,0,1,38,36.62Z" /><path d="M46.78,27.68h-.17L11.89,24.8a2,2,0,0,1-1.83-2.16,2,2,0,0,1,2.16-1.82l34.72,2.87a2,2,0,0,1-.16,4Z" /><path d="M49,43.19h-.17L14.06,40.31a2,2,0,0,1-1.83-2.16,2,2,0,0,1,2.16-1.82L49.11,39.2a2,2,0,0,1-.16,4Z" /></svg>
                </button>

                <span className='text-sm ml-4'>
                  x: {data?.coordinates[key]?.x || ""}
                  <br />
                  y: {data?.coordinates[key]?.y || ""}
                </span>
              </div>
            )
          })}
          <button className='px-4 py-2 transition-all duration-200 hover:opacity-75 w-auto h-auto bg-gray-300 rounded-md text-black' type='submit'>
            Draw
          </button>
          <button
            type='button'
            onClick={() => clearCanvas()}
            className='px-4 py-2 transition-all duration-200 hover:opacity-75 w-auto h-auto bg-gray-300 rounded-md text-black'
          >
            Clear Canvas
          </button>
          <button
            type='button'
            className='px-4 py-2 transition-all duration-200 hover:opacity-75 w-auto h-auto rounded-md bg-gray-300 text-black'
            onClick={() => {
              convertCanvasToDataURL();
              handleDownload();
            }}
          >
            Download Canvas
          </button>
        </form>}
      </div>

      <FileInput onChange={handleImageUpload} />

      <img src={fileUrl} className='w-[450px] h-fit hidden' onLoad={(e) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(e.currentTarget, 0, 0, 450, 636);
      }} />
    </div>
  );
}

export default Admin;