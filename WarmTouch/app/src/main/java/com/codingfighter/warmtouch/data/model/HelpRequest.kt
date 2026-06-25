package com.codingfighter.warmtouch.data.model

import java.io.Serializable

data class HelpRequest(
    val id: String = "",
    val requesterId: String = "",
    val requesterName: String = "",
    val requesterPhotoUrl: String = "",
    val category: String = "",
    val title: String = "",
    val description: String = "",
    val location: String = "",
    val status: String = "PENDING",
    val rewardCoin: Int = 20,
    val acceptedVolunteerId: String = "",
    val acceptedVolunteerName: String = "",
    val createdAt: Long = System.currentTimeMillis()
) : Serializable
