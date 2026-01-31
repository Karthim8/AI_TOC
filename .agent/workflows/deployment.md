---
description: How to deploy the Logical Whiteboard (MERN Stack)
---

# Deployment Workflow

This guide explains how to deploy the "Logical Whiteboard" application. We will deploy the **Backend** (Node/Express) to **Render** and the **Frontend** (React/Vite) to **Vercel**.

---

## Part 1: Backend Deployment (Render)

We will host the Node.js server first because the frontend needs the live backend URL to function.

### Prerequisites
- A GitHub account.
- A [Render](https://render.com/) account.
- Your project pushed to GitHub (we did this earlier!).

### Steps

1.  **Log in to Render** and go to your **Dashboard**.
2.  Click **"New +"** and select **"Web Service"**.
3.  **Connect GitHub**: Select "Build and deploy from a Git repository" and find your repo (`AI_TOC`).
4.  **Configure Service**:
    - **Name**: `ai-logical-board-backend` (or similar).
    - **Region**: Closest to you (e.g., Singapore/Oregon).
    - **Branch**: `master`.
    - **Root Directory**: `server` (Important! Your backend code is in this folder).
    - **Runtime**: `Node`.
    - **Build Command**: `npm install`
    - **Start Command**: `node server.js`
5.  **Environment Variables**:
    - Scroll down to "Environment Variables" and click "Add Environment Variable".
    - Add `MONGODB_URI`: Copy the full connection string from your local `.env`.
    - Add `GEMINI_API_KEY`: Copy your key from your local `.env`.
    - Add `PORT`: `5000` (Render might check this, though it sets its own internal port).
6.  **Deploy**: Click **"Create Web Service"**.

Render will now build your app. Wait for it to say **"Live"**.
**COPY THE URL**: It will look like `https://ai-logical-board-backend.onrender.com`.

---

## Part 2: Frontend Deployment (Vercel)

Now we deploy the React frontend and tell it where the backend lives.

### Steps

1.  **Log in to Vercel** and click **"Add New..."** -> **"Project"**.
2.  **Import Git Repository**: Find your `AI_TOC` repo and click "Import".
3.  **Configure Project**:
    - **Project Name**: `ai-logical-board`.
    - **Framework Preset**: `Vite` (it should auto-detect this).
    - **Root Directory**: Click "Edit" and select `client`. (Important!).
4.  **Environment Variables**:
    - Click to expand "Environment Variables".
    - Key: `VITE_API_URL`
    - Value: `https://ai-toc.onrender.com` (Your specific Render Backend URL).
    - **IMPORTANT**: Do NOT add a trailing slash `/` at the end.
5.  **Deploy**: Click **"Deploy"**.

Vercel will build the site. Once done, you will get a live URL (e.g., `https://ai-logical-board.vercel.app`).

### Done! 🚀
Open your Vercel URL, type a prompt, and it should verify against the formal rules on your Render backend!
