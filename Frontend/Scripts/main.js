let allIndexGames = [];
let gamesInCartIds = [];
let activeSelectedTags = [];
let tags = [];
let currentView = 'cards'; // 'cards' or 'table'
let gamesTableInstance = null;

$(document).ready(function () {
    $(document).on("click", ".btn-add", addGameToCart);
    // apply filters on check box changes or on search click to prevent too many calls while typing
    $("#search-btn").on("click", applyFilters);
    $("#search-input").on("input", function () {
        if (this.value.trim() == "") {
            applyFilters();
        }
    })
    $("#price-filter").on("change", applyFilters);
    $(".checkbox").on("change", applyFilters);
    $("#tags-input").on("input", function () {
        const val = this.value.trim();
        if (!activeSelectedTags.includes(val) && tags.includes(val) ){
            activeSelectedTags.push(val);
            renderTagBadges();
            applyFilters();
            this.value = '';
        }
    });

    $("#show-recommendations-btn").on("click", function () {
        if (!user) {
            if (confirm("You must be logged in to get recommendations.\nGo to login page?"))
                window.location.href = "login.html";
            return;
        }
        openRecommendationsModal(); // user-initiated
    });

    loadGames();

    // Toggle button for cards/table view
    $(document).on('click', '#toggle-view-btn', function () {
        if (currentView === 'cards') {
            showTableView();
        } else {
            showCardsView();
        }
    });
});
function scoreToColor(reviewSummary) {
    if (!reviewSummary) return 'hsl(0, 0%, 15%)';
    const raw = ('' + reviewSummary).replace('%', '');
    const val = parseFloat(raw);
    if (isNaN(val)) return '';
    const hue = Math.max(0, Math.min(100, val)) * 1.2;
    return `hsl(${hue},60%,20%)`;
}
function renderTable(games) {
    const wrapper = document.getElementById('games-table-wrapper');
    const tableEl = document.getElementById('games-table');


    if (gamesTableInstance && $.fn.dataTable && gamesTableInstance.destroy) {
        gamesTableInstance.clear();
        gamesTableInstance.destroy();
        gamesTableInstance = null;
    }

    const tbody = tableEl.querySelector('tbody');
    tbody.innerHTML = '';

    games.forEach(game => {
        const tr = document.createElement('tr');
        const scoreColor = scoreToColor(game.reviewSummary);
        if (scoreColor) tr.style.backgroundColor = scoreColor;

        const platforms = [];
        if (game.windows) platforms.push('Win');
        if (game.mac) platforms.push('Mac');
        if (game.linux) platforms.push('Lin');

        const tags = Array.isArray(game.tags) ? game.tags.join(', ') : '';

        const inCart = Array.isArray(gamesInCartIds) && gamesInCartIds.some(id => id == game.id);
        const addButtonHtml = inCart
            ? `<button class="btn-add" disabled data-id="${game.id}">In Cart</button>`
            : `<button class="btn-add" data-id="${game.id}">Add </button>`;

        tr.innerHTML = `
            <td>${game.name}</td>
            <td>${game.releaseDate || '-'}</td>
            <td>${game.reviewSummary || '-'}</td>
            <td class="price-cell" contenteditable="true" data-id="${game.id}">${formatPrice(game.price)}</td>
            <td>${platforms.join(', ')}</td>
            <td>${tags}</td>
            <td><a href="${game.steamUrl}" target="_blank">Steam</a></td>
            <td>${addButtonHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    // Initialize DataTable
    gamesTableInstance = $(tableEl).DataTable({
        paging: true,
        searching: true,
        info: false,
        autoWidth: false
    });

    // Attach inline edit handlers (delegated)
    $(document).off('blur', '.price-cell').on('blur', '.price-cell', function (e) {
        const id = $(this).data('id');
        const raw = $(this).text().trim();
        handlePriceUpdate(id, raw, this);
    });

    $(document).off('keydown', '.price-cell').on('keydown', '.price-cell', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            $(this).blur();
        }
    });
}
function handlePriceUpdate(id, rawValue, cellEl) {
    // accept values like "0", "9.99", "$9.99"
    if (rawValue === '') rawValue = '0';
    rawValue = rawValue.replace('$', '').trim();
    const parsed = parseFloat(rawValue);
    if (isNaN(parsed) || parsed < 0) {
        const original = (allIndexGames && allIndexGames.find(g => g.id == id) || {}).price;
        if (cellEl) cellEl.textContent = formatPrice(original);
        return;
    }
    const newPrice = Math.round(parsed * 100) / 100; // keep two decimals
    // update UI
    if (cellEl) cellEl.textContent = formatPrice(newPrice);
    const game = (allIndexGames || []).find(g => g.id == id);
    if (!game) return;
    const url = API_ROUTES.gamesApi + '/' + id;
    ajaxCall(
        'PUT',
        url,
        JSON.stringify(game),
        function (data) {
            game.price = newPrice;
        },
        function (err) {
            console.log('Failed to update price', err);
            alert("A server error has occurred.");
        }
    );
}
function formatPrice(val) {
    if (val === null || val === undefined) return '$0.00';
    const n = Number(val);
    if (isNaN(n) || n === 0) return '$0.00';
    return '$' + n.toFixed(2);
}
function showTableView() {
    currentView = 'table';
    document.getElementById('games-container').classList.add('hidden');
    document.getElementById('games-table-wrapper').classList.remove('hidden');
    const btn = document.getElementById('toggle-view-btn');
    btn.textContent = 'Show Cards View';
    applyFilters();
}
function showCardsView() {
    currentView = 'cards';
    document.getElementById('games-container').classList.remove('hidden');
    document.getElementById('games-table-wrapper').classList.add('hidden');
    const btn = document.getElementById('toggle-view-btn');
    btn.textContent = 'Show Table View';
    applyFilters();
}
function loadTags() {
    ajaxCall(
        "GET",
        API_ROUTES.gamesApi + "/GetTags",
        "",
        function (data) {
            tags = Array.isArray(data) ? data : [];
            const datalist = document.getElementById('tags-list');
            if (!datalist) return;
            datalist.innerHTML = '';
            tags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                datalist.appendChild(option);
            });
        },
        function (err) {
            console.log(err);
            alert("A server error has occurred.");
        }
    );
}
function renderTagBadges() {
    const container = document.getElementById('selected-tags-container');
    container.innerHTML = '';
    activeSelectedTags.forEach(tag => {
        const badge = document.createElement('span');
        badge.className = 'tag-badge';
        badge.innerHTML = `${tag} <b class="tag-badge-close">&times;</b>`;
        // Clicking a badge removes it from the filter selection
        badge.addEventListener('click', function () {
            activeSelectedTags = activeSelectedTags.filter(t => t !== tag);
            renderTagBadges();
            applyFilters();
        });
        container.appendChild(badge);
    });
}
function hideLoading() {
    let msg = document.getElementById('loading-message');
    msg.remove();
}
function showLoading() {
    let container = document.getElementById('games-container');
    if (!document.getElementById('loading-message')) {
        container.innerHTML = '<p id="loading-message" class="loading-message">Loading games...</p>';
    }
}
function loadGames(retries) {
    if (retries === undefined) retries = 3;
    showLoading();
    ajaxCall(
        "GET",
        API_ROUTES.gamesApi,
        "",
        function (data) {
            allIndexGames = data
            if (user) {
                ajaxCall(
                    "GET",
                    API_ROUTES.usersApi + "/GetGames/" + user.id,
                    null,
                    function (data) {
                        gamesInCartIds = data.map(g => g.id);
                        loadTags();
                        hideLoading();
                        renderGames(allIndexGames, 'games-container', 'add');
                    },
                    function (err) {
                        console.log(err);
                        alert("A server error has occurred.");
                        hideLoading();
                        renderGames(allIndexGames, 'games-container', 'add');
                    }
                );
            }
            else {
                loadTags();
                hideLoading();
                renderGames(allIndexGames, 'games-container', 'add');
            }
        },
        function (err) {
            console.log(err);
            if (retries > 0) {
                setTimeout(function () { loadGames(retries - 1); }, 1000);
            } else {
                hideLoading();
                var container = document.getElementById('games-container');
                if (container) container.innerHTML = '<p class="error-message">Failed to load games. Please refresh the page.</p>';
            }
        });
}
function applyFilters() {
    showLoading();
    const searchInput = document.getElementById('search-input');
    const priceFilter = document.getElementById('price-filter') || { value: '' };
    const isWindows = document.getElementById('os-windows') || { checked: false };
    const isMac = document.getElementById('os-mac') || { checked: false };
    const isLinux = document.getElementById('os-linux') || { checked: false };

    const searchTerm = (searchInput.value || '').toLowerCase();
    const priceVal = priceFilter.value;
    const winChecked = isWindows.checked;
    const macChecked = isMac.checked;
    const linChecked = isLinux.checked;

    const requestedTags = activeSelectedTags;

    ajaxCall(
        "GET",
        API_ROUTES.gamesApi + "/GetByName?name=" + encodeURIComponent(searchTerm),
        "",
        function (data) {
            const filteredByName = (data || []).filter(game => {
                let matchPrice = true;
                if (priceVal === 'free') {
                    matchPrice = Number(game.price) === 0;
                } else if (priceVal === 'paid') {
                    matchPrice = Number(game.price) > 0;
                }
                const matchWin = !winChecked || game.windows === true;
                const matchMac = !macChecked || game.mac === true;
                const matchLin = !linChecked || game.linux === true;
                const matchOs = matchWin && matchMac && matchLin;

                return matchPrice && matchOs;
            });

            if (requestedTags.length > 0) {
                ajaxCall(
                    "GET",
                    API_ROUTES.gamesApi + "/GetByTags?tags="+encodeURIComponent(requestedTags.join(',')), 
                    "",
                    function (data) {
                        const tagResults = data || []; 

                        const finalFiltered = filteredByName.filter(gameByName =>
                            tagResults.some(gameByTag => gameByTag.id === gameByName.id)
                        );

                        hideLoading();
                        renderGames(finalFiltered, 'games-container', 'add');
                        if (currentView === 'table') renderTable(finalFiltered);
                    },
                    function (err) {
                        console.log(err);
                        hideLoading();
                        alert("A server error has occurred.");
                    }
                );
            }
            else {
                hideLoading();
                renderGames(filteredByName, 'games-container', 'add');
                if (currentView === 'table') renderTable(filteredByName);
            }
        },
        function (err) {
            console.log(err);
            hideLoading();
            alert("A server error has occurred.");
        }
    );
}
function addGameToCart() {
    if (!user) {
        if (confirm("You must be logged in to add items to cart.\nGo to login page?"))
            window.location.href = "login.html";
        return;
    }

    const $btn = $(this);
    const gameId = $btn.data("id");

    if (gamesInCartIds.includes(gameId)) {
        $btn.prop("disabled", true).text("In Cart");
        return;
    }

    $btn.prop("disabled", true).text("Adding...");

    let game = allIndexGames.find(g => g.id == gameId);

    ajaxCall(
        "POST",
        API_ROUTES.usersApi + "/Add?userId=" + user.id + "&gameId=" + game.id,
        "",
        function (data) {
            gamesInCartIds.push(gameId);
            $btn.prop("disabled", true).text("In Cart");
        },
        function (err) {
            $btn.prop("disabled", false).text("Add to Cart");
            console.log(err);
            alert("A server error has occurred.");
        }
    );
}
function openRecommendationsModal() {
    const modalHtml = `
      <div id="recommendation-modal" class="modal-overlay">
        <div class="modal-content" role="dialog" aria-modal="true">
          <h2>Recommended for you</h2>
          <div class="modal-close-wrapper">
            <button id="rec-close-btn" class="modal-btn-cancel">Close</button>
          </div>
          <div id="recommendation-list" class="games-grid modal-games-grid"></div>
        </div>
      </div>
    `;
    $("body").append(modalHtml);
    $("#rec-close-btn").on("click", function () { $("#recommendation-modal").remove(); });
    $("#recommendation-modal").on("click", function (e) {
        if (e.target && e.target.id === "recommendation-modal") {
            $("#recommendation-modal").remove();
        }
    });

    const listEl = document.getElementById("recommendation-list");
    listEl.innerHTML = '<p class="loading-message">Loading recommendations...</p>';

    ajaxCall(
        "GET",
        API_ROUTES.usersApi + "/GetRecomandation/" + user.id,
        null,
        function (data) {
            if (!data || data.length === 0) {
                listEl.innerHTML = '<p>No recommendations found.</p>';
                return;
            }
            const candidates = Array.isArray(data) ? data : [];
            const notOwned = candidates.filter(g => !gamesInCartIds.includes(g.id));
            const chosen = (notOwned.length > 0 ? notOwned : candidates).slice(0, 3);

            if (listEl) {
                const html = chosen.map(g => createGameCardHtml(g, 'add')).join('');
                listEl.innerHTML = html;
            }
        },
        function (err) {
            console.log(err);
            if (listEl) listEl.innerHTML = '<p>Failed to load recommendation.</p>';
        }
    );
}