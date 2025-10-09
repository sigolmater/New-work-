# verification/tests.py
import os, sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from engine.ray import Ray, run
def test():
    r=Ray((0,0,0),(1,2,3)); _,h=run(r,10); assert len(h)>0
if __name__=='__main__': test(); print('OK: tests passed')
