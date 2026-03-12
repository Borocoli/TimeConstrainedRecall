# TimeConstrainedRecall
A way to find flaws in your knowledge when you don't have much time on your hand

---

## ⚙️ Setup Instructions

### 1. Backend Setup (`api.py`)

The backend requires a configuration file named `config.toml` in the root directory.

#### Configuration (`config.toml`)
Create or edit `config.toml` with the following structure:

```toml
# CORS settings: allow specific origins or use "*" for all
origins = ["*"]

# Database connection string (SQLite in this example)
db = "sqlite+pysqlite:///db.sqlite"

# Number of answer options per question (e.g., 2, 3, 4)
n = 2
```
#### Running the API

2.  Start the server:
    ```bash
    uvicorn api:app --reload
    ```
    The API will now be running at `http://localhost:8000`.

---

### 2. Frontend Setup (`webpage/`)

The React frontend needs to know where to send requests. This is configured via a `.env` file.

#### Environment Variables

Navigate to the `webpage` folder and create a `.env` file:

```env
VITE_URL=http://localhost:8000
```

*If you deploy the backend to a different URL, update `VITE_URL` accordingly.*

#### Running the Frontend

1.  Navigate to the `pages` directory:
    ```bash
    cd pages
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will typically open at `http://localhost:5173` (default Vite port).

---
