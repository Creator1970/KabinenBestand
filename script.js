console.log("script gestartet");

document.addEventListener("DOMContentLoaded", () => {

    const mapObject = document.getElementById("austriaMap");
    const standortSelect = document.getElementById("standort");
    const kwSelect = document.getElementById("kw");
    const anzeigeKW = document.getElementById("anzeigeKW");
    const typSelect = document.getElementById("typ");
    const saveBtn = document.getElementById("saveBtn");

    const bestaende = [];

    let aktuellerStandort = "";

    const kabinentypen = [
        "Toi Water",
        "Toi Water up",
        "Toi Fresh",
        "Toi Flush",
        "Toi Green",
        "Dixi Green",
        "Toi Cap",
        "Toi Nature",
        "Toi Mini",
        "Toi Rolluri",
        "Toi Quattro",
        "Boels",
        "Toi Plus",
        "Toi Plus Wash",
        "Toi Hygiene Plus",
        "Dawi Baustelle",
        "Dawi Event",
        "Mobiclo up",
        "Mobiclo Green",
        "Dufti",
        "Classic",
        "Boxi",
        "Oriental",
        "Tank 800l",
        "Desinfekt",
        "Dixi Blue"
    ];

    const standortZuBundeslaender = {
        liesing: ["wien", "burgenland"],
        raasdorf: ["niederoesterreich"],
        wels: ["oberoesterreich"],
        spittal: ["kaernten"],
        graz: ["steiermark"],
        hall: ["tirol"]
    };

    // KW Listen
    for (let i = 1; i <= 52; i++) {

        const option1 = document.createElement("option");
        option1.value = i;
        option1.textContent = "KW " + i;
        kwSelect.appendChild(option1);

        const option2 = document.createElement("option");
        option2.value = i;
        option2.textContent = "KW " + i;
        anzeigeKW.appendChild(option2);

    }

    // Kabinentypen laden
    kabinentypen.forEach(typ => {

        const option = document.createElement("option");

        option.value = typ;
        option.textContent = typ;

        typSelect.appendChild(option);

    });

    function aktualisiereAnzeige() {

        const gesamtContainer =
            document.getElementById("gesamtBestandContainer");

        const standortContainer =
            document.getElementById("standortBestandContainer");

        gesamtContainer.innerHTML = "";
        standortContainer.innerHTML = "";

        const gesamt = {};
        const standort = {};

        kabinentypen.forEach(typ => {
            gesamt[typ] = 0;
            standort[typ] = 0;
        });

        bestaende.forEach(e => {

            gesamt[e.typ] += e.anzahl;

            if (
                e.standort === aktuellerStandort &&
                e.kw == anzeigeKW.value
            ) {
                standort[e.typ] += e.anzahl;
            }

        });

        kabinentypen.forEach(typ => {

            if (gesamt[typ] > 0) {

                gesamtContainer.innerHTML += `
                    <div class="bestand-zeile">
                        <span>${typ}</span>
                        <span>${gesamt[typ]}</span>
                    </div>
                `;
            }

            if (standort[typ] > 0) {

                standortContainer.innerHTML += `
                    <div class="bestand-zeile">
                        <span>${typ}</span>
                        <span>${standort[typ]}</span>
                    </div>
                `;
            }

        });

        document.getElementById("standortTitel").textContent =
            aktuellerStandort
                ? `Standortbestand - ${aktuellerStandort}`
                : "Standortbestand";
    }

    // Speichern
    saveBtn.addEventListener("click", () => {

        const datensatz = {
            standort: standortSelect.value,
            kw: kwSelect.value,
            typ: typSelect.value,
            anzahl: Number(
                document.getElementById("anzahl").value
            )
        };

        if (
            !datensatz.standort ||
            !datensatz.kw ||
            !datensatz.typ ||
            !datensatz.anzahl
        ) {

            alert("Bitte alle Felder ausfüllen");
            return;
        }

        const index =
            bestaende.findIndex(e =>
                e.standort === datensatz.standort &&
                e.kw === datensatz.kw &&
                e.typ === datensatz.typ
            );

        if (index >= 0) {

            bestaende[index] = datensatz;

        } else {

            bestaende.push(datensatz);

        }

        console.log("Bestände:", bestaende);

        aktualisiereAnzeige();

        alert("Bestand gespeichert");

    });

    // KW Filter für Anzeige
    anzeigeKW.addEventListener("change", () => {
        aktualisiereAnzeige();
    });

    // SVG Karte laden
    mapObject.addEventListener("load", () => {

        console.log("SVG geladen");

        const svgDoc = mapObject.contentDocument;

        const bundeslaender = [
            "wien",
            "niederoesterreich",
            "oberoesterreich",
            "burgenland",
            "steiermark",
            "kaernten",
            "salzburg",
            "tirol",
            "vorarlberg"
        ];

        function resetMap() {

            bundeslaender.forEach(id => {

                const land = svgDoc.getElementById(id);

                if (land) {
                    land.style.fill = "#B1D1A3";
                }

            });

        }

        const standortButtons =
            document.querySelectorAll(".standort-btn");

        standortButtons.forEach(btn => {

            btn.addEventListener("click", () => {

                document
                    .querySelectorAll(".standort-btn")
                    .forEach(b =>
                        b.classList.remove("aktiv")
                    );

                btn.classList.add("aktiv");

                aktuellerStandort =
                    btn.dataset.standort;

                resetMap();

                const laender =
                    standortZuBundeslaender[
                        aktuellerStandort
                    ];

                if (laender) {

                    laender.forEach(id => {

                        const land =
                            svgDoc.getElementById(id);

                        if (land) {
                            land.style.fill = "#0078d4";
                        }

                    });

                }

                aktualisiereAnzeige();

            });

        });

        resetMap();

    });

});