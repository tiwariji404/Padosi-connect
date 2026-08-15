package com.padosi.connect;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;

public class LoginActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        EditText etPhone = findViewById(R.id.etPhone);
        Button btnGetOTP = findViewById(R.id.btnGetOTP);

        btnGetOTP.setOnClickListener(v -> {
            if (etPhone.getText().toString().length() == 10) {
                startActivity(new Intent(this, OTPActivity.class));
            } else {
                Toast.makeText(this, "Enter valid phone number", Toast.LENGTH_SHORT).show();
            }
        });
    }
}