package com.codingfighter.secureai

import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import com.codingfighter.secureai.databinding.ActivityAiQueryBinding
import okhttp3.Call
import okhttp3.Callback
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import okhttp3.Response
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class AiQueryActivity : AppCompatActivity() {

    private lateinit var binding: ActivityAiQueryBinding
    private val client = OkHttpClient()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityAiQueryBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnQuery.setOnClickListener {
            val prompt = binding.etPrompt.text?.toString()?.trim().orEmpty()
            if (prompt.isNotBlank()) {
                toggleLoading(true)
                callMirrorEngine(prompt)
            }
        }
    }

    private fun toggleLoading(isLoading: Boolean) {
        runOnUiThread {
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
            binding.btnQuery.isEnabled = !isLoading
        }
    }

    private fun callMirrorEngine(prompt: String) {
        val apiKey = SecureStore.prefs(this).getString("OPENAI_KEY", "").orEmpty()

        if (apiKey.isBlank()) {
            binding.tvResult.text = "저장된 API Key가 없습니다."
            toggleLoading(false)
            return
        }

        val messages = JSONArray().apply {
            put(JSONObject().apply {
                put("role", "system")
                put(
                    "content",
                    "You are Mirror Engine v3. 1. Chaos Field exploration 2. Resonance filtering 3. Multiverse Grid stabilization."
                )
            })
            put(JSONObject().apply {
                put("role", "user")
                put("content", prompt)
            })
        }

        val jsonBody = JSONObject().apply {
            put("model", "gpt-4o-mini")
            put("messages", messages)
        }

        val request = Request.Builder()
            .url("https://api.openai.com/v1/chat/completions")
            .addHeader("Authorization", "Bearer $apiKey")
            .addHeader("Content-Type", "application/json")
            .post(
                jsonBody.toString().toRequestBody("application/json".toMediaType())
            )
            .build()

        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                saveAuditLog("ENGINE_FAILURE", e.message ?: "Unknown network error")
                runOnUiThread {
                    binding.tvResult.text = "네트워크 실패: ${e.message}"
                    toggleLoading(false)
                }
            }

            override fun onResponse(call: Call, response: Response) {
                response.use { res ->
                    val bodyString = res.body?.string().orEmpty()

                    if (!res.isSuccessful) {
                        saveAuditLog("ENGINE_HTTP_${res.code}", bodyString.take(1000))
                        runOnUiThread {
                            binding.tvResult.text = "API 오류(${res.code}): $bodyString"
                            toggleLoading(false)
                        }
                        return
                    }

                    try {
                        val responseJson = JSONObject(bodyString)
                        val content = responseJson
                            .optJSONArray("choices")
                            ?.optJSONObject(0)
                            ?.optJSONObject("message")
                            ?.optString("content")
                            .orEmpty()

                        if (content.isBlank()) {
                            saveAuditLog("ENGINE_EMPTY_CONTENT", bodyString.take(1000))
                            runOnUiThread {
                                binding.tvResult.text = "응답은 왔지만 content가 비어 있습니다."
                                toggleLoading(false)
                            }
                            return
                        }

                        val responseSha256 = sha256Hex(content)
                        saveAuditLog(
                            "MIRROR_STABILIZED",
                            "response_sha256=$responseSha256"
                        )

                        runOnUiThread {
                            binding.tvResult.text = content
                            toggleLoading(false)
                        }
                    } catch (e: Exception) {
                        saveAuditLog("ENGINE_PARSE_FAILURE", e.message ?: "Unknown parse error")
                        runOnUiThread {
                            binding.tvResult.text = "응답 파싱 실패: ${e.message}"
                            toggleLoading(false)
                        }
                    }
                }
            }
        })
    }

    private fun saveAuditLog(action: String, detail: String) {
        val timestamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault())
            .format(Date())

        val rawData = "$timestamp|$action|$detail|engine_v3"
        val integrityHash = sha256Hex(rawData)
        val finalLog = "$rawData|$integrityHash\n"

        try {
            val dir = File(filesDir, "audit_logs")
            if (!dir.exists()) dir.mkdirs()

            val file = File(dir, "LOG_$timestamp.csv")
            FileOutputStream(file).use {
                it.write(finalLog.toByteArray())
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun sha256Hex(input: String): String {
        return MessageDigest.getInstance("SHA-256")
            .digest(input.toByteArray())
            .joinToString("") { "%02x".format(it) }
    }
}
