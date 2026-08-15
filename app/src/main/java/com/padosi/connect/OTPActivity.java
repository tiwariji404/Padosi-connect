package com.padosi.connect;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.AppCompatActivity;

public class OTPActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_otp);

        Button btnVerify = findViewById(R.id.btnVerifyOTP);
        btnVerify.setOnClickListener(v -> {
            // OTP verify hone ke baad location screen zaroori hai
            startActivity(new Intent(this, LocationActivity.class));
            finish();
        });
    }
}