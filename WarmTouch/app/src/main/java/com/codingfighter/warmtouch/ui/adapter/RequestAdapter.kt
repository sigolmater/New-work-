package com.codingfighter.warmtouch.ui.adapter

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.codingfighter.warmtouch.R
import com.codingfighter.warmtouch.data.model.HelpRequest
import com.codingfighter.warmtouch.databinding.ItemRequestBinding

class RequestAdapter(
    private val onClick: (HelpRequest) -> Unit
) : ListAdapter<HelpRequest, RequestAdapter.ViewHolder>(DiffCallback) {

    inner class ViewHolder(private val binding: ItemRequestBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(request: HelpRequest) {
            binding.tvCategory.text = request.category
            binding.tvTitle.text = request.title
            binding.tvLocation.text = request.location
            binding.tvReward.text = binding.root.context.getString(R.string.coin_format, request.rewardCoin)
            binding.tvStatus.text = when (request.status) {
                "PENDING" -> binding.root.context.getString(R.string.status_pending)
                "ACCEPTED" -> binding.root.context.getString(R.string.status_accepted)
                "COMPLETED" -> binding.root.context.getString(R.string.status_completed)
                else -> request.status
            }
            binding.root.setOnClickListener { onClick(request) }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemRequestBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    companion object DiffCallback : DiffUtil.ItemCallback<HelpRequest>() {
        override fun areItemsTheSame(oldItem: HelpRequest, newItem: HelpRequest) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: HelpRequest, newItem: HelpRequest) = oldItem == newItem
    }
}
