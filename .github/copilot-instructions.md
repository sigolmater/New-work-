# Copilot Agent Instructions — sigolmater/New-work-

> 이 파일은 Copilot의 행동 강령이다. VS Code Agent Mode에서 작업을 받으면
> 아래 프로토콜을 순서대로 실행한다. 지시가 없으면 다음 단계로 진행한다.

---

## 1. 프로젝트 지도

| 레이어 | 기술 | 진입점 |
|--------|------|--------|
| 시뮬레이션 백엔드 | Python 3 | `run.py`, `tests.py`, `plot.py` |
| 인터랙티브 프론트엔드 | React 18 | `src/` |
| 암호화 모듈 | Python / pycryptodome | `hangul_hybrid_aead.py` |
| 콘텐츠 킷 | 텍스트/JSON | `RUNBOOK.md`, `obs_scenes.json` 등 |

---

## 2. 작업 시작 전 — 컨텍스트 수집 (매번 실행)

새 작업을 받으면 코드를 바로 수정하지 않는다. 먼저 아래를 실행한다.

```bash
# 현재 브랜치와 상태 확인
git status
git log --oneline -10

# 관련 파일 파악
grep -r "<작업_키워드>" --include="*.py" --include="*.js" --include="*.jsx" -l

# 테스트 현재 상태 확인 (베이스라인)
python tests.py
```

이 결과를 바탕으로 무엇을 바꿔야 하는지 파악한 뒤 구현을 시작한다.

---

## 3. 자율 실행 프로토콜 — Issue → PR

작업 지시를 받으면 아래 단계를 **인간 개입 없이** 순서대로 완료한다.

### Step 1. 브랜치 생성
```bash
git checkout main
git pull origin main
git checkout -b <타입>/<짧은-설명>
# 타입: feat | fix | refactor | security | docs
```

### Step 2. 구현
- 관련 파일만 수정한다 — 요청 범위 밖은 건드리지 않는다
- 새 기능에는 반드시 테스트를 함께 작성한다
- 한 커밋 = 한 논리 단위 (여러 커밋 가능, 스쿼시는 머지 시 처리)

### Step 3. 자기수정 루프 (테스트 통과까지 반복)

```
테스트 실행
    ↓
실패? → 원인 분석 → 코드 수정 → 다시 테스트
    ↓
최대 5회 반복
    ↓
5회 후에도 실패? → 현재 상태 커밋 + PR 본문에 실패 내역 기록 + 인간에게 알림
```

```bash
# Python
python tests.py

# React (변경 시)
npm test -- --watchAll=false --passWithNoTests
```

### Step 4. 커밋
```bash
git add <수정한_파일만>   # git add . 금지
git commit -m "<타입>: <왜 바꿨는지 한 줄>"
```

### Step 5. 푸시
```bash
git push -u origin <브랜치명>
```

### Step 6. PR 생성
PR 본문은 아래 템플릿을 **반드시** 채워서 작성한다.

```markdown
## 변경 요약
- (bullet 형식, 무엇을 왜 바꿨는지)

## 연결된 Issue
closes #<번호>

## 테스트 결과
```
(python tests.py 출력 전체 붙여넣기)
```

## 보안 영향
- 암호화 코드 변경: Yes / No
- 키 재료 노출 위험: None / Low / Review Required

## 검수자 확인 요청
- (검수자가 특히 봐야 할 부분, 불확실한 부분)
```

**PR은 Draft로 생성한다. 머지는 사람이 결정한다.**

---

## 4. 판단 기준 — 혼자 할 것 vs 물어볼 것

### 혼자 진행
| 상황 | 행동 |
|------|------|
| 버그 수정 (테스트 있음) | 바로 진행 |
| 새 유틸리티 함수 추가 | 바로 진행 |
| React UI 컴포넌트 수정 | 바로 진행 |
| 테스트 추가/보강 | 바로 진행 |
| 시뮬레이션 파라미터 조정 | 바로 진행 |
| 리팩터링 (동작 변경 없음) | 바로 진행 |

