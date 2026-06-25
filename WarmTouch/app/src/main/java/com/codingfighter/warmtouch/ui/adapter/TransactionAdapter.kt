package com.codingfighter.warmtouch.ui.adapter

import android.graphics.Color
import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.codingfighter.warmtouch.data.model.CoinTransaction
import com.codingfighter.warmtouch.databinding.ItemTransactionBinding
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class TransactionAdapter : ListAdapter<CoinTransaction, TransactionAdapter.ViewHolder>(DiffCallback) {

    private val dateFormat = SimpleDateFormat("MM.dd HH:mm", Locale.KOREAN)

    inner class ViewHolder(private val binding: ItemTransactionBinding) :
        RecyclerView.ViewHolder(binding.root) {

        fun bind(tx: CoinTransaction) {
            binding.tvDescription.text = tx.description
            binding.tvDate.text = dateFormat.format(Date(tx.timestamp))
            if (tx.type == "EARN") {
                binding.tvAmount.text = "+${tx.amount} 온기코인"
                binding.tvAmount.setTextColor(Color.parseColor("#FF7043"))
            } else {
                binding.tvAmount.text = "-${tx.amount} 온기코인"
                binding.tvAmount.setTextColor(Color.parseColor("#757575"))
            }
        }
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val binding = ItemTransactionBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    companion object DiffCallback : DiffUtil.ItemCallback<CoinTransaction>() {
        override fun areItemsTheSame(oldItem: CoinTransaction, newItem: CoinTransaction) = oldItem.id == newItem.id
        override fun areContentsTheSame(oldItem: CoinTransaction, newItem: CoinTransaction) = oldItem == newItem
    }
}
