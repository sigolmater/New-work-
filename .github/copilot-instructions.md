# Copilot Instructions — sigolmater/New-work-

## 프로젝트 개요

레이 트레이싱 시뮬레이션 + 엔터테이너 콘텐츠 킷 + 한글 기반 암호화 모듈이 결합된 멀티도메인 레포.

| 레이어 | 기술 | 진입점 |
|--------|------|--------|
| 시뮬레이션 백엔드 | Python 3 | `run.py`, `tests.py`, `plot.py` |
| 인터랙티브 프론트엔드 | React 18 | `src/` |
| 암호화 모듈 | Python / pycryptodome | `hangul_hybrid_aead.py` |
| 콘텐츠 킷 | 텍스트/JSON | `RUNBOOK.md`, `obs_scenes.json` 등 |

---

## 자율 작업 워크플로우

Copilot은 아래 순서를 **반드시** 따른다. 인간 개입 없이 Issue → Draft PR까지 완료한다.

```
1. GitHub Issue 읽기 → 요구사항 파악
2. feat/<짧은-설명> 브랜치 생성
3. 구현 → 테스트 실행 → 통과 확인
4. Draft PR 생성 (체크리스트 포함)
5. 중단 — 사람이 PR 검수 후 머지 결정
```

**절대 main에 직접 푸시하지 않는다.**

---

## 브랜치 & 커밋 규칙

```
브랜치: feat/<설명>  |  fix/<설명>  |  refactor/<설명>  |  security/<설명>
커밋:   feat: 한 줄 설명
        fix: 한 줄 설명
        security: 한 줄 설명
```

커밋 메시지는 **한국어 또는 영어** 모두 허용. 무엇을 바꿨는지가 아니라 **왜** 바꿨는지를 적는다.

---

## 코딩 표준

### Python
- Python 3.10+ 문법 사용
- 타입 힌트 사용 (함수 시그니처)
- 주석은 **WHY가 불명확할 때만** 작성 — 코드가 설명하는 것은 주석 금지
- 멀티라인 docstring 금지 — 한 줄 요약만 허용
- 암호화 코드는 `pycryptodome` 라이브러리만 사용 (hashlib 직접 사용 금지)

### React / JavaScript
- 함수형 컴포넌트 + hooks 사용
- props에 PropTypes 또는 JSDoc 타입 명시
- CSS-in-JS 금지 — 기존 `.css` 파일 방식 유지

---

## 테스트 요구사항

PR 생성 전 반드시 실행하고 결과를 PR 본문에 첨부한다.

```bash
# Python 테스트
python tests.py

# React 테스트
npm test -- --watchAll=false
```

테스트 실패 상태로 PR을 열지 않는다. 테스트가 없는 새 기능은 테스트를 함께 작성한다.

---

## 보안 규칙 (암호화 모듈)

`hangul_hybrid_aead.py` 또는 암호화 관련 코드 수정 시 추가 규칙:

- 키 재료(`master_key`, `session_key`, `raw_bytes`)를 로그, print, 반환값에 절대 포함하지 않는다
- `os.urandom()` 이외의 난수 소스 사용 금지
- `except Exception` 또는 `except:` 사용 금지 — 예외를 명시적으로 나열한다
- 새 암호화 primitive 도입 시 반드시 Issue에 사유 기재 후 인간 승인 필요
- `binascii.unhexlify` 호출은 항상 `binascii.Error`와 `TypeError`까지 처리한다

---

## PR 템플릿 (매 PR마다 준수)

```markdown
## 변경 요약
- (변경 내용 bullet)

## 연결된 Issue
closes #<번호>

## 테스트 결과
- [ ] python tests.py 통과
- [ ] npm test 통과
- [ ] 수동 확인 항목: <내용>

## 보안 영향
- 암호화 코드 변경 여부: Yes / No
- 키 재료 노출 위험: None / Low / Review Required

## 검수자 확인 요청 사항
- (검수자가 특히 봐야 할 부분)
```

---

## 자율 허용 범위 vs 인간 승인 필요

| 작업 | Copilot 단독 | 인간 승인 필요 |
|------|-------------|--------------|
| 버그 수정 (기존 테스트 있음) | ✅ | — |
| 새 유틸리티 함수 추가 | ✅ | — |
| React UI 컴포넌트 수정 | ✅ | — |
| 시뮬레이션 파라미터 조정 | ✅ | — |
| 암호화 알고리즘 변경 | ❌ | ✅ 필수 |
| 새 외부 라이브러리 추가 | ❌ | ✅ 필수 |
| main 브랜치 직접 수정 | ❌ | ❌ 금지 |
| CI/CD 파이프라인 수정 | ❌ | ✅ 필수 |
| 보안 관련 설정 변경 | ❌ | ✅ 필수 |

---

## 검수자(사람)의 역할

Copilot이 Draft PR을 열면 검수자는 다음만 확인한다:

1. **기능 정확성** — 요구사항 대로 동작하는가
2. **보안 영향** — 암호화 코드 변경이 있으면 Claude Code `/code-review` 실행
3. **테스트 충분성** — 엣지 케이스가 커버되는가
4. **머지 결정** — Approve → Squash merge → `main`

코드 스타일, 포맷, 주석 수 등 자동화로 잡을 수 있는 것은 검수 대상이 아니다.

---

## 우선순위 원칙

1. **동작하는 코드 > 완벽한 코드** — 완성된 PR이 완벽한 초안보다 낫다
2. **테스트 통과 = 최소 기준** — 통과 안 하면 Draft 유지
3. **보안 코드는 보수적으로** — 불확실하면 Issue에 질문 남기고 대기
4. **작은 PR이 큰 PR보다 낫다** — 하나의 Issue = 하나의 PR
