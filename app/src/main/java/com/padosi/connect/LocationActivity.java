package com.padosi.connect;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import com.padosi.connect.R; // Ye line check karein

public class LocationActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_location);

        // Agar XML mein ID sahi hai, toh ye line ab error nahi degi
        Button btnDetect = findViewById(R.id.btnDetectLocation);

        if (btnDetect != null) {
            btnDetect.setOnClickListener(v -> {
                Toast.makeText(this, "Location dhund rahe hain...", Toast.LENGTH_SHORT).show();

                // Dashboard par bhejne ke liye
                Intent intent = new Intent(LocationActivity.this, DashboardActivity.class);
                startActivity(intent);
                finish();
            });
        }
    }
}