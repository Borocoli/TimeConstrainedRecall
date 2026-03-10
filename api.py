from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core import App
from pydantic import BaseModel, ConfigDict
from typing import List, Dict, Optional
import datetime
import toml

app = FastAPI()
with open("config.toml", 'r') as f:
    config = toml.load(f)
print(config["origins"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=config["origins"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = App(config['db'], n=config['n'])


blocked = None 
def free():
    global blocked
    if blocked:
        if blocked < datetime.datetime.now():
            blocked = None
            return True
        else:
            return False
    return True

def block(t: int):
    global blocked
    tmp = datetime.datetime.now() + datetime.timedelta(minutes=t)
    if  not blocked or tmp > blocked:
        blocked = tmp

# Pydantic Models
class QuestionCreate(BaseModel):
    text: str
    opts: List[str]
    correct: int

class QuestionUpdate(BaseModel):
    text: Optional[str] = None
    opts: Optional[Dict[int, str]] = None
    correct: Optional[int] = None

class QuizRequest(BaseModel):
    n: int

class FeedbackItem(BaseModel):
    id: int
    correct: bool

class FeedbackRequest(BaseModel):
    answers: List[FeedbackItem]


def questionify(t: tuple):
    d = {'id': t[0], 'text': t[1], 'correct': t[2], 'opts': t[3:]}
    return d

def long_questionify(l: List[tuple]):
    nl = []
    for e in l:
        nl.append(questionify(e))
    return nl

# Routes
@app.post("/questions")
def create_question(q: QuestionCreate):
    # App.c expects list of strings for opts
    db.c(q.text, q.opts, q.correct)
    return {"message": "Question created"}

@app.get("/questions/{idd}")
def get_question(idd: int):
    # App.__getitem__ expects a list of ids
    return questionify(db[[idd]][0])

@app.put("/questions/{idd}")
def update_question(idd: int, q: QuestionUpdate):
    # App.u expects dict for opts
    if free():
        db.u(idd, q.text, q.opts, q.correct)
        return {"status": 0}
    return {"status": -1}
    

@app.delete("/questions/{idd}")
def delete_question(idd: int):
    if free():
        db.d([idd])
        return {"status": 0}
    return {"status": -1}


@app.get("/quiz")
def get_quizz(n: int, t: int):
    block(t+1)
    return long_questionify(db.quizz(n))

@app.put("/quiz/submit")
def submit_quiz(f: FeedbackRequest):
    # App.feedback expects dict {id: bool}
    l = {item.id: item.correct for item in f.answers}
    db.feedback(l)
    return {"status": 0}


@app.put("/reset")
def reset(n: int):
    if free():
        if n > 0:
            db.n = n
        db.reset()
        return {"status": 0}
    return {"status": -1}

@app.get('/opts')
def get_opts():
        return {'opts': db.n}

@app.get("/list")
def get_question(start: int, chunk: int):
    ids = db.ids
    if start == len(ids):
        idds = []
        rez = -1
    elif start + chunk >= len(ids):
        rez = -1
        idds = ids[start:]
    else:
        rez = start+chunk
        idds = ids[start: start+chunk]
   
    ids = db[idds]
    r = {i[0]: i[1] for i in ids}
    return r 


