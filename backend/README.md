# AegisAI backend

A small Python/Flask API kept separate from the React/Vite frontend. It provides a health check, transaction listing, and a form for adding illustrative transaction rows to a local SQLite database. The database is initialized automatically and seeded once with five sample transactions. Fraud detection and AI/ML are not implemented.

## Set up the environment (Windows PowerShell)

From the project root:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

If PowerShell blocks environment activation, run this once in the current terminal and try again:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

## Run the backend

In the `backend` folder, with the virtual environment activated:

```powershell
python app.py
```

The API listens at `http://127.0.0.1:5000`. It creates `aegisai.db` if needed and adds the sample rows only when the transactions table is empty. Keep this terminal open while using the API.

## Run the frontend

Open a second PowerShell terminal from the project root:

```powershell
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal. Vite forwards `/api` requests to the backend at port 5000, so keep the backend running too.

## Available endpoints

- `GET /api/health` reports whether the backend is responding.
- `GET /api/transactions` returns the rows stored in SQLite.
- `POST /api/transactions` validates and saves a new row. The Transactions page provides the entry form; the backend generates the ID, date, and initial Pending status.

The dashboard totals are based on this local sample database. They are not real fraud statistics. Fraud detection and prevention are not implemented.

- PATCH /api/transactions/<id> updates a transaction workflow status to Pending, Investigating, Reviewing, or Completed.


- GET /api/alerts returns transactions with a risk score of 70 or higher for review. A review flag is not a fraud determination.
