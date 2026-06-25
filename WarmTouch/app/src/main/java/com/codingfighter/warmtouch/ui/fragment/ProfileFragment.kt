package com.codingfighter.warmtouch.ui.fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import coil.load
import coil.transform.CircleCropTransformation
import com.codingfighter.warmtouch.R
import com.codingfighter.warmtouch.data.FirestoreRepository
import com.codingfighter.warmtouch.databinding.FragmentProfileBinding
import com.codingfighter.warmtouch.ui.LoginActivity
import com.codingfighter.warmtouch.ui.adapter.RequestAdapter
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch

class ProfileFragment : Fragment() {

    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    private val repo = FirestoreRepository()
    private val auth = FirebaseAuth.getInstance()
    private lateinit var adapter: RequestAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        adapter = RequestAdapter { }
        binding.rvMyRequests.adapter = adapter

        binding.btnLogout.setOnClickListener {
            auth.signOut()
            startActivity(Intent(requireContext(), LoginActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            })
        }

        loadProfile()
    }

    private fun loadProfile() {
        val firebaseUser = auth.currentUser ?: return
        val uid = firebaseUser.uid

        binding.tvName.text = firebaseUser.displayName ?: "이름 없음"
        binding.tvEmail.text = firebaseUser.email ?: ""
        firebaseUser.photoUrl?.let { url ->
            binding.ivAvatar.load(url) {
                transformations(CircleCropTransformation())
                placeholder(R.drawable.ic_profile)
                error(R.drawable.ic_profile)
            }
        }

        lifecycleScope.launch {
            try {
                val user = repo.getUser(uid)
                user?.let {
                    binding.tvCoinBadge.text = getString(R.string.coin_format, it.warmCoin)
                    binding.tvStats.text = getString(
                        R.string.profile_stats_format,
                        it.volunteerCount,
                        it.requestCount
                    )
                }
                val myRequests = repo.getMyRequests(uid)
                adapter.submitList(myRequests)
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "로드 실패: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
