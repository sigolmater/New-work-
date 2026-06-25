package com.codingfighter.warmtouch.data.model

data class User(
    val uid: String = "",
    val name: String = "",
    val email: String = "",
    val photoUrl: String = "",
    val warmCoin: Int = 100,
    val totalHours: Int = 0,
    val volunteerCount: Int = 0,
    val requestCount: Int = 0
)
