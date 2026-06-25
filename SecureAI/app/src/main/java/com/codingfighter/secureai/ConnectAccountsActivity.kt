package com.codingfighter.secureai

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.codingfighter.secureai.databinding.ActivityConnectAccountsBinding

class ConnectAccountsActivity : AppCompatActivity() {

    private lateinit var binding: ActivityConnectAccountsBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConnectAccountsBinding.inflate(layoutInflater)
        setContentView(binding.root)

        binding.btnSaveKey.setOnClickListener {
            val apiKey = binding.etApiKey.text?.toString()?.trim().orEmpty()

            if (apiKey.isBlank()) {
                Toast.makeText(this, "API Key를 입력하세요.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            saveKeySecurely(apiKey)
            startActivity(Intent(this, AiQueryActivity::class.java))
            finish()
        }
    }

    private fun saveKeySecurely(apiKey: String) {
        SecureStore.prefs(this)
            .edit()
            .putString("OPENAI_KEY", apiKey)
            .apply()
    }
}
