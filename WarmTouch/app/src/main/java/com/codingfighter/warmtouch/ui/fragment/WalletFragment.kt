package com.codingfighter.warmtouch.ui.fragment

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import com.codingfighter.warmtouch.R
import com.codingfighter.warmtouch.data.FirestoreRepository
import com.codingfighter.warmtouch.databinding.FragmentWalletBinding
import com.codingfighter.warmtouch.ui.adapter.TransactionAdapter
import com.google.firebase.auth.FirebaseAuth
import kotlinx.coroutines.launch

class WalletFragment : Fragment() {

    private var _binding: FragmentWalletBinding? = null
    private val binding get() = _binding!!
    private val repo = FirestoreRepository()
    private val auth = FirebaseAuth.getInstance()
    private lateinit var adapter: TransactionAdapter

    override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
        _binding = FragmentWalletBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        adapter = TransactionAdapter()
        binding.rvTransactions.adapter = adapter
        loadWallet()
        binding.swipeRefresh.setOnRefreshListener { loadWallet() }
    }

    private fun loadWallet() {
        val uid = auth.currentUser?.uid ?: return
        lifecycleScope.launch {
            try {
                binding.progressBar.visibility = View.VISIBLE
                val user = repo.getUser(uid)
                user?.let {
                    binding.tvCoinBalance.text = getString(R.string.coin_format, it.warmCoin)
                    binding.tvVolunteerCount.text = getString(R.string.volunteer_count_format, it.volunteerCount)
                }
                val txList = repo.getTransactions(uid)
                adapter.submitList(txList)
                binding.tvEmpty.visibility = if (txList.isEmpty()) View.VISIBLE else View.GONE
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
