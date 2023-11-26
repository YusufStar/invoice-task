'use client'
import { useEffect, useRef, useState } from 'react';

const useCanvas = (canvasRef) => {
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
  const [isCoordinateIndicatorVisible, setCoordinateIndicatorVisible] = useState(false);

  // kare çizme fonksiyonu
  const drawSquare = (x, y, width, height, color) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.strokeStyle = color || '#000';
    context.fillStyle = color || '#000'; // Set fill style
    context.strokeRect(x, y, width, height);
  };

  // daire çizme
  const drawCircle = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    context.beginPath();
    context.arc(200, 200, 50, 0, 2 * Math.PI);
    context.fill();
  };

  // resimi canvasa bastırma
  const drawImage = (imageUrl) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    return img
  };

  // verilen texti verilen koordinatlara yazdır
  const drawText = (text, x, y) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = "#000";
    context.font = "bold 12px Arial";
    context.fillText(text, x, y);
  };

  
    const drawShape = (shape, options) => {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
    
      context.beginPath();
    
      if (shape === 'square') {
        context.rect(options.x, options.y, options.width, options.height);
      } else if (shape === 'circle') {
        context.arc(options.x, options.y, options.radius, 0, 2 * Math.PI);
      }
    
      context.fillStyle = options.color || '#000';
      context.fill();
    };

    // canvasa tıklanıldığında
    const handleCanvasInteraction = (e) => {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - 12;
      const y = e.clientY - rect.top - 12;
      setCoordinateIndicatorVisible(false);
    
      if (data.activeInput) {
        setData((prev) => ({
          ...prev,
          coordinates: {
            ...prev.coordinates,
            [prev.activeInput]: { x, y },
          },
        }));
      }
    };
    
    // canvası
    useEffect(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.addEventListener('click', handleCanvasInteraction);
      }
    
      return () => {
        if (canvasRef.current) {
          canvasRef.current.removeEventListener('click', handleCanvasInteraction);
        }
      };
    }, [canvasRef, data, data.activeInput]);

  // canvası temizle tamamen!
  const clearData = () => {
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
  };

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  }

  // inputlara girdi girildiğinde datayı değiştir
  const handleInputChange = (key, value) => {
    setData((prev) => ({
      ...prev,
      inputs: {
        ...prev.inputs,
        [key]: value
      }
    }));
  };

  // canvası dataya çevir
  const convertCanvasToDataURL = () => {
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    return dataURL
  };

  // çevrilen datayı indir
  const handleDownload = () => {
    const url = convertCanvasToDataURL()
    const link = document.createElement("a");
    link.href = url;
    link.download = "invoice.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return { drawSquare, drawCircle, drawText, drawShape, data, setData, isCoordinateIndicatorVisible, setCoordinateIndicatorVisible, handleInputChange, clearData, handleDownload, resetCanvas };
};

export default useCanvas;
