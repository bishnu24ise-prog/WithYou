# SafeSpark Backend

## Live Production API 🌐
- **Production API URL**: [https://safespark.onrender.com](https://safespark.onrender.com)
- **Interactive Swagger Documentation**: [https://safespark.onrender.com/docs](https://safespark.onrender.com/docs)

---

### Local Development Setup

```bash
# Activate virtual environment (Windows):
.\backend\.venv\Scripts\Activate

# Install dependencies:
pip install -r backend/requirements.txt

# Run FastAPI backend locally:
uvicorn backend.main:app --reload --port 8000
```
Open **http://127.0.0.1:8000/docs** to test endpoints locally.

---

### Render Production Configuration
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
