import os
import binascii
from Crypto.Cipher import AES
from Crypto.Protocol.KDF import HKDF
from Crypto.Hash import SHA256

class HangulHybridAEAD:
    def __init__(self, hangul_seed_entropy: str):
        # Bug 2+7 fix: type check prevents non-str truthy args (e.g. 42),
        # strip() check prevents whitespace-only seeds from silently producing a fixed key
        if not isinstance(hangul_seed_entropy, str) or not hangul_seed_entropy.strip():
            raise ValueError("무결성 오류: 엔트로피 시드는 비어있지 않은 문자열이어야 합니다.")

        # Bug 5 fix: local variable — raw seed bytes not retained on the instance
        raw_bytes = hangul_seed_entropy.encode('utf-8')

        # Bug 6 fix: double-underscore triggers name mangling, restricting external attribute access
        self.__master_key = SHA256.new(raw_bytes).digest()

    def _derive_layer_keys(self, salt: bytes) -> bytes:
        return HKDF(self.__master_key, 32, salt, SHA256, context=b"Hangul-Hybrid-AEAD-v1-Context")

    def encrypt(self, plaintext: str, associated_data: str = "") -> dict:
        salt = os.urandom(16)
        nonce = os.urandom(12)
        session_key = self._derive_layer_keys(salt)
        cipher = AES.new(session_key, AES.MODE_GCM, nonce=nonce)
        if associated_data:
            cipher.update(associated_data.encode('utf-8'))
        ciphertext, tag = cipher.encrypt_and_digest(plaintext.encode('utf-8'))
        return {
            "salt": salt.hex(),
            "nonce": nonce.hex(),
            "ciphertext": ciphertext.hex(),
            "tag": tag.hex(),
            "associated_data": associated_data
        }

    def decrypt(self, envelope: dict) -> str:
        # Bug 1+4 fix: split into two try blocks so envelope parsing errors
        # (TypeError, KeyError, bad hex) are distinct from authentication failures
        try:
            salt = binascii.unhexlify(envelope["salt"])
            nonce = binascii.unhexlify(envelope["nonce"])
            ciphertext = binascii.unhexlify(envelope["ciphertext"])
            tag = binascii.unhexlify(envelope["tag"])
            associated_data = envelope.get("associated_data", "")
        except (KeyError, TypeError, ValueError) as e:
            raise ValueError("무결성 검증 실패: envelope 형식이 올바르지 않습니다.") from e

        try:
            session_key = self._derive_layer_keys(salt)
            cipher = AES.new(session_key, AES.MODE_GCM, nonce=nonce)
            if associated_data:
                cipher.update(associated_data.encode('utf-8'))
            decrypted_bytes = cipher.decrypt_and_verify(ciphertext, tag)
        except ValueError as e:
            raise ValueError("무결성 검증 실패: 데이터가 위변조되었거나 키가 일치하지 않습니다.") from e

        # Bug 3 fix: decode is outside both try blocks — UnicodeDecodeError now
        # propagates as-is, not masked as an authentication failure
        return decrypted_bytes.decode('utf-8')


# ==========================================
# [기능 증명 실행 예시 부]
# ==========================================
if __name__ == "__main__":
    print("=== Hangul-Hybrid-AEAD-v1 엔진 런타임 가동 ===")

    hangul_seed = "시골명 양면거울 무결성 철학"
    print(f"[원시 엔트로피 주입]: {hangul_seed}")

    aead_engine = HangulHybridAEAD(hangul_seed)

    secret_payload = "Pocket AI 핵심 런타임 가동 코드 오프셋 좌표"
    auth_data = "Sigol Co. Ver 1.0"

    print(f"[원본 평문 데이터]: {secret_payload}")

    encrypted_packet = aead_engine.encrypt(secret_payload, associated_data=auth_data)
    print("\n[빌드 암호화 결과 패키지 출력]:")
    for k, v in encrypted_packet.items():
        print(f"  - {k}: {v}")

    print("\n--------------------------------------------------")

    print("[복호화 엔진 가동 및 무결성 검증 중...]")
    decrypted_result = aead_engine.decrypt(encrypted_packet)
    print(f"[최종 무결성 복구 데이터]: {decrypted_result}")

    print("\n[변조 대응 시스템 테스트]: 임의로 데이터의 비트를 손상시킬 경우")
    encrypted_packet["ciphertext"] = encrypted_packet["ciphertext"][:-2] + "00"
    try:
        aead_engine.decrypt(encrypted_packet)
    except ValueError as e:
        print(f"[방어 성공 확인]: {e}")
