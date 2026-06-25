package com.codingfighter.warmtouch.data

import com.codingfighter.warmtouch.data.model.CoinTransaction
import com.codingfighter.warmtouch.data.model.HelpRequest
import com.codingfighter.warmtouch.data.model.User
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.Query
import kotlinx.coroutines.tasks.await

class FirestoreRepository {

    private val db = FirebaseFirestore.getInstance()
    private val usersCol = db.collection("users")
    private val requestsCol = db.collection("helpRequests")

    suspend fun getOrCreateUser(uid: String, name: String, email: String, photoUrl: String): User {
        val doc = usersCol.document(uid).get().await()
        return if (doc.exists()) {
            doc.toObject(User::class.java) ?: User(uid, name, email, photoUrl)
        } else {
            val user = User(uid, name, email, photoUrl)
            usersCol.document(uid).set(user).await()
            user
        }
    }

    suspend fun getUser(uid: String): User? {
        val doc = usersCol.document(uid).get().await()
        return if (doc.exists()) doc.toObject(User::class.java) else null
    }

    suspend fun getPendingRequests(): List<HelpRequest> {
        return requestsCol
            .whereEqualTo("status", "PENDING")
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .get()
            .await()
            .toObjects(HelpRequest::class.java)
    }

    suspend fun getMyRequests(uid: String): List<HelpRequest> {
        return requestsCol
            .whereEqualTo("requesterId", uid)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .get()
            .await()
            .toObjects(HelpRequest::class.java)
    }

    suspend fun getMyVolunteers(uid: String): List<HelpRequest> {
        return requestsCol
            .whereEqualTo("acceptedVolunteerId", uid)
            .orderBy("createdAt", Query.Direction.DESCENDING)
            .get()
            .await()
            .toObjects(HelpRequest::class.java)
    }

    suspend fun createRequest(request: HelpRequest): String {
        val ref = requestsCol.document()
        val withId = request.copy(id = ref.id)
        ref.set(withId).await()
        return ref.id
    }

    suspend fun acceptRequest(requestId: String, volunteerId: String, volunteerName: String) {
        requestsCol.document(requestId).update(
            mapOf(
                "status" to "ACCEPTED",
                "acceptedVolunteerId" to volunteerId,
                "acceptedVolunteerName" to volunteerName
            )
        ).await()
    }

    suspend fun completeRequest(requestId: String, volunteerId: String, rewardCoin: Int, description: String) {
        val batch = db.batch()
        batch.update(requestsCol.document(requestId), "status", "COMPLETED")

        val volunteerRef = usersCol.document(volunteerId)
        val volunteerDoc = volunteerRef.get().await()
        val currentCoin = volunteerDoc.getLong("warmCoin")?.toInt() ?: 0
        val currentCount = volunteerDoc.getLong("volunteerCount")?.toInt() ?: 0
        batch.update(volunteerRef, mapOf(
            "warmCoin" to currentCoin + rewardCoin,
            "volunteerCount" to currentCount + 1
        ))

        val txRef = usersCol.document(volunteerId).collection("transactions").document()
        val tx = CoinTransaction(
            id = txRef.id,
            type = "EARN",
            amount = rewardCoin,
            description = description,
            timestamp = System.currentTimeMillis()
        )
        batch.set(txRef, tx)
        batch.commit().await()
    }

    suspend fun getTransactions(uid: String): List<CoinTransaction> {
        return usersCol.document(uid)
            .collection("transactions")
            .orderBy("timestamp", Query.Direction.DESCENDING)
            .get()
            .await()
            .toObjects(CoinTransaction::class.java)
    }

    suspend fun spendCoin(uid: String, amount: Int, description: String) {
        val batch = db.batch()
        val userRef = usersCol.document(uid)
        val userDoc = userRef.get().await()
        val currentCoin = userDoc.getLong("warmCoin")?.toInt() ?: 0
        batch.update(userRef, "warmCoin", currentCoin - amount)

        val txRef = usersCol.document(uid).collection("transactions").document()
        val tx = CoinTransaction(
            id = txRef.id,
            type = "SPEND",
            amount = amount,
            description = description,
            timestamp = System.currentTimeMillis()
        )
        batch.set(txRef, tx)
        batch.commit().await()
    }
}
