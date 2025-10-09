# experiments/plot.py
import sys, csv, collections
import matplotlib.pyplot as plt
def main(path):
    counts=collections.Counter()
    with open(path,'r',encoding='utf-8') as f:
        rdr=csv.DictReader(f)
        for row in rdr: counts[int(row['ray'])]+=1
    xs=sorted(counts); ys=[counts[k] for k in xs]
    import matplotlib.pyplot as plt
    plt.figure(); plt.title('Bounces per ray'); plt.xlabel('ray'); plt.ylabel('bounces'); plt.plot(xs,ys)
    out=path.replace('.csv','_bounces.png'); plt.savefig(out, dpi=150, bbox_inches='tight'); print(out)
if __name__=='__main__':
    if len(sys.argv)<2: print('usage: python experiments/plot.py outputs/exp.csv'); raise SystemExit(1)
    main(sys.argv[1])
