let myGames = []
if (!user)
    window.location.href = "login.html";

$(document).ready(function () {
    loadMyGames();
    $(document).on("click", ".btn-delete", DeleteGameFromCart);
    $("#search-input").on("input", applyFilters);

});

function applyFilters() {
    const searchTerm = ($("#search-input").val() || "").toLowerCase().trim();
    const source = myGames || [];

    const filteredGames = source.filter(game => {
        return (game.name || "").toLowerCase().includes(searchTerm);
    });

    renderGames(filteredGames, "my-games-container", "delete");
}

function loadMyGames() {
    ajaxCall(
        "GET",
        API_ROUTES.usersApi + '/GetGames/' + user.id,
        "",
        function (data) {
            myGames = data;
            applyFilters();
        },
        function (err) {
            renderGames([], "my-games-container", "delete");
            console.log(err);
            alert("A server error has occurred.");
        }
    );
}

function DeleteGameFromCart() {
    const gameId = $(this).data("id");

    // Save references to the button and the game card
    const $btn = $(this);
    const $card = $("#game-" + gameId);

    // Disable the button to prevent multiple delete clicks
    $btn.prop("disabled", true);
    // Delete (DELETE)
    ajaxCall(
        "DELETE",
        API_ROUTES.usersApi + "/Delete?userId=" + user.id + "&gameId=" + gameId, null,
        function successDeleteFromCart(data) {
            if (!data) {
                // Re-enable the button so the user can try again
                $btn.prop("disabled", false);
                alert("Failed to delete the game from your library. Try logging in again.");
            }
            if ($card.length) {
                // Start fade-out animation.
                $card.fadeOut(300, function () {
                    $card.remove();
                    // Check if there are no game cards left inside the container
                    if (!$("#my-games-container .game-card").length) {
                        $("#my-games-container").html("<p>No games found.</p>");
                    }
                });
            }

            console.log(data);
        },
        function ErrorDeleteFromCart(err) {
            // Re-enable the button so the user can try again
            $btn.prop("disabled", false);
            console.log(err);
            alert("A server error has occurred.");
        }
    );
}
