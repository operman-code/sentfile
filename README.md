# sentfile
website that made to share a small files to the perticular user gobally so that user can download that file instally, the secure portal that it will automatically detele the file in perticular time seleted by you.
sentfile/
├── server/                     # Backend Node.js + Express API
│   ├── routes/                 # Express route handlers
│   │   ├── auth.js             # Signup, login routes with JWT auth
│   │   └── users.js            # User search routes with JWT middleware
│   ├── models/                 # (Optional) DB models or query helpers
│   ├── config/                 # Configuration (DB, JWT secret, etc.)
│   ├── app.js                  # Main Express server entry point
│   ├── package.json            # Backend dependencies and scripts
│   └── .env.example            # Env variable template (DB creds, JWT secret)
│
├── client/                     # Frontend React app
│   ├── public/                 # Static assets (index.html, favicon)
│   ├── src/                    # React components & source code
│   │   ├── components/         # UI components (Signup, Login, Search)
│   │   ├── App.js              # Main React app
│   │   └── index.js            # React DOM render
│   ├── package.json            # Frontend dependencies and scripts
│   └── .env.example            # Frontend env variables (API endpoints)
│
├── README.md                   # Project overview and instructions
└── .gitignore                  # Git ignore rules
