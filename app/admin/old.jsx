'use client'
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import png from "@/assets/empty_page-0001.jpg"

const Admin = () => {
    const canvasRef = useRef(null);
    const imageRef = useRef(null);
    const [canvasDataURL, setCanvasDataURL] = useState(null);
    const [data, setData] = useState({
        inputs: {
            adress: "",
            date: "",
            total: ""
        },
        coordinats: {
            total: null,
            adress: null,
            date: null
        },
        activeInput: ""
    });
    const [drawed, setDrawed] = useState(false);

    useEffect(() => {
        if (imageRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            if (!drawed) {
                context.drawImage(imageRef.current, 0, 0, 500, 707);
                setDrawed(true);
            }
            canvas.addEventListener('click', handleCanvasClick);
        }

        return () => {
            if (canvasRef.current) {
                canvasRef.current.removeEventListener('click', handleCanvasClick);
            }
        };
    }, [canvasRef, imageRef, data, data.activeInput]);

    const handleCanvasClick = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // drawCircle(x, y, 5, "#000");
        setData((prev) => ({
            ...prev,
            coordinats: {
                ...prev.coordinats,
                [prev.activeInput]: { x, y }
            }
        }));
    };

    const drawText = (text, x, y) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.fillStyle = "#000";
        context.font = "14px Arial";
        context.fillText(text, x, y);
    };

    const drawCircle = (x, y, radius, color) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fillStyle = color;
        context.fill();
        context.closePath();
    };

    const clearCanvas = () => {
        setData((prev) => ({
            ...prev,
            coordinats: {
                total: null,
                adress: null,
                date: null
            },
            inputs: {
                adress: "",
                date: "",
                total: ""
            }
        }));
    };

    const convertCanvasToDataURL = () => {
        const canvas = canvasRef.current;
        const dataURL = canvas.toDataURL("image/png");
        setCanvasDataURL(dataURL);
    };

    const handleDownload = () => {
        if (canvasDataURL) {
            const link = document.createElement("a");
            link.href = canvasDataURL;
            link.download = "canvas_image.png";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className='flex gap-2 p-12 w-screen h-screen bg-blue-600'>
            <Image alt='x' src={png} width={500} height={707} ref={imageRef} className='hidden' onLoad={() => {
                const canvas = canvasRef.current;
                const context = canvas.getContext('2d');
                context.drawImage(imageRef.current, 0, 0, 500, 707);
            }} />
            <canvas ref={canvasRef} width={500} height={707} className='!w-[500px] !h-[707px]' />

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    const { inputs, coordinats } = data;
                    Object.entries(inputs).forEach(([inputKey, inputValue]) => {
                        console.log({
                            [inputValue]: { x: coordinats?.[inputKey]?.x, y: coordinats?.[inputKey]?.y }
                        });
                        drawText(inputValue, coordinats?.[inputKey]?.x, coordinats?.[inputKey]?.y);
                    });
                }}
                className='flex flex-col gap-2'
            >
                {Object.entries(data.inputs).map(([key, value]) => (
                    <div key={key} className='relative'>
                        <input
                            className='outline-none px-4 py-2 shadow-md rounded-md text-black'
                            type="text"
                            id={key}
                            placeholder={key}
                            required
                            value={value}
                            onChange={(e) => setData((prev) => ({
                                ...prev,
                                inputs: {
                                    ...prev.inputs,
                                    [key]: e.target.value
                                }
                            }))}
                        />
                        <button
                            type="button"
                            className='absolute right-0 top-0 px-2 py-1 bg-gray-300 text-black'
                            onClick={() => setData((prev) => ({ ...prev, activeInput: key }))}
                        >
                            Set
                        </button>
                    </div>
                ))}
                <button className='px-4 py-2 w-auto h-auto bg-gray-300 text-black mt-4' type='submit'>
                    Draw
                </button>
                <button
                    type='button'
                    onClick={() => clearCanvas()}
                    className='px-4 py-2 w-auto h-auto bg-gray-300 text-black mt-4'
                >
                    Clear Canvas
                </button>
                <button
                    type='button'
                    className='px-4 py-2 w-auto h-auto bg-gray-300 text-black mt-4'
                    onClick={() => {
                        convertCanvasToDataURL();
                        handleDownload();
                    }}
                >
                    Download Canvas
                </button>
            </form>
        </div>
    );
};

export default Admin;