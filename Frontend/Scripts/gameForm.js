let selectedTagsList = [];
let _isEditMode = false;
let _editId = null;

$(document).ready(function () {
    if (localStorage.getItem("loggedInUser") === null) {
        window.location.href = "Login.html";
        return;
    }
    ajaxCall(
        "GET",
        API_ROUTES.gamesApi + "/GetTags",
        "",
        function (data) {
            const datalist = document.getElementById('tags-list');
            if (!datalist) return;
            datalist.innerHTML = '';
            data.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                datalist.appendChild(option);
            });
            initializeGameForm()
        },
        function (err) {
            console.log(err);
            alert("A server error has occurred.");
        }
    );
});

function initializeGameForm() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlId = urlParams.get('id');

    if (urlId) {
        _isEditMode = true;
        _editId = urlId;

        $("#pageTitle").text("Edit Game");
        $("#headerTitle").text("Edit Game");

        loadGameForEditPlaceholder(_editId);
    } else {
        _isEditMode = false;

        $("#pageTitle").text("Create New Game");
        $("#headerTitle").text("Create New Game");
    }

    $("#addTagBtn").click(function () {
        addSelectedTag();
    });

    $("#gameForm").submit(function (e) {
        e.preventDefault();

        $("#submitBtn").prop("disabled", true);

        clearFormErrors();

        const game = readGameForm(_isEditMode, _editId);
        const isValid = validateGame(game, _isEditMode);

        if (isValid) {
            submitGamePlaceholder(game, _isEditMode);
        } else {
            $("#submitBtn").prop("disabled", false);
        }
    });
}

function loadGameForEditPlaceholder(id) {
    ajaxCall("GET",
        API_ROUTES.gamesApi,
        "",
        //onSuccess
        function (games) { 
            const game = games.find(g => g.id == id);

            if (!game) {
                alert("Game not found");
                window.location.href = "MyGames.html";
                return;
            }

            $("#name").val(game.name);
            $("#steamUrl").val(game.steamUrl);
            $("#image").val(game.image);
            $("#releaseDate").val(formatDateForInput(game.releaseDate));
            $("#reviewSummary").val(game.reviewSummary);
            $("#price").val(game.price);
            $("#windows").prop("checked", game.windows);
            $("#mac").prop("checked", game.mac);
            $("#linux").prop("checked", game.linux);

            selectedTagsList = [...game.tags];
            renderSelectedTags();
        },
        //onFail
        function (err) {
            alert("Failed: could not load game detailes");
            console.log(err);
        }
    )

}

function formatDateForInput(dateStr) {
    const date = new Date(dateStr);

    if (isNaN(date)) return "";

    return date.toISOString().split("T")[0];
}

function readGameForm(isEditMode, editId) {

    const game = {
        name: $("#name").val().trim(),
        steamUrl: $("#steamUrl").val().trim(),
        image: $("#image").val().trim(),
        releaseDate: $("#releaseDate").val(),
        reviewSummary: $("#reviewSummary").val().trim(),
        price: parseInt($("#price").val(), 10),
        tags: [...selectedTagsList],
        windows: $("#windows").is(":checked"),
        mac: $("#mac").is(":checked"),
        linux: $("#linux").is(":checked")
    };

    return game;
}

function clearFieldError(fieldId) {
    $(`#${fieldId}`).removeClass("input-error");
    $(`#${fieldId}Error`).text("").hide();
}

function validateGame(game, isEditMode) {
    let isValid = true;

    // Name
    if (!game.name) {
        showFieldError("name", "Name is required.");
        isValid = false;
    } else {
        clearFieldError("name");
    }

    // Steam URL
    if (!game.steamUrl || !isValidUrl(game.steamUrl)) {
        showFieldError("steamUrl", "Please provide a valid Steam URL.");
        isValid = false;
    } else {
        clearFieldError("steamUrl");
    }

    // Image
    if (!game.image || !isValidUrl(game.image)) {
        showFieldError("image", "Please provide a valid Image URL.");
        isValid = false;
    } else {
        clearFieldError("image");
    }

    // Price
    if (isNaN(game.price) || game.price < 0 || game.price > 100) {
        showFieldError("price", "Price must be between 0 and 100.");
        isValid = false;
    } else {
        clearFieldError("price");
    }

    // Review Summary
    if (game.reviewSummary) {
        const reviewRegex = /^\d+(\.\d+)?%$/;
        if (!reviewRegex.test(game.reviewSummary)) {
            showFieldError("reviewSummary", "Review summary must be formatted like '86.7%'.")
            isValid = false;
        } else {
            clearFieldError("reviewSummary");
        }
    } else {
        clearFieldError("reviewSummary");
    }

    // Platforms
    if (!game.windows && !game.mac && !game.linux) {
        showFieldError("platforms", "At least one platform must be selected.");
        isValid = false;
    } else {
        clearFieldError("platforms");
    }

    return isValid;
}

function showFieldError(fieldId, message) {
    $(`#${fieldId}`).addClass('input-error');
    $(`#${fieldId}Error`).text(message).show();
}

function clearFormErrors(fieldId) {
    $(`#${fieldId}`).removeClass("input-error");
    $(`#${fieldId}Error`).hide().text("");
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;  
    }
}

function addSelectedTag() {
    const selectedTag = $("#tags-input").val();
    if (!selectedTag) return;

    if (!selectedTagsList.includes(selectedTag)) {
        selectedTagsList.push(selectedTag);
        renderSelectedTags();
    }

    // reset selection
    $("#tags-input").val("");
}

function removeTag(tagToRemove) {
    selectedTagsList = selectedTagsList.filter(t => t !== tagToRemove);
    renderSelectedTags();
}

function renderSelectedTags() {
    const container = $("#selectedTags");
    container.empty();

    selectedTagsList.forEach(tag => {
        const tagBadge = $(`<div class="tag-badge">${tag} <button type="button" onclick="removeTag('${tag}')">x</button></div>`);
        container.append(tagBadge);
    });
}

function submitGamePlaceholder(game, isEditMode) {
    const method = isEditMode ? "PUT" : "POST";
    const url = isEditMode ? API_ROUTES.gamesApi + "/" + _editId : API_ROUTES.gamesApi;

    $("#submitBtn").prop("disabled", false);

    ajaxCall(
        method,
        url,
        JSON.stringify(game),
        function (response) {
            //checks id collision only with myGames and not ALLGAMES! future fix..
            if (response === true) {
                alert(isEditMode ? "Game successfully edited!" : "Game successfully added!");
                window.location.href = "MyGames.html";
            } else {
                showFieldError("name", "A game with this name already exists.");
                $("#submitBtn").prop("disabled", false);
            }
            
        },
        function (err) {
            alert("Failed: could not save game.");
            $("#submitBtn").prop("disabled", false);
            console.log(err);
        }
    );
}