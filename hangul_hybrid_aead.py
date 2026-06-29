import os
import binascii
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

class HangulHybridAEAD:
    def __init__(self, hangul_seed_entropy: str):
        """
        [1원칙] 기술은 설명되어야 하고, 기능은 증명되어야 한다.
        한글 기반의 고유 고차원 엔트로피 키를 가상학적 마스터 키로 변환합니다.
        """
        if not hangul_seed_entropy:
            raise ValueError("무결성 오류: 엔트로피 시드 값이 비어 있습니다.")

        # 한글 문자열을 바이트 벡터로 변환 (UTF-8 인코딩을 통한 원시 비트 나열)
        self.raw_bytes = hangul_seed_entropy.encode('utf-8')

        # 1차 해시 분산 연산 (노이즈가 섞이지 않는 무결한 공간 생성)
        self.master_key = SHA256.new(self.raw_bytes).digest()

    def _derive_layer_keys(self, salt: bytes) -> bytes:
        """
        HKDF(HMAC-based Extract-and-Expand Key Derivation Function)를 통한
        2차 하이브리드 키 추출 레이어 생성 (물리적 안전성 확보)
        """
        return HKDF(self.master_key, 32, salt, SHA256, context=b"Hangul-Hybrid-AEAD-v1-Context")

    def encrypt(self, plaintext: str, associated_data: str = "") -> dict:
        """
        무결성 검증 기능을 포함한 인증된 암호화 (AEAD) 수행
        """
        # 암호학적으로 안전한 난수 기반 솔트(Salt) 및 논스(Nonce) 생성
        salt = os.urandom(16)
        nonce = os.urandom(12) # AES-GCM 표준 12바이트 물리 논스

        # 하이브리드 세션 키 유도
        session_key = self._derive_layer_keys(salt)

        # AES-GCM 모드 가동 (인증 데이터 및 무결성 태그 자동 계산)
        cipher = AES.new(session_key, AES.MODE_GCM, nonce=nonce)

        if associated_data:
            cipher.update(associated_data.encode('utf-8'))

        ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode('utf-8'))

        # 가상에서 구축된 실상의 암호화 패키지 반환 (16진수 문자열 인코딩)
        return {
            "salt": binascii.hexlify(salt).decode('utf-8'),
            "nonce": binascii.hexlify(nonce).decode('utf-8'),
            "ciphertext": binascii.hexlify(ciphertext).decode('utf-8'),
            "tag": binascii.hexlify(tag).decode('utf-8'),
            "associated_data": associated_data
        }

    def decrypt(self, envelope: dict) -> str:
        """
        물리적·수학적 엄밀성을 기반으로 위변조를 차단하는 무결성 복호화
        """
        try:
            # 16진수 스트림을 물리 비트 데이터로 역변환
            salt = binascii.unhexlify(envelope["salt"])
            nonce = binascii.unhexlify(envelope["nonce"])
            ciphertext = binascii.unhexlify(envelope["ciphertext"])
            tag = binascii.unhexlify(envelope["tag"])
            associated_data = envelope.get("associated_data", "")

            # 암호화 당시 사용된 솔트로 세션 키 동일 복원
            session_key = self._derive_layer_keys(salt)

            # 복호화 및 검증 엔진 가동
            cipher = AES.new(session_key, AES.MODE_GCM, nonce=nonce)
            if associated_data:
                cipher.update(associated_data.encode('utf-8'))

            # 복호화 수행 및 태그 무결성 검증 (오차나 변조가 있다면 여기서 즉시 에러 발생)
            decrypted_bytes = cipher.decrypt_and_verify(ciphertext, tag)
            return decrypted_bytes.decode('utf-8')

        except (ValueError, KeyError) as e:
            raise ValueError("무결성 검증 실패: 데이터가 위변조되었거나 키가 일치하지 않습니다.") from e


# ==========================================
# [기능 증명 실행 예시 부]
# ==========================================
if __name__ == "__main__":
    print("=== Hangul-Hybrid-AEAD-v1 엔진 런타임 가동 ===")

    # 1. 고유 한글 시맨틱 시드 정의 (고차원 벡터 엔트로피)
    hangul_seed = "시골명 양면거울 무결성 철학"
    print(f"[원시 엔트로피 주입]: {hangul_seed}")

    # Engine 초기화
    aead_engine = HangulHybridAEAD(hangul_seed)

    # 2. 암호화할 원본 데이터 및 바인딩할 검증 데이터(AD)
    secret_payload = "Pocket AI 핵심 런타임 가동 코드 오프셋 좌표"
    auth_data = "Sigol Co. Ver 1.0"

    print(f"[원본 평문 데이터]: {secret_payload}")

    # 3. 암호화 연산 수행 (가상에서 실상 구축)
    encrypted_packet = aead_engine.encrypt(secret_payload, associated_data=auth_data)
    print("\n[빌드 암호화 결과 패키지 출력]:")
    for k, v in encrypted_packet.items():
        print(f"  - {k}: {v}")

    print("\n--------------------------------------------------")

    # 4. 복호화 연산 수행 (무결성 검증 및 복원)
    print("[복호화 엔진 가동 및 무결성 검증 중...]")
    decrypted_result = aead_engine.decrypt(encrypted_packet)
    print(f"[최종 무결성 복구 데이터]: {decrypted_result}")

    # 5. 오차 검증 테스트 (강제 변조 상황 가정)
    print("\n[변조 대응 시스템 테스트]: 임의로 데이터의 비트를 손상시킬 경우")
    encrypted_packet["ciphertext"] = encrypted_packet["ciphertext"][:-2] + "00" # 강제 조작
    try:
        aead_engine.decrypt(encrypted_packet)
    except ValueError as e:
        print(f"[방어 성공 확인]: {e}")
