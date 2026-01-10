const params = new URLSearchParams(window.location.search);
const surah = params.get("surah");
let surat = [];
const getSurat = (search) => {
    console.log(search);
    fetch("quran.json")
        .then((response) => response.json())
        .then((data) => {
            let str = "";
            for (let i in data) {
                let { id, name, total_verses, transliteration, type } = data[i];
                if (!surah) {
                    if (
                        transliteration
                            .toUpperCase()
                            .indexOf(search.toUpperCase()) > -1
                    ) {
                        str += `<div class="surah-item" onclick="goToSurah(${id})">
                                <div class="surah-info">
                                    <div class="surah-number">${id}</div>
                                    <div>
                                        <div class="surah-name">${transliteration}</div>
                                        <div class="surah-meta">${type} • ${total_verses} Ayat</div>
                                    </div>
                                </div>
                                <div class="surah-arabic">${name}</div>
                            </div>`;
                    }
                } else {
                    str += `<option value="${id}">${transliteration}</option>`;
                }
            }
            if (!surah) document.getElementById("surahList").innerHTML = str;
            else {
                str = `<option value="">List Surah</option>${str}`;
                document.getElementById("select-surah").innerHTML = str;
                document.getElementById("select-surah").value = surah;
            }
        })
        .catch((error) => console.error(error));
};
const getSurah = (surah) => {
    fetch("quran.json")
        .then((response) => response.json())
        .then((data) => {
            data = data[surah - 1];
            console.log(data);
            let { total_verses, name, transliteration, verses } = data;
            let str = "";
            for (let i = 1; i <= total_verses; i++) {
                str += `<option>${i}</option>`;
            }
            document.getElementById("select-ayah").innerHTML = str;
            str = `<h3 class="surah-title">${name}</h3><h5 class="surah-title">${transliteration}</h5>`;
            if (surah != 1 && surah != 9)
                str += `<h5 style="text-align:center">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</h5>`;
            for (let i in verses) {
                let { id, text, translation } = verses[i];
                str += `<div class="ayah-item" id="ayah-${id}">
                            <p class="text">${text} <span> ${arabicNumber(
                    id
                )}</span></p>
                            <p class="translation">${translation}</p>
                        </div>`;
            }
            document.getElementById("surahList").innerHTML = str;
        })
        .catch((error) => console.error(error));
};
const arabicNumber = (numb) => {
    numb = numb.toString();
    let arabic = ["۰", "۱", "۲", "۳", "٤", "۵", "٦", "۷", "۸", "۹"];
    let arabicNumb = [];
    for (let i in numb) arabicNumb.push(arabic[numb[i]]);
    console.log(numb, arabicNumb);
    return arabicNumb.join("");
};
const goToSurah = (surah) => {
    window.location.href = `?surah=${surah}`;
};
const goToAyah = (ayah) => {
    window.location.href = `#ayah-${ayah}`;
};
if (!surah) {
    document.getElementById(
        "search-bar"
    ).innerHTML = `<input type="text" id="searchInput" onkeyup="getSurat(this.value)" placeholder="Cari surat...">`;
    getSurat("");
} else {
    document.getElementById(
        "search-bar"
    ).innerHTML = `<select onchange="goToSurah(this.value)" id="select-surah"><option>Al-Fatihah</option></select>
    <select id="select-ayah" onchange="goToAyah(this.value)"><option>1</option></select>`;
    getSurat("");
    getSurah(surah);
}
