const express = require('express');
const router = express.Router();
const { generateDrawingLogic } = require('../services/aiService');
const Drawing = require('../models/Drawing');

// POST /api/generate
router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const logic = await generateDrawingLogic(prompt);
        let drawingId = null;

        // Attempt to save to history, but don't block response if DB is down
        try {
            const newDrawing = new Drawing({ prompt, logic });
            await newDrawing.save();
            drawingId = newDrawing._id;
        } catch (dbError) {
            console.warn("⚠️ Failed to save drawing to history (DB might be down):", dbError.message);
        }

        res.json({ logic, id: drawingId });
    } catch (error) {
        console.error("Error in /generate:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/history
router.get('/history', async (req, res) => {
    try {
        const history = await Drawing.find().sort({ createdAt: -1 }).limit(10);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

module.exports = router;
