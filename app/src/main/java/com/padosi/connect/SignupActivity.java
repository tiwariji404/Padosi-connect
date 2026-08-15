package com.padosi.connect;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class SignupActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        // Matching ID from activity_signup.xml (btnNext)
        Button btnRegister = findViewById(R.id.btnNext);

        if (btnRegister != null) {
            btnRegister.setOnClickListener(v -> {
                Toast.makeText(this, "Proceeding to Verification...", Toast.LENGTH_SHORT).show();
                // If you want it to go to OTP after signup:
                startActivity(new Intent(this, OTPActivity.class));
            });
        }
    }
}