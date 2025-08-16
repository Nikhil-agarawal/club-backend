# Campus Innovation Council - Event Management Platform

Full-stack web application for managing campus events with **public** and **admin** roles.  
Frontend built with **Next.js + Tailwind CSS**, backend with **Node.js + Express**, and **MongoDB** as database.  

## Features
- Public can view events and register online.
- Admin dashboard for creating events, uploading photos, and tracking registrations.
- Automated Excel export of registration data.
- Cloudinary integration for image uploads.
- Responsive UI with **Tailwind CSS**.

## Live Demo
[Campus Innovation Council Web App](https://club-frontend-theta.vercel.app/)

## Folder Structure
Campus-Innovation_council/
├── frontend/ # Next.js frontend code
├── backend/ # Node.js + Express backend code
└── README.md


## Getting Started (Run Locally)

### Prerequisites
- Node.js >= 16
- npm
- MongoDB

### Frontend
```bash
cd frontend
npm install
npm run dev
cd backend
npm install
node index.js   # or your entry file
