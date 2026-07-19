/*
============================================================
 Marialei Moederdag BBQ
 script.js
 Deel 1/3
============================================================
*/

document.addEventListener("DOMContentLoaded", init);

function init() {

    setupLogin();

    setupTotals();

    setupAutosave();

    restoreForm();

    document
        .getElementById("submitBtn")
        .addEventListener("click", submitOrder);

}

/*==========================================================
 LOGIN
==========================================================*/

function setupLogin() {

    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", login);

    document
        .getElementById("password")
        .addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                login();

            }

        });

    if (sessionStorage.getItem("loggedIn") === "true") {

        showForm();

    }

}

function login() {

    const pwd = document
        .getElementById("password")
        .value
        .trim();

    if (pwd === CONFIG.PASSWORD) {

        sessionStorage.setItem("loggedIn", "true");

        showForm();

    } else {

        document.getElementById("loginError").textContent =
            "Onjuist paswoord.";

    }

}

function showForm() {

    document
        .getElementById("loginPage")
        .classList.add("hidden");

    document
        .getElementById("formPage")
        .classList.remove("hidden");

}

/*==========================================================
 TOTALEN
==========================================================*/

function setupTotals() {

    const ids = [

        "volwassenen",
        "kinderen",

        "ribbetjes",
        "kipfilet",
        "steak",
        "merguez",
        "varkenslapje",

        "vanille",
        "aardbei",
        "tiramisu"

    ];

    ids.forEach(id => {

        document
            .getElementById(id)
            .addEventListener("input", calculateTotals);

    });

    calculateTotals();

}

function calculateTotals() {

    const volwassenen =
        getNumber("volwassenen");

    const kinderen =
        getNumber("kinderen");

    const personen =
        volwassenen + kinderen;

    document.getElementById(
        "totaalPersonen"
    ).textContent = personen;

    let vlees = 0;

    CONFIG.BBQ_ITEMS.forEach(item => {

        vlees += getNumber(item);

    });

    document.getElementById(
        "totaalVlees"
    ).textContent = vlees;

    let dessert = 0;

    CONFIG.DESSERT_ITEMS.forEach(item => {

        dessert += getNumber(item);

    });

    document.getElementById(
        "totaalDessert"
    ).textContent = dessert;

}

/*==========================================================
 AUTOSAVE
==========================================================*/

function setupAutosave() {

    if (!CONFIG.AUTO_SAVE)
        return;

    const fields = document.querySelectorAll(
        "input, textarea"
    );

    fields.forEach(field => {

        field.addEventListener(
            "input",
            saveForm
        );

    });

}

function saveForm() {

    const data = {};

    document
        .querySelectorAll("input, textarea")
        .forEach(field => {

            data[field.id] = field.value;

        });

    localStorage.setItem(
        CONFIG.STORAGE_KEY,
        JSON.stringify(data)
    );

}

function restoreForm() {

    if (!CONFIG.AUTO_SAVE)
        return;

    const json = localStorage.getItem(
        CONFIG.STORAGE_KEY
    );

    if (!json)
        return;

    const data = JSON.parse(json);

    Object.keys(data).forEach(id => {

        const field =
            document.getElementById(id);

        if (field) {

            field.value = data[id];

        }

    });

    calculateTotals();

}

/*==========================================================
 HULPFUNCTIES
==========================================================*/

function getNumber(id) {

    const value =
        parseInt(
            document
                .getElementById(id)
                .value
        );

    if (isNaN(value))
        return 0;

    return value;

}
/*
============================================================
 Marialei Moederdag BBQ
 script.js
 Deel 2/3
============================================================
*/


/*==========================================================
 VALIDATIE
==========================================================*/

function validateOrder() {

    const naam =
        document
            .getElementById("naam")
            .value
            .trim();


    if (CONFIG.REQUIRE_NAME && naam === "") {

        alert("Gelieve je naam in te vullen.");

        return false;

    }


    const personen =
        getNumber("volwassenen") +
        getNumber("kinderen");


    if (
        CONFIG.REQUIRE_AT_LEAST_ONE_PERSON &&
        personen === 0
    ) {

        alert(
            "Gelieve minstens één persoon in te geven."
        );

        return false;

    }


    let totaalItems = 0;


    CONFIG.BBQ_ITEMS.forEach(item => {

        totaalItems += getNumber(item);

    });


    if (
        CONFIG.REQUIRE_AT_LEAST_ONE_ITEM &&
        totaalItems === 0
    ) {

        alert(
            "Gelieve minstens één BBQ-item te kiezen."
        );

        return false;

    }


    if (CONFIG.LIMIT_DESSERTS_TO_PERSONS) {

        let desserts = 0;


        CONFIG.DESSERT_ITEMS.forEach(item => {

            desserts += getNumber(item);

        });


        if (desserts > personen) {

            alert(
                "Het aantal desserts mag niet groter zijn dan het aantal personen."
            );

            return false;

        }

    }


    return true;

}



/*==========================================================
 BESTELLING OPBOUWEN
==========================================================*/

