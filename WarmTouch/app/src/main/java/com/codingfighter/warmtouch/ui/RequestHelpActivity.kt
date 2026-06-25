package com.codingfighter.warmtouch.ui

import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.codingfighter.warmtouch.R
import com.codingfighter.warmtouch.data.FirestoreRepository
import com.codingfighter.warmtouch.data.model.HelpRequest
import com.codingfighter.warmtouch.databinding.ActivityRequestHelpBinding
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch

class RequestHelpActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRequestHelpBinding
    private val repo = FirestoreRepository()
    private val auth = FirebaseAuth.getInstance()

    private val categories = listOf("말벗", "장보기", "병원동행", "집안일", "교육/멘토링", "기타")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRequestHelpBinding.inflate(layoutInflater)
        setContentView(binding.root)

        supportActionBar?.title = getString(R.string.title_request_help)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        val adapter = ArrayAdapter(this, android.R.layout.simple_spinner_item, categories)
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
        binding.spinnerCategory.adapter = adapter

        binding.btnSubmit.setOnClickListener { submitRequest() }
    }

    private fun submitRequest() {
        val user = auth.currentUser ?: return
        val title = binding.etTitle.text?.toString()?.trim() ?: ""
        val description = binding.etDescription.text?.toString()?.trim() ?: ""
        val location = binding.etLocation.text?.toString()?.trim() ?: ""
        val category = categories[binding.spinnerCategory.selectedItemPosition]
        val rewardCoin = binding.sliderCoin.value.toInt()

        if (title.isEmpty() || description.isEmpty() || location.isEmpty()) {
            Toast.makeText(this, getString(R.string.error_fill_all_fields), Toast.LENGTH_SHORT).show()
            return
        }

        binding.btnSubmit.isEnabled = false
        lifecycleScope.launch {
            try {
                val request = HelpRequest(
                    requesterId = user.uid,
                    requesterName = user.displayName ?: "이름 없음",
                    requesterPhotoUrl = user.photoUrl?.toString() ?: "",
                    category = category,
                    title = title,
                    description = description,
                    location = location,
                    rewardCoin = rewardCoin
                )
                repo.createRequest(request)
                Toast.makeText(this@RequestHelpActivity, getString(R.string.request_submitted), Toast.LENGTH_SHORT).show()
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@RequestHelpActivity, "오류: ${e.message}", Toast.LENGTH_SHORT).show()
                binding.btnSubmit.isEnabled = true
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }
}
