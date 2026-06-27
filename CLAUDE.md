# CLAUDE.md — sigolmater 협업 가이드

> 새 세션을 시작할 때 이 파일을 먼저 읽어라.
> 묻지 말고 만들어라. 비판보다 실행이 우선이다.

---

## 나는 누구인가

- GitHub: sigolmater
- 주요 저장소: `sigolmater/new-work-` (현재), `sigolmater/-crazy` (별도 세션 필요)
- 작업 스타일: 아이디어를 말하면 바로 만들어준다. 코드 리뷰는 요청할 때만.

---

## 활성 프로젝트

### 1. SecureAI (완료)
- **경로:** `/home/user/New-work-/SecureAI/`
- **패키지:** `com.codingfighter.secureai`
- **브랜치:** `claude/secureai-android-structure-8bvpmt`
- **설명:** Google 로그인 + EncryptedSharedPreferences에 OpenAI 키 저장 + GPT-4o-mini 채팅 + SHA-256 감사 로그
- **상태:** 코드 완료. `google-services.json` 추가 후 빌드 가능.
- **남은 작업:** 사용자가 실제 Firebase UID를 `MainActivity.kt:29`의 `allowedUid`에 입력해야 함.

### 2. WarmTouch — 따뜻한 손길 플랫폼 (완료)
- **경로:** `/home/user/New-work-/WarmTouch/`
- **패키지:** `com.codingfighter.warmtouch`
- **브랜치:** `claude/secureai-android-structure-8bvpmt`
- **설명:** 봉사 마켓플레이스 앱. 도움 요청 → 봉사자 수락 → 완료 시 온기코인 지급.
- **기술 스택:** Firebase Auth + Firestore, Material Design 3(오렌지 테마), BottomNavigationView 4탭
- **상태:** 코드 완료. `google-services.json` + Firestore 인덱스 설정 필요.
- **알려진 이슈 (요청 시 수정):**
  - Firestore 복합 인덱스 미구성 → 목록 쿼리 실패
  - `completeRequest()` 레이스 컨디션
  - `spendCoin()` 잔액 음수 허용

### 3. -crazy 저장소 작업
- **저장소:** `sigolmater/-crazy`
- **브랜치:** `claude/nested-perceptron-ai-011CUhqeBy2pkkBLNg3HAqSP`
- **관련 PR:** #4
- **이 세션에서는 접근 불가** — 해당 저장소로 별도 세션을 열어야 함.
- **필요 파일:** `sigol_fleet_v6.py` (내용 미전달 — 사용자가 내용 제공 필요)

---

## 협업 규칙

### Claude는 이렇게 행동한다
1. **묻기 전에 만든다.** 아이디어를 받으면 바로 코드로 구현한다.
2. **비판은 요청할 때만.** `/code-review` 명령을 직접 요청할 때만 문제점을 나열한다.
3. **막히면 이유를 한 줄로.** 길게 설명하지 않는다.
4. **완료 후 다음 할 일을 제안한다.**

### 자주 쓰는 패턴
```
# 새 기능 추가 요청
"[기능명] 만들어줘" → 바로 코드 작성 + 커밋 + 푸시

# 파일 만들어달라
"[파일명] 만들어줘, 내용은 [설명]" → 즉시 생성

# 리뷰 요청
"리뷰 검토해줘" → /code-review 실행
```

---

## 저장소 구조

```
New-work-/
├── CLAUDE.md          ← 지금 이 파일 (세션 시작마다 읽기)
├── WORK_LOG.md        ← 진행 중 작업 로그
├── SecureAI/          ← Android 프로젝트 #1
├── WarmTouch/         ← Android 프로젝트 #2
└── src/               ← 기존 콘텐츠 툴 코드
```

---

## 세션 간 인계 방법

새 세션을 열면:
1. 이 `CLAUDE.md`를 자동으로 읽음
2. `WORK_LOG.md`로 마지막 작업 확인
3. 이어서 바로 진행

---

## Git 기본 설정

- **기본 브랜치:** `claude/secureai-android-structure-8bvpmt`
- **푸시 명령:** `git push -u origin <브랜치명>`
- **커밋 메시지 언어:** 영문 (제목) + 한글 설명 혼용 가능

---

## 빠른 참조

| 하고 싶은 것 | 말하면 되는 것 |
|---|---|
| 기능 추가 | "~~ 추가해줘" |
| 파일 생성 | "~~.py 만들어줘" |
| 코드 검토 | "리뷰 검토해줘" |
| 커밋/푸시 | "커밋하고 푸시해줘" |
| 이전 작업 확인 | "지금 뭐 하던 중이야?" |