function createOrderObject() {


    const order = {


        event:
            CONFIG.EVENT_NAME,


        timestamp:
            new Date()
                .toLocaleString("nl-BE"),


        naam:
            document
                .getElementById("naam")
                .value
                .trim(),


        huisnummer:
            document
                .getElementById("huisnummer")
                .value
                .trim(),


        volwassenen:
            getNumber("volwassenen"),


        kinderen:
            getNumber("kinderen"),



        bbq: {

            ribbetjes:
                getNumber("ribbetjes"),

            kipfilet:
                getNumber("kipfilet"),

            steak:
                getNumber("steak"),

            merguez:
                getNumber("merguez"),

            varkenslapje:
                getNumber("varkenslapje")

        },



        dessert: {

            vanille:
                getNumber("vanille"),

            aardbei:
                getNumber("aardbei"),

            tiramisu:
                getNumber("tiramisu")

        },



        opmerking:
            document
                .getElementById("opmerking")
                .value
                .trim()


    };


    return order;

}



/*==========================================================
 VERZENDEN
==========================================================*/

async function submitOrder() {


    if (!validateOrder()) {

        return;

    }



    const button =
        document.getElementById("submitBtn");


    button.disabled = true;

    button.textContent =
        "Bezig met verzenden...";



    const order =
        createOrderObject();



    try {


        /*
         * Controle of Google Apps Script gekoppeld is.
         * Tijdens testen blijft dit lokaal werken.
         */


        if (CONFIG.API_URL === "") {


            console.log(
                "Testmodus - bestelling:",
                order
            );


            await fakeDelay();


        } else {


            await fetch(
                CONFIG.API_URL,
                {

                    method:"POST",


await fetch(
    CONFIG.API_URL,
    {
        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:
            JSON.stringify(order)
    }
);
                    headers:{

                        "Content-Type":
                        "application/json"

                    },

                    body:
                        JSON.stringify(order)

                }
            );


        }



        showSuccess();



    } catch(error) {


        console.error(
            "Verzendfout:",
            error
        );


        alert(
            "Er ging iets fout bij het verzenden. Probeer opnieuw."
        );


        button.disabled = false;


        button.textContent =
            "Bestelling verzenden";


    }


}



/*==========================================================
 SUCCESS
==========================================================*/

function showSuccess() {


    localStorage.removeItem(
        CONFIG.STORAGE_KEY
    );


    document
        .getElementById("formPage")
        .classList.add("hidden");


    document
        .getElementById("successPage")
        .classList.remove("hidden");


}



/*==========================================================
 TESTVERTRAGING
==========================================================*/


function fakeDelay() {


    return new Promise(
        resolve => {

            setTimeout(
                resolve,
                700
            );

        }
    );

}
/*
============================================================
 Marialei Moederdag BBQ
 script.js
 Deel 3/3
============================================================
*/


/*==========================================================
 EXTRA BEVEILIGING INPUTS
==========================================================*/

document.addEventListener(
    "input",
    function(e){

        if (
            e.target.type === "number"
        ){

            let value =
                parseInt(e.target.value);


            if (
                isNaN(value) ||
                value < 0
            ){

                e.target.value = 0;

            }

        }

    }
);



/*==========================================================
 ENTER TOETS VERMIJDEN
==========================================================*/

document.addEventListener(
    "keydown",
    function(e){

        if(
            e.key === "Enter" &&
            e.target.tagName !== "TEXTAREA"
        ){

            e.preventDefault();

        }

    }
);



/*==========================================================
 FORMULIER RESETTEN
==========================================================*/

function resetForm(){


    document
        .querySelectorAll(
            "input, textarea"
        )
        .forEach(field=>{


            if(
                field.type === "number"
            ){

                field.value = 0;


            } else {


                field.value = "";

            }


        });


    localStorage.removeItem(
        CONFIG.STORAGE_KEY
    );


    calculateTotals();

}



/*==========================================================
 SAMENVATTING BESTELLING
==========================================================*/

function createSummary(order){


    let text = "";


    text +=
        "Naam: " +
        order.naam +
        "\n\n";


    text +=
        "Personen: " +
        (
            order.volwassenen +
            order.kinderen
        ) +
        "\n\n";


    text +=
        "BBQ:\n";


    Object.keys(order.bbq)
        .forEach(item=>{


            if(
                order.bbq[item] > 0
            ){

                text +=
                    "- " +
                    item +
                    ": " +
                    order.bbq[item] +
                    "\n";

            }


        });


    text +=
        "\nDessert:\n";


    Object.keys(order.dessert)
        .forEach(item=>{


            if(
                order.dessert[item] > 0
            ){

                text +=
                    "- " +
                    item +
                    ": " +
                    order.dessert[item] +
                    "\n";

            }


        });



    return text;

}



/*==========================================================
 LOGGING VOOR TESTEN
==========================================================*/

function debugOrder(){


    const order =
        createOrderObject();


    console.table(order);


    console.log(
        createSummary(order)
    );


}



/*==========================================================
 OFFLINE MELDING
==========================================================*/

window.addEventListener(
    "offline",
    function(){

        alert(
            "Let op: je bent offline. De bestelling kan pas verzonden worden zodra er opnieuw verbinding is."
        );

    }
);



/*==========================================================
 ONLINE MELDING
==========================================================*/

window.addEventListener(
    "online",
    function(){

        console.log(
            "Internetverbinding hersteld."
        );

    }
);