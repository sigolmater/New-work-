package com.codingfighter.warmtouch.ui

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.codingfighter.warmtouch.R
import com.codingfighter.warmtouch.databinding.ActivityMainBinding
import com.codingfighter.warmtouch.ui.fragment.HomeFragment
import com.codingfighter.warmtouch.ui.fragment.ProfileFragment
import com.codingfighter.warmtouch.ui.fragment.VolunteerFragment
import com.codingfighter.warmtouch.ui.fragment.WalletFragment
import com.google.firebase.auth.FirebaseAuth

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        if (FirebaseAuth.getInstance().currentUser == null) {
            startActivity(Intent(this, LoginActivity::class.java))
            finish()
            return
        }

        showFragment(HomeFragment())

        binding.bottomNav.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> showFragment(HomeFragment())
                R.id.nav_volunteer -> showFragment(VolunteerFragment())
                R.id.nav_wallet -> showFragment(WalletFragment())
                R.id.nav_profile -> showFragment(ProfileFragment())
            }
            true
        }

        binding.fabRequest.setOnClickListener {
            startActivity(Intent(this, RequestHelpActivity::class.java))
        }
    }

    private fun showFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
