/*
===========================================================
 Marialei Moederdag BBQ
 config.js
===========================================================
*/

const CONFIG = {

    /*
     * Gedeeld wachtwoord
     * Verander dit naar het gewenste paswoord.
     */
    PASSWORD: "marialei2026",

    /*
     * URL van de Google Apps Script Web App.
     * Deze vullen we pas in nadat we Code.gs hebben gepubliceerd.
     *
     * Voorbeeld:
     * https://script.google.com/macros/s/xxxxxxxxxxxxxxxxxxxxxxxx/exec
     */
API_URL: "https://script.google.com/macros/s/......../exec",

    /*
     * Evenement
     */
    EVENT_NAME: "Marialei Moederdag BBQ",

    /*
     * Producten
     */
    BBQ_ITEMS: [
        "spare ribs",
        "kipfilet",
        "Hamburger",
        "gevogelte brochette",
        "steak 150g",
	"Merguez worst",
	"lamsbrazade",
	"Varkenslapje"
    ],

    /*
     * Desserts
     */
    DESSERT_ITEMS: [
        "vanille",
        "aardbei",
        "tiramisu"
    ],



    /*
     * Validatie
     */

    REQUIRE_NAME: true,

    REQUIRE_AT_LEAST_ONE_PERSON: true,

    REQUIRE_AT_LEAST_ONE_ITEM: true,

    LIMIT_DESSERTS_TO_PERSONS: true,

    /*
     * Browseropslag
     */

    AUTO_SAVE: true,

    STORAGE_KEY: "marialei-moederdag-bestelling"

};