from mangum import Mangum
from word_ladder.main import app  # correct relative import

handler = Mangum(app)
