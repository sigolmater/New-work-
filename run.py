# experiments/run.py
import argparse, csv, random, os, sys
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from engine.ray import Ray, run
def rand_dir(rng):
    while True:
        x=rng.uniform(-1,1); y=rng.uniform(-1,1); z=rng.uniform(-1,1)
        n=x*x+y*y+z*z
        if 1e-12<n<=1.0:
            s=n**0.5; return (x/s,y/s,z/s)
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('--rays',type=int,default=200)
    ap.add_argument('--bounces',type=int,default=120)
    ap.add_argument('--seed',type=int,default=7)
    ap.add_argument('--out',default='outputs/exp.csv')
    a=ap.parse_args()
    rng=random.Random(a.seed); os.makedirs('outputs',exist_ok=True)
    with open(a.out,'w',encoding='utf-8',newline='') as f:
        wr=csv.writer(f); wr.writerow(['ray','bounce','x','y','z','axis','sign'])
        for i in range(a.rays):
            r=Ray((rng.uniform(-0.9,0.9),rng.uniform(-0.9,0.9),rng.uniform(-0.9,0.9)), rand_dir(rng))
            _,hist=run(r,a.bounces)
            for b,(pos,side) in enumerate(hist, start=1):
                wr.writerow([i,b,pos[0],pos[1],pos[2],side[0],side[1]])
    print(a.out)
if __name__=='__main__': main()
