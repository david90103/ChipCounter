package com.example.ken_nb_1.myapplication1;

public class Player {
    private static int chipsOnTable;
    private static int startPointChips;
    private int chips;
    private int hits;

    Player() {
        this.chips = startPointChips;
        this.hits = 0;
    }
    public static void setStartPointChips(int n) {
        startPointChips = n;
    }
    public void resetPlayer() {
        this.chips = startPointChips;
        this.hits = 0;
    }
    public void add(int n) {
        if (this.chips - n > -1) {
            this.chips -= n;
            chipsOnTable += n;
            this.hits += n;
        }
    }
    public void win() {
        this.chips += chipsOnTable;
        chipsOnTable = 0;
        this.hits = 0;
    }
    public void showHand(){
        chipsOnTable += this.chips;
        this.hits += this.chips;
        this.chips = 0;
    }
    public static String getChipsOnTable() {
        return "" + chipsOnTable;
    }
    public String getChips() {
        return "" + this.chips;
    }
    public String getHits() {
        return "+" + this.hits;
    }
    public void clear() {
        this.hits = 0;
    }
}
