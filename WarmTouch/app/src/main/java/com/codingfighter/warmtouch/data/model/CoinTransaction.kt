package com.codingfighter.warmtouch.data.model

data class CoinTransaction(
    val id: String = "",
    val type: String = "EARN",
    val amount: Int = 0,
    val description: String = "",
    val timestamp: Long = System.currentTimeMillis()
)
