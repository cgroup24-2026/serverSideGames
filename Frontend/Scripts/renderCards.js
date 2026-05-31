function createGameCardHtml(game, actionType) {
    const platforms = [];
    if (game.windows) platforms.push('<img src="../Assets/windows.png" class="platform-icon platform-img" alt="Windows">');
    if (game.mac) platforms.push('<img src="../Assets/mac.png" class="platform-icon platform-img" alt="Mac">');
    if (game.linux) platforms.push('<img src="../Assets/linux.png" class="platform-icon platform-img" alt="Linux">');

    const visibleTags = game.tags ? game.tags.slice(0, 5) : [];
    const hiddenTags = game.tags ? game.tags.slice(5) : [];
    const tagsHtml = visibleTags.map(tag => `<span class="tag">${tag}</span>`).join('')
        + hiddenTags.map(tag => `<span class="tag tag-hidden">${tag}</span>`).join('')
        + (hiddenTags.length > 0 ? `<button type="button" class="btn-toggle-tags" onclick="toggleTags(this)">+${hiddenTags.length} more</button>` : '');
    const priceText = game.price === 0 ? 'Free to Play' : `$${game.price.toFixed(2)}`;

    let actionButton = '';
    if (actionType === 'add') {
        if (gamesInCartIds.includes(game.id) && localStorage.getItem("loggedInUser") !== null)
            actionButton = `<button type="button" class="btn-add" data-id="${game.id}" disabled>In Cart</button>`;
        else
            actionButton = `<button type="button" class="btn-add" data-id="${game.id}">Add to Cart</button>`;
    } else if (actionType === 'delete') {
        actionButton = `
            <div class="card-action-row">
                <button type="button" class="btn-edit action-btn" onclick="window.location.href='GameForm.html?id=${game.id}'">Edit</button>
                <button type="button" class="btn-delete action-btn" data-id="${game.id}">Delete</button>
            </div>
        `;
    }

    return `
        <div class="game-card" id="game-${game.id}">
            <div class="card-image">
                <img src="${game.image}" alt="${game.name}">
            </div>
            <div class="card-content">
                <h3 class="game-title">${game.name}</h3>
                <div class="sub-info">
                    <span class="release-date">${game.releaseDate}</span>
                    <span class="review-summary">${game.reviewSummary}</span>
                </div>
                <div class="platforms">
                    ${platforms.join(' ')}
                </div>
                <div class="tags">
                    ${tagsHtml}
                </div>
                <div class="card-footer">
                    <div class="footer-info">
                        <div class="price">${priceText}</div>
                        <a href="${game.steamUrl}" target="_blank" class="steam-link">Steam Page</a>
                    </div>
                    ${actionButton ? `
                    <div class="footer-action">
                        ${actionButton}
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function renderGames(games, containerId, actionType) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!games || games.length === 0) {
        container.innerHTML = '<p>No games found.</p>';
        return;
    }

    const html = games.map(game => createGameCardHtml(game, actionType)).join('');
    container.innerHTML = html;
}

function toggleTags(btn) {
    const tagsContainer = btn.closest('.tags');
    const hidden = tagsContainer.querySelectorAll('.tag-hidden');
    const isExpanded = tagsContainer.classList.toggle('tags-expanded');
    btn.textContent = isExpanded ? 'show less' : `+${hidden.length} more`;
}

// Password validation copied from login.js
function isValidPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
}

// Show/hide error text (this script marks live errors so it doesn't clobber server/form errors)
function setLiveError(errorEl, message) {
    if (!errorEl) return;
    if (message) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
        errorEl.dataset.liveError = 'true';
    } else {
        if (errorEl.dataset.liveError === 'true') {
            errorEl.textContent = '';
            errorEl.style.display = 'none';
            delete errorEl.dataset.liveError;
        }
    }
}

// Attach real-time validation to a password input and show messages in the specified error container.
// It will only clear error text if that text was created by this live-validator (avoids overwriting server errors).
function attachPasswordValidation(passwordInputId, errorContainerId) {
    const input = document.getElementById(passwordInputId);
    const errorEl = document.getElementById(errorContainerId);
    if (!input) return;

    input.addEventListener('input', () => {
        const val = input.value;
        if (val === '' || isValidPassword(val)) {
            setLiveError(errorEl, '');
            input.classList.remove('invalid');
        } else {
            setLiveError(errorEl, 'Password must be at least 8 characters, include 1 uppercase letter and 1 number!');
            input.classList.add('invalid');
        }
    });

    // optional: validate once on blur as well
    input.addEventListener('blur', () => {
        const val = input.value;
        if (val !== '' && !isValidPassword(val)) {
            setLiveError(errorEl, 'Password must be at least 8 characters, include 1 uppercase letter and 1 number!');
            input.classList.add('invalid');
        }
    });
}

// Wire up validation for login/register password fields if present
document.addEventListener('DOMContentLoaded', () => {
    attachPasswordValidation('password', 'login-error');
    attachPasswordValidation('reg-password', 'register-error');
});