let estsoumis = false;
let counter = 0;
let ScoreValeur = 0;

let profil = {

};

const quiz =
    [
        {
            "question": "Quelle est la capitale de l'Australie ?",
            "reponses": [
                "Canberra",
                "Sydney",
                "Melbourne",
                "Aucune de ces réponses",
            ],
            "bonneReponse": 0,
            "bienRepondu": false
        },
        {
            "question": "Quelle est la capitale de la Bolivie ?",
            "reponses": [
                "Santa Cruz",
                "Sucre",
                "La Paz",
                "Aucune",
            ],
            "bonneReponse": 1,
            "bienRepondu": false
        },
        {
            "question": "Quel pays a remporté la coupe du monde de football en 2014 ?",
            "reponses": [
                "L'Espagne",
                "Le Portugal",
                "L'Allemagne",
                "Le Brésil",
            ],
            "bonneReponse": 2,
            "bienRepondu": false
        },
        {
            "question": "Quelle est la capitale de l'Ouzbékistan ?",
            "reponses": [
                "Libreville",
                "Tachkent",
                "Bichkek",
                "Kathmandu",
            ],
            "bonneReponse": 1,
            "bienRepondu": false
        },
        {
            "question": "Quelle est la capitale des Bahamas ?",
            "reponses": [
                "Nassau",
                "Berne",
                "Bridgetown",
                "Guatemala",
            ],
            "bonneReponse": 0,
            "bienRepondu": false
        }
    ];

function getAge() {
    var today = new Date();
    var birthDate = new Date($("#date").val());
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    $("#MonAge").html(age + " ans");
};

$("#formulaire").validate(
    {
        rules: {
            prenom: {
                required: true,
                alphanumeric: true
            },
            nom: {
                required: true,
                alphanumeric: true

            },
            date: {
                required: true,
                datePlusPetite: true
            },
            select: {
                required: true,
            },
        },
        messages: {

            prenom: {
                required: "⚠ Le champ prénom est obligatoire"
            },
            nom: {
                required: "⚠ Le champ nom est obligatoire"
            },
            date: {
                required: "⚠ La date est requise",
            },
            select: {
                required: "⚠ Merci de choisir votre statut"
            }
        },

        showErrors: function (errorMap, errorList) {
            if (estsoumis) {
                const ul = $("<ul></ul>");
                $.each(errorList, function () {
                    ul.append(`<li>${this.message}</li>`);
                });
                $('#showErrors').addClass("alerte").html(ul)
                estsoumis = false;
            }
            this.defaultShowErrors();
        },
        invalidHandler: function (form, validator) {
            estsoumis = true;
        },

        submitHandler: function () {
            CacherFormulaire();
            AfficherQuiz();

            profil.nom = $("#nom").val();
            profil.prenom = $("#prenom").val();
            profil.statut = $("#statut").val()
            profil.age = $("#age").val()

        }
    }
);

//Pour cacher le résultat au début
$("#resultat").hide(0);

function CacherFormulaire() {
    $("#etape1").hide(0)
};

function AfficherQuiz() {
    if (counter == 0)
        $("#btn").addClass('d-none');

    $("#question").html(quiz[counter].question);
    for (let i = 0; i < quiz[counter].reponses.length; i++) {
        $("#choix" + i).prop("checked", false);
        $("#reponse" + i).html(quiz[counter].reponses[i]);
    }

    $("#quiz").fadeIn(1000);
};

//Pour afficher la barre de progression
count = 0;
let barreWidth = 0;

function growBar() {
    barreWidth += 100 / quiz.length;
    $(".progress").attr("aria-valuenow", barreWidth);
    if (barreWidth <= 100) {
        $('.progress-bar').css({ "width": barreWidth + '%' });
    }
}

//Pour afficher les questions en cliquant sur suivant
$("#suivante").on('click', function () {

    let ReponsesR = $('input[name = "radio"]:checked').val();
    let bonneReponse = quiz[counter].bonneReponse;

    if (bonneReponse == ReponsesR) {
        quiz[counter].bienRepondu = true;
        ScoreValeur++;
    }
    $("#scoree").html(ScoreValeur + "/5");

    $("#quiz").fadeOut(1000, function () {
        if (counter < quiz.length - 1)
            AfficherQuiz(counter++);
    });
    growBar()
    if (counter == quiz.length-1) {
        if (ScoreValeur >= 4) {
            $("#result").html("<h2>Tu as réussi</h2><div class=\"symbole reussite\"></div><p>Félicitations !<br>Tu es un génie de la géographie !</p>");
        }
        else {
            $("#result").html("<h2>Tu as échoué</h2><div class=\"symbole echec\"></div><p>Oh non !<br>Tu dois reviser un peu ta géographie !</p>")
        }
        $(".modal").show();
        $("#quiz").hide(0);
    }
});

