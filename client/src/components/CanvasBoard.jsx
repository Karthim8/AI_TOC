import React, { useRef, useEffect, useState } from 'react';

const CanvasBoard = ({ steps, isPlaying, onDrawComplete }) => {
    const canvasRef = useRef(null);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Constants
    const START_X = 400;
    const START_Y = 300;
    const DELAY_MS = 500; // Animation delay

    useEffect(() => {
        // Reset canvas when steps change or "isPlaying" toggle resets
        if (!isPlaying) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            setCurrentStepIndex(0);
        }
    }, [steps, isPlaying]);

    useEffect(() => {
        if (!isPlaying || !steps || steps.length === 0) return;

        if (currentStepIndex >= steps.length) {
            if (onDrawComplete) onDrawComplete();
            return;
        }

        const timer = setTimeout(() => {
            drawStep(steps[currentStepIndex]);
            setCurrentStepIndex(prev => prev + 1);
        }, DELAY_MS);

        return () => clearTimeout(timer);
    }, [isPlaying, currentStepIndex, steps]);

    const turtleState = useRef({
        x: START_X,
        y: START_Y,
        angle: 0, // 0 degrees points RIGHT.
        penDown: false
    });

    // Reset turtle state when starting fresh
    useEffect(() => {
        if (currentStepIndex === 0) {
            turtleState.current = { x: START_X, y: START_Y, angle: -90, penDown: false }; // -90 points UP
        }
    }, [currentStepIndex]);

    const drawStep = (step) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { action, value, count } = step;

        const state = turtleState.current;

        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#2563eb"; // Blue color

        switch (action) {
            case 'penDown':
                state.penDown = true;
                break;
            case 'penUp':
                state.penDown = false;
                break;
            case 'move':
                const rad = (state.angle * Math.PI) / 180;
                const newX = state.x + value * Math.cos(rad);
                const newY = state.y + value * Math.sin(rad);

                if (state.penDown) {
                    ctx.beginPath();
                    ctx.moveTo(state.x, state.y);
                    ctx.lineTo(newX, newY);
                    ctx.stroke();
                }

                state.x = newX;
                state.y = newY;
                break;
            case 'turn':
                state.angle += value;
                break;
            case 'jump':
                state.x = step.x;
                state.y = step.y;
                break;
            case 'line':
                ctx.beginPath();
                ctx.moveTo(state.x, state.y);
                ctx.lineTo(step.x, step.y);
                ctx.stroke();
                state.x = step.x;
                state.y = step.y;
                break;
            case 'circle':
                ctx.beginPath();
                ctx.arc(state.x, state.y, step.radius, 0, 2 * Math.PI);
                ctx.stroke();
                break;
            case 'text':
                ctx.save(); // Save current state to restore after text
                ctx.font = "14px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(step.content, state.x, state.y);
                ctx.restore();
                break;

            // Nested repeats would require recursion or flattening the logic array in backend/adapter
            // For MVP we assume a flat list or simple structure.
            default:
                console.warn("Unknown action:", action);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-4 border border-gray-200 flex justify-center items-center">
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-100 bg-gray-50 rounded"
            />
        </div>
    );
};

export default CanvasBoard;
