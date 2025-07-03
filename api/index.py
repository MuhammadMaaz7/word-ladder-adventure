from word_ladder.main import app
from mangum import Mangum

handler = Mangum(app)
