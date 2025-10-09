#!/usr/bin/env python3
# transcript.txt를 읽어 키워드 기반으로 단순 챕터를 추출합니다.
import re, sys, json

def parse_time(s):
    m = re.match(r"(\d+):(\d+)", s)
    if not m: return None
    return int(m.group(1))*60 + int(m.group(2))

def main(path='transcript.txt'):
    txt = open(path, 'r', encoding='utf-8').read()
    # "00:00 제목" 형태 탐지
    lines = [l.strip() for l in txt.splitlines() if re.match(r'^\d{2}:\d{2} ', l)]
    chapters = []
    for ln in lines:
        ts = ln.split(' ')[0]
        title = ln[len(ts):].strip()
        chapters.append({'time': ts, 'title': title})
    print(json.dumps({'chapters': chapters}, ensure_ascii=False, indent=2))

if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv)>1 else 'transcript.txt')