//Affiche etape 3 et 4 + alert bootstrap
$("#details").on('click', function () {
    if (ScoreValeur >= 4) {
        $("#alert").addClass("alert alert-success");
        $("#alert").html("Félicitations, tu as réussi le Quiz !");
    } else if (ScoreValeur == 3) {
        $("#alert").addClass("alert alert-warning");
        $("#alert").html("Tu y es presque arrivé. Persévère !");
    }
    else {
        $("#alert").addClass("alert alert-danger");
        $("#alert").html("Dommage, ton niveau est trop faible !");
    }
    $("#resultat").show();
    $(".modal").hide(0)
    $("#MonNom").html(profil.nom);
    $("#MonPrenom").html(profil.prenom);
    $("#MonStatut").html(profil.statut);
    getAge();

    let dt = $('#tableau-resultats').DataTable({
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.10.16/i18n/French.json",
            "sSearchPlaceholder": "",
        },
        paging: false,
        ordering: false,
        info: false,
        scrollX: true,
        autoWidth: true,
        searching: false,
    });

    function estCorrect(indice, indBonneReponse) {
        if (indice == indBonneReponse)
            return "correct";
        else return "faux";
    }

    let acc = $("#accordion");
    let flag = "";
    for (var i = 0; i < quiz.length; i++) {
        if (quiz[i].bienRepondu)
            flag = '<span class="correct">Correct</span>';
        else flag = '<span class="faux">Échoué</span>';
        dt.row.add([i + 1, quiz[i].question, flag]).draw();
        acc.append(`<h4>${quiz[i].question}</h4>
            <div>
                <ul>
                    <li class="${estCorrect(0, quiz[i].bonneReponse)}">${quiz[i].reponses[0]} : ${estCorrect(0, quiz[i].bonneReponse)}</li>
                    <li class="${estCorrect(1, quiz[i].bonneReponse)}">${quiz[i].reponses[1]} : ${estCorrect(1, quiz[i].bonneReponse)}</li>
                    <li class="${estCorrect(2, quiz[i].bonneReponse)}">${quiz[i].reponses[2]} : ${estCorrect(2, quiz[i].bonneReponse)}</li>
                    <li class="${estCorrect(3, quiz[i].bonneReponse)}">${quiz[i].reponses[3]} : ${estCorrect(3, quiz[i].bonneReponse)}</li>
                </ul>
            </div>
        </div>`);
     }
    $("#accordion").accordion();
})

$.validator.addMethod("valueNotEquals", function (value, element, arg) {
    return arg !== value;
}, "La valeur ne pas pas être égale à l'argument");

//Pour avoir les caractères alphanumériques
jQuery.validator.addMethod(
    "alphanumeric",
    function (value, element) {
        return this.optional(element) || /^[\w.]+$/i.test(value);
    },
    "⚠  Seuls les lettres, nombres et barre de soulignement sont acceptés"
);

//Pour que la date soit inférieure à celle du jour
$.validator.addMethod(
    "datePlusPetite",
    function (value, element) {
        const dateActuelle = new Date();
        dateActuelle.setHours(0, 0, 0, 0);
        const dateSaisie = new Date(value);
        dateSaisie.setHours(0, 0, 0, 0);
        dateSaisie.setDate(dateSaisie.getDate() + 1);
        return this.optional(element) || dateActuelle.getTime() > dateSaisie.getTime();
    },
    "⚠ La date de naissance doit être inférieure à la date d'aujourd'hui"
);

// Accordeon 
$(document).ready(function (touch) {
    $('.accordiontitle').append('<span class="arrowaccordion"></span>')
});
$(document).ready(function (touch) {
    $(".accordioncontent").hide();
    $(".accordioncontent:eq(0)").fadeIn();
    $(".accordiontitle").click(function () {
        $(".accordioncontent").slideUp();
        $(".accordiontitle").removeClass("active");
        $(this).addClass("active");
        ele_id = '.' + ($(this).attr('id'));
        $(ele_id).slideDown();
    });
});

