package com.codingfighter.warmtouch.ui

import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.codingfighter.warmtouch.R
import com.codingfighter.warmtouch.data.FirestoreRepository
import com.codingfighter.warmtouch.data.model.HelpRequest
import com.codingfighter.warmtouch.databinding.ActivityRequestDetailBinding
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch

class RequestDetailActivity : AppCompatActivity() {

    private lateinit var binding: ActivityRequestDetailBinding
    private val repo = FirestoreRepository()
    private val auth = FirebaseAuth.getInstance()
    private var request: HelpRequest? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRequestDetailBinding.inflate(layoutInflater)
        setContentView(binding.root)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        @Suppress("DEPRECATION", "UNCHECKED_CAST")
        request = intent.getSerializableExtra(EXTRA_REQUEST) as? HelpRequest
        request?.let { bindRequest(it) }
    }

    private fun bindRequest(r: HelpRequest) {
        supportActionBar?.title = r.category
        binding.tvTitle.text = r.title
        binding.tvDescription.text = r.description
        binding.tvLocation.text = r.location
        binding.tvCategory.text = r.category
        binding.tvReward.text = getString(R.string.coin_format, r.rewardCoin)
        binding.tvRequester.text = r.requesterName
        binding.tvStatus.text = when (r.status) {
            "PENDING" -> getString(R.string.status_pending)
            "ACCEPTED" -> getString(R.string.status_accepted)
            "COMPLETED" -> getString(R.string.status_completed)
            else -> r.status
        }

        val uid = auth.currentUser?.uid ?: return

        when {
            r.status == "PENDING" && r.requesterId != uid -> {
                binding.btnAction.text = getString(R.string.btn_accept)
                binding.btnAction.visibility = View.VISIBLE
                binding.btnAction.setOnClickListener { acceptRequest(r, uid) }
            }
            r.status == "ACCEPTED" && r.acceptedVolunteerId == uid -> {
                binding.btnAction.text = getString(R.string.btn_complete)
                binding.btnAction.visibility = View.VISIBLE
                binding.btnAction.setOnClickListener { completeRequest(r, uid) }
            }
            else -> binding.btnAction.visibility = View.GONE
        }
    }

    private fun acceptRequest(r: HelpRequest, uid: String) {
        val volunteerName = auth.currentUser?.displayName ?: "봉사자"
        binding.btnAction.isEnabled = false
        lifecycleScope.launch {
            try {
                repo.acceptRequest(r.id, uid, volunteerName)
                Toast.makeText(this@RequestDetailActivity, getString(R.string.accepted_message), Toast.LENGTH_SHORT).show()
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@RequestDetailActivity, "오류: ${e.message}", Toast.LENGTH_SHORT).show()
                binding.btnAction.isEnabled = true
            }
        }
    }

    private fun completeRequest(r: HelpRequest, uid: String) {
        binding.btnAction.isEnabled = false
        lifecycleScope.launch {
            try {
                repo.completeRequest(r.id, uid, r.rewardCoin, "${r.title} 봉사 완료")
                Toast.makeText(
                    this@RequestDetailActivity,
                    getString(R.string.completed_message, r.rewardCoin),
                    Toast.LENGTH_LONG
                ).show()
                finish()
            } catch (e: Exception) {
                Toast.makeText(this@RequestDetailActivity, "오류: ${e.message}", Toast.LENGTH_SHORT).show()
                binding.btnAction.isEnabled = true
            }
        }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressedDispatcher.onBackPressed()
        return true
    }

    companion object {
        const val EXTRA_REQUEST = "extra_request"
    }
}