### 반드시 멈추고 Issue 댓글로 질문
| 상황 | 이유 |
|------|------|
| 암호화 알고리즘 변경 필요 | 보안 영향 크다 |
| 새 외부 라이브러리 추가 | 의존성 결정은 사람이 한다 |
| 요구사항이 모순되거나 불명확 | 잘못 구현하면 재작업 비용이 크다 |
| 기존 테스트가 이미 실패 중 | 내가 만든 실패인지 원래 실패인지 불명확 |
| 데이터 삭제·초기화 작업 | 되돌릴 수 없다 |

질문 형식:
```
@sigolmater [질문 내용]
현재 상태: <무엇까지 파악했는지>
선택지: A) ... B) ...
기다리겠습니다.
```

---

## 5. 코딩 표준

### Python
- Python 3.10+ 문법
- 함수 시그니처에 타입 힌트 필수
- 주석은 WHY가 불명확할 때만 — 코드가 설명하는 내용은 주석 금지
- 한 줄 docstring만 허용 (멀티라인 금지)
- 암호화 코드: `pycryptodome`만 사용 (`hashlib` 직접 사용 금지)

### React / JavaScript
- 함수형 컴포넌트 + hooks
- props에 PropTypes 또는 JSDoc 타입 명시
- CSS-in-JS 금지 — 기존 `.css` 파일 방식 유지
- `console.log` 디버그 코드 커밋 금지

### 공통
- `git add .` / `git add -A` 금지 — 파일을 명시적으로 지정
- `.env`, 키, 토큰, 시크릿을 커밋 금지
- `main`에 직접 푸시 금지

---

## 6. 보안 규칙 (암호화 모듈 전용)

`hangul_hybrid_aead.py` 수정 시 추가로 적용한다.

- 키 재료(`__master_key`, `session_key`)를 로그·print·반환값에 절대 포함하지 않는다
- `os.urandom()` 이외의 난수 소스 사용 금지
- `except Exception` / `except:` 사용 금지 — 예외 타입 명시
- `try` 블록은 envelope 파싱과 암호 연산을 분리해서 유지한다
- `binascii.unhexlify` 호출 시 `TypeError`까지 처리한다
- 새 암호화 primitive 도입 → **반드시** 인간 승인 후 진행

---

## 7. 막혔을 때 프로토콜

```
에러 발생
    ↓
1. 에러 메시지 전체 읽기
2. 관련 파일·함수 추적
3. 수정 시도 (최대 3회)
    ↓
3회 후에도 해결 안 됨?
    ↓
현재까지 작업 커밋 ("wip: <상황 설명>")
PR 본문에 막힌 부분 정확히 기록
Draft PR 생성 후 중단
```

에러를 무시하거나 `# TODO: fix later` 처리하고 넘어가지 않는다.

---

## 8. 검수자(사람)의 역할

Copilot이 Draft PR을 올리면 사람은 다음만 한다:

1. **기능 확인** — 요구사항대로 동작하는가
2. **보안 확인** — 암호화 변경이 있으면 `/code-review` 실행
3. **머지 결정** — Approve → Squash merge → `main`

스타일·포맷·주석 수 등 자동화로 잡을 수 있는 것은 검수하지 않는다.

---

## 9. 우선순위 원칙

1. **동작하는 코드 > 완벽한 코드** — 완성된 PR이 완벽한 초안보다 낫다
2. **테스트 통과 = 최소 기준** — 실패 상태로 PR 열지 않는다 (막힌 경우 제외)
3. **작은 PR > 큰 PR** — 하나의 Issue = 하나의 PR, 범위를 넓히지 않는다
4. **보안 코드는 보수적으로** — 불확실하면 진행 전 질문한다
5. **조용히 완료** — 불필요한 중간 보고 없이 PR로 결과물로만 말한다
