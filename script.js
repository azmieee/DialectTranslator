const dropdowns = document.querySelectorAll(".dropdown-container"),
    inputLanguageDropdown = document.querySelector("#input-language"),
    outputLanguageDropdown = document.querySelector("#output-language");

function populateDropdown(dropdown, options) {
    dropdown.querySelector("ul").innerHTML = "";
    options.forEach((option) => {
        const li = document.createElement("li");
        const title = option.name + " (" + option.native + ")";
        li.innerHTML = title;
        li.dataset.value = option.code;
        li.classList.add("option");
        dropdown.querySelector("ul").appendChild(li);
    });
}

// Populate dropdowns with languages
populateDropdown(inputLanguageDropdown, languages);
populateDropdown(outputLanguageDropdown, languages);

dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("click", (e) => {
        dropdown.classList.toggle("active");
    });

    dropdown.querySelectorAll(".option").forEach((item) => {
        item.addEventListener("click", (e) => {
            // Remove active class from current dropdowns
            dropdown.querySelectorAll(".option").forEach((item) => {
                item.classList.remove("active");
            });
            item.classList.add("active");
            const selected = dropdown.querySelector(".selected");
            selected.innerHTML = item.innerHTML;
            selected.dataset.value = item.dataset.value;
            translate();
        });
    });
});

document.addEventListener("click", (e) => {
    dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
            dropdown.classList.remove("active");
        }
    });
});

const swapBtn = document.querySelector(".swap-position"),
    inputLanguage = inputLanguageDropdown.querySelector(".selected"),
    outputLanguage = outputLanguageDropdown.querySelector(".selected"),
    inputTextElem = document.querySelector("#input-text"),
    outputTextElem = document.querySelector("#output-text");

swapBtn.addEventListener("click", (e) => {
    const temp = inputLanguage.innerHTML;
    inputLanguage.innerHTML = outputLanguage.innerHTML;
    outputLanguage.innerHTML = temp;

    const tempValue = inputLanguage.dataset.value;
    inputLanguage.dataset.value = outputLanguage.dataset.value;
    outputLanguage.dataset.value = tempValue;

    // Swap text
    const tempInputText = inputTextElem.value;
    inputTextElem.value = outputTextElem.value;
    outputTextElem.value = tempInputText;

    translate();
});

function translate() {
    const inputText = inputTextElem.value.trim();
    const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
    const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;

    console.log("Input Text:", inputText);
    console.log("Input Language:", inputLanguage);
    console.log("Output Language:", outputLanguage);

    function translatePhrase(dictionaryFrom, dictionaryTo, text) {
        const words = text.split(/\s+/); // Split input text into words
        return words
            .map(word => {
                const translationKey = Object.keys(dictionaryFrom).find(
                    key => dictionaryFrom[key].toLowerCase() === word.toLowerCase()
                );
                return dictionaryTo[translationKey] || word; // Fallback to the original word if no translation
            })
            .join(" "); // Combine translated words into a sentence
    }

    // Translation logic for predefined dictionaries
    if (inputLanguage === "tgl" && outputLanguage === "mrn") {
        outputTextElem.value = translatePhrase(tagalogDictionary, maranaoDictionary, inputText);
        return;
    }

    if (inputLanguage === "mrn" && outputLanguage === "tgl") {
        outputTextElem.value = translatePhrase(maranaoDictionary, tagalogDictionary, inputText);
        return;
    }

    if (inputLanguage === "tgl" && outputLanguage === "mgd") {
        outputTextElem.value = translatePhrase(tagalogDictionary, maguindanaonDictionary, inputText);
        return;
    }

    if (inputLanguage === "mgd" && outputLanguage === "tgl") {
        outputTextElem.value = translatePhrase(maguindanaonDictionary, tagalogDictionary, inputText);
        return;
    }

    if (inputLanguage === "mrn" && outputLanguage === "mgd") {
        outputTextElem.value = translatePhrase(maranaoDictionary, maguindanaonDictionary, inputText);
        return;
    }

    if (inputLanguage === "mgd" && outputLanguage === "mrn") {
        outputTextElem.value = translatePhrase(maguindanaonDictionary, maranaoDictionary, inputText);
        return;
    }

    // Fallback to API for unsupported translations
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURIComponent(inputText)}`;

    fetch(url)
        .then(response => response.json())
        .then(json => {
            outputTextElem.value = json[0].map(item => item[0]).join("");
        })
        .catch(error => {
            console.error("API Error:", error);
            outputTextElem.value = "Translation failed. Please try again.";
        });
}

const darkModeCheckbox = document.getElementById("dark-mode-btn");

darkModeCheckbox.addEventListener("change", () => {
    document.body.classList.toggle("dark");
});

const inputChars = document.querySelector("#input-chars");

inputTextElem.addEventListener("input", (e) => {
    inputChars.innerHTML = inputTextElem.value.length;
});

// Trigger translation when the button is clicked
const translateBtn = document.querySelector("#translate-btn");

translateBtn.addEventListener("click", () => {
    translate();
});