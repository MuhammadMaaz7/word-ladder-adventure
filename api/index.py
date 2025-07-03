from mangum import Mangum
from word_ladder.main import app  # assuming your app = FastAPI() is in word_ladder/main.py

handler = Mangum(app)
