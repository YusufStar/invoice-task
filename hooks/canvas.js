'use client'
import {useState, useEffect, useRef} from 'react';

const template = {
    data: {
        address: '',
        date: '',
        total: '',
    },
    coordinates: {
        total: {},
        address: {},
        date: {},
    },
};

const useCanvasDrawing = () => {
    const canvasRef = useRef(null);
    const [debugMode, setDebugMode] = useState(false);
    const [activeInput, setActiveInput] = useState('');
    const [dragging, setDragging] = useState(false);
    const [dragStart, setDragStart] = useState({x: 0, y: 0});
    const [dragEnd, setDragEnd] = useState({x: 0, y: 0});
    const [data, setData] = useState(template)

    const handleMouseDown = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setDragStart({x, y});
        setDragging(true);
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setDragEnd({x, y});
        }
    };

    const handleMouseUp = () => {
        if (dragging) {
            setDragging(false);
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, activeInput]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Draw active selection container
        if (dragging || activeInput !== null && activeInput !== undefined && activeInput !== "") {
            setData(prev => ({
                ...prev,
                coordinates: {
                    ...prev.coordinates,
                    [activeInput]: {
                        x: dragStart.x,
                        y: dragStart.y,
                        w: dragEnd.x - dragStart.x,
                        h: dragEnd.y - dragStart.y
                    }
                }
            }))
        }
    }, [dragging, dragStart, dragEnd]);

    const drawImage = (src) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.src = src;

            image.onload = () => {
            const maxHeight = 700;
            const scaleFactor = maxHeight / image.height;
            const scaledWidth = image.width * scaleFactor;

            canvas.width = scaledWidth;
            canvas.height = maxHeight;

            ctx.drawImage(image, 0, 0, scaledWidth, maxHeight);
        };
    };

    return {
        canvasRef,
        setDebugMode,
        setActiveInput,
        activeInput,
        debugMode,
        data,
        setData,
        dragging,
        drawImage
    };
};

export default useCanvasDrawing;