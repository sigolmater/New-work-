package com.codingfighter.warmtouch.ui.fragment

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.codingfighter.warmtouch.data.FirestoreRepository
import com.codingfighter.warmtouch.databinding.FragmentVolunteerBinding
import com.codingfighter.warmtouch.ui.RequestDetailActivity
import com.codingfighter.warmtouch.ui.adapter.RequestAdapter
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch

class VolunteerFragment : Fragment() {

    private var _binding: FragmentVolunteerBinding? = null
    private val binding get() = _binding!!
    private val repo = FirestoreRepository()
    private val auth = FirebaseAuth.getInstance()
    private lateinit var adapter: RequestAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentVolunteerBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        adapter = RequestAdapter { request ->
            val intent = Intent(requireContext(), RequestDetailActivity::class.java)
            intent.putExtra(RequestDetailActivity.EXTRA_REQUEST, request)
            startActivity(intent)
        }
        binding.rvMyVolunteers.adapter = adapter
        loadVolunteers()
        binding.swipeRefresh.setOnRefreshListener { loadVolunteers() }
    }

    private fun loadVolunteers() {
        val uid = auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            try {
                binding.progressBar.visibility = View.VISIBLE
                val list = repo.getMyVolunteers(uid)
                adapter.submitList(list)
                binding.tvEmpty.visibility = if (list.isEmpty()) View.VISIBLE else View.GONE
            } catch (e: Exception) {
                Toast.makeText(requireContext(), "로드 실패: ${e.message}", Toast.LENGTH_SHORT).show()
            } finally {
                binding.progressBar.visibility = View.GONE
                binding.swipeRefresh.isRefreshing = false
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
