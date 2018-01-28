package com.example.ken_nb_1.myapplication1;

import android.content.DialogInterface;
import android.support.v7.app.AlertDialog;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

public class MainActivity extends AppCompatActivity {

    Player player1, player2;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        TextView totalPoints = findViewById(R.id.total);
        totalPoints.setText("N/A");

        player1 = new Player();
        player2 = new Player();

        setView();
    }
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        settingHandler();
        return super.onOptionsItemSelected(item);
    }

    public void addPointHandler(View view) {
        switch (view.getId()) {
            case R.id.player1_5:
                player1.add(5);
                break;
            case R.id.player1_10:
                player1.add(10);
                break;
            case R.id.player1_20:
                player1.add(20);
                break;
            case R.id.player2_5:
                player2.add(5);
                break;
            case R.id.player2_10:
                player2.add(10);
                break;
            case R.id.player2_20:
                player2.add(20);
                break;
            case R.id.stud1:
                player1.showHand();
                break;
            case R.id.stud2:
                player2.showHand();
                break;
            case R.id.button_win1:
                player1.win();
                break;
            case R.id.button_win2:
                player2.win();
                break;
        }
        setView();
    }

    public void winHandler(View view) {
        if (view.getId() == R.id.button_win1) {
            player1.win();
            player2.clear(); // clear hits
        }
        else {
            player2.win();
            player1.clear();
        }
        setView();
    }

    public void settingHandler() {
        LayoutInflater inflater = LayoutInflater.from(MainActivity.this);
        final View v = inflater.inflate(R.layout.dialog_layout, null);
        AlertDialog.Builder dialog = new AlertDialog.Builder(MainActivity.this);
        new AlertDialog.Builder(MainActivity.this)
                .setTitle("輸入起始籌碼:")
                .setView(v)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        EditText pointText = v.findViewById(R.id.editText1);
                        try {
                            Player.setStartPointChips(Integer.parseInt(pointText.getText().toString()));
                        }
                        catch (NumberFormatException e) {
                            return;
                        }
                        player1.resetPlayer();
                        player2.resetPlayer();
                        setView();
                    }
                })
                .show();
    }
    public void setView() {
        TextView chips = findViewById(R.id.player1_chips);
        chips.setText(player1.getChips());
        TextView chips2 = findViewById(R.id.player2_chips);
        chips2.setText(player2.getChips());

        TextView hits1 = findViewById(R.id.hits1);
        hits1.setText(player1.getHits());
        TextView hits2 = findViewById(R.id.hits2);
        hits2.setText(player2.getHits());

        TextView total = findViewById(R.id.total);
        total.setText(Player.getChipsOnTable());
    }
}
