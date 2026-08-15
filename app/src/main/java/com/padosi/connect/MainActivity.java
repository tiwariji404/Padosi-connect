package com.padosi.connect;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Login Page ke Buttons ko connect karein
        Button btnLogin = findViewById(R.id.btnLogin);
        Button btnSignup = findViewById(R.id.btnSignup);

        // Jab Signup Button par click ho
        if (btnSignup != null) {
            btnSignup.setOnClickListener(v -> {
                // Ye line aapko Signup page par le jayegi
                Intent intent = new Intent(MainActivity.this, SignupActivity.class);
                startActivity(intent);
            });
        }

        // Jab Login Button par click ho (Abhi ye OTP page par bhej raha hai)
        if (btnLogin != null) {
            btnLogin.setOnClickListener(v -> {
                Intent intent = new Intent(MainActivity.this, LoginActivity.class);
                startActivity(intent);
            });
        }
    }
}