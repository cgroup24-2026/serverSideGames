let user = JSON.parse(localStorage.getItem("loggedInUser"));

$(document).ready(function () {
    checkLoggedIn()
});

function checkLoggedIn() {
    if (user) {
        $(".auth-nav #login").hide();
        // Setup dropdown logic
        const userHtml = `
            <div class="user-dropdown" style="position: relative; display: inline-block;">
                <a href="#" id="user-name" style="cursor: pointer; display: flex; align-items: center; gap: 0.5rem;">
                    ${user.name}
                    <span style="font-size: 0.6em; vertical-align: middle;">▼</span>
                </a>
                <div id="logout-menu" style="display: none; position: absolute; right: 0; background-color: var(--bg-color-card); box-shadow: 0 8px 16px rgba(0,0,0,0.5); padding: 10px; border-radius: 4px; z-index: 1000; min-width: 100px; text-align: center; margin-top: 5px;">
                    <a href="#" id="edit-profile-btn" style="display: block; color: var(--text-main); text-decoration: none; padding: 5px;">Edit My Profile</a>
                    <a href="#" id="logout" style="display: block; color: var(--text-main); text-decoration: none; padding: 5px;">Logout</a>
                </div>
            </div>
        `;

        $(".auth-nav").append(userHtml);

        // Remove existing statically defined logout link if it's there
        $(".auth-nav > #logout").remove();

        // Toggle menu on name click
        $("#user-name").click(function (e) {
            e.preventDefault();
            $("#logout-menu").toggle();
        });

        // Hide menu when clicking outside
        $(document).click(function (e) {
            if (!$(e.target).closest('.user-dropdown').length) {
                $("#logout-menu").hide();
            }
        });

        // Handle edit profile
        $("#edit-profile-btn").click(function (e) {
            e.preventDefault();
            $("#logout-menu").hide();
            openEditProfileModal();
        });

        // Handle logout
        $("#logout").click(function (e) {
            e.preventDefault();
            logout();
        });

        console.log("User is logged in:", user.name);
    } else {
        $(".auth-nav > #logout").hide();
    }
}

function openEditProfileModal() {
    $("#edit-profile-modal").remove();

    const modalHtml = `
        <div id="edit-profile-modal" class="modal-overlay">
            <div class="modal-content">
                <h2>Edit My Profile</h2>
                <form id="edit-profile-form">
                    <label for="edit-username">Username</label>
                    <input type="text" id="edit-username" value="${user.name}" required />
                    <label for="edit-password">New Password</label>
                    <input type="password" id="edit-password" placeholder="Enter new password" required />
                    <label for="edit-password-confirm">Confirm Password</label>
                    <input type="password" id="edit-password-confirm" placeholder="Confirm new password" required />
                    <div class="modal-buttons">
                        <button type="submit" class="modal-btn-save">Save</button>
                        <button type="button" id="cancel-edit-profile" class="modal-btn-cancel">Cancel</button>
                    </div>
                    <p id="edit-profile-error" style="color: #ff6b6b; display: none; margin-top: 10px;"></p>
                </form>
            </div>
        </div>
    `;

    $("body").append(modalHtml);

    $("#cancel-edit-profile").click(function () {
        $("#edit-profile-modal").remove();
    });

    $(".modal-overlay").click(function (e) {
        if ($(e.target).hasClass("modal-overlay")) {
            $("#edit-profile-modal").remove();
        }
    });

    $("#edit-profile-form").submit(function (e) {
        e.preventDefault();
        const newName = $("#edit-username").val().trim();
        const newPassword = $("#edit-password").val();
        const confirmPassword = $("#edit-password-confirm").val();

        if (!newName) {
            $("#edit-profile-error").text("Username cannot be empty.").show();
            return;
        }

        if (!newPassword) {
            $("#edit-profile-error").text("Password is required.").show();
            return;
        }

        // ✅ Password validation: 8+ chars, 1 uppercase, 1 digit
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            $("#edit-profile-error")
                .text("Password must be at least 8 characters long, include one uppercase letter, and one digit.")
                .show();
            return;
        }

        if (newPassword !== confirmPassword) {
            $("#edit-profile-error").text("Passwords do not match.").show();
            return;
        }

        const updatedUser = {
            Id: user.id,
            Name: newName,
            Email: user.email,
            Password: newPassword,
            Active: true
        };
        user.name = newName;

        ajaxCall("PUT", API_ROUTES.usersApi + "/" + user.id, JSON.stringify(updatedUser),
            function (result) {
                if (result) {
                    user.name = newName;
                    localStorage.setItem("loggedInUser", JSON.stringify(user));
                    $("#edit-profile-modal").remove();
                    $("#user-name").html(newName + ' <span style="font-size: 0.6em; vertical-align: middle;">▼</span>');
                    alert("Profile updated successfully!");
                } else {
                    $("#edit-profile-error").text("Failed to update profile.").show();
                }
            },
            function (err) {
                $("#edit-profile-error").text("An error occurred. Please try again.").show();
            }
        );
    });
}

function logout() {
    if (confirm("You sure you want to log out?")) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }
}
