from sqlalchemy import MetaData
from sqlalchemy import Table, Column, Integer, String
import sqlalchemy as sql
import numpy as np


class App:
    def __init__(self, path, n, max_text=200, max_opt=100):
        self.engine = sql.create_engine(path, echo=True)
        self.metadata = MetaData()
        self.n = n
        self.max_text = max_text
        self.max_opt = max_opt
        self.table = None
        self.reset()

    def reset(self):
        if self.table:
            with self.engine.connect() as con:
                self.table.drop(con)
                con.commit()

        cols = [
                Column('id', Integer, primary_key=True),
                Column('correct', Integer(), default=1),
                Column('wrong', Integer(), default=1),
                Column('text', String(self.max_text)),
                Column('ocorrect', Integer()),
                ]
        opts = [Column(f'o{i}', String(self.max_opt)) for i in range(self.n)]
        cols = cols + opts
        self.table = Table('questions', self.metadata, *cols) 
        self.metadata.create_all(self.engine)

    def c(self, text, opts, correct):
        assert isinstance(text, str)
        assert len(text) <= self.max_text
        assert isinstance(correct, int)
        assert correct < self.n
        d = {
            'text': text,
            'ocorrect': correct,
                }

        assert len(opts) == self.n
        for i, o in enumerate(opts):
            assert isinstance(o, str)
            assert len(o) <= self.max_opt
            d[f'o{i}'] = o


        st = sql.insert(self.table).values(**d)
        with self.engine.connect() as con:
            r = con.execute(st)
            con.commit()

    def __getitem__(self, idxs):
        cols = ['id', 'text', 'ocorrect'] + [f'o{i}' for i in range(self.n)]
        st = sql.select(self.table.c[*cols]).where(self.table.c.id.in_(idxs))
        rows = []
        with self.engine.connect() as con:
            r = con.execute(st)
            for row in r:
                rows.append(row)
            con.commit()
        return rows

    def u(self, idx, text: str = None, opts: dict = None, correct: int = None):
        d = {}
        if text:
            assert isinstance(text, str)
            assert len(text) <= self.max_text
            d['text'] = text
        if correct != None:
            assert isinstance(correct, int)
            assert correct < self.n
            d['ocorrect'] = correct
        if opts:
            for k in opts:
                assert k < self.n
                d[f'o{k}'] = opts[k]
        st = sql.update(self.table).where(self.table.c.id == idx).values(**d)
        with self.engine.connect() as con:
            r = con.execute(st)
            con.commit()

    def d(self, idxs):
        st = sql.delete(self.table).where(self.table.c.id.in_(idxs))
        with self.engine.connect() as con:
            r = con.execute(st)
            con.commit()

    @property
    def ids(self):
        st = sql.select(self.table.c.id)
        rows = []
        with self.engine.connect() as con:
            r = con.execute(st)
            for row in r:
                rows.append(row[0])
            con.commit()
        return tuple(rows)



    def quizz(self, n):
        st = sql.select(self.table.c['id', 'correct', 'wrong'])
        idxs = []
        a = []
        b = []
        with self.engine.connect() as con:
            r = con.execute(st)
            for row in r:
                idxs.append(row[0])
                a.append(row[1])
                b.append(row[2])
                
        a = np.array(a)
        b = np.array(b)
        print('a', a)
        print('b', b)
        idxs = np.array(idxs)
        gen = np.random.default_rng()
        theta = gen.beta(a, b)
        if n > len(idxs):
            n = len(idxs)
        args = np.argpartition(theta, -n)[-n:] 
        idxs = idxs[args].tolist()
        return self[idxs]

    def feedback(self, l): #l -> {id: correct}
        st = sql.update(self.table).where(self.table.c.id == sql.bindparam('o')).values(correct = self.table.c.correct + sql.bindparam('right'), wrong = self.table.c.wrong + sql.bindparam('wrong'))
        d = [{'o': k, 'right': v, 'wrong': 1-v} for k, v in l.items()]
        with self.engine.connect() as con:
            r = con.execute(st, d)
            con.commit() 

