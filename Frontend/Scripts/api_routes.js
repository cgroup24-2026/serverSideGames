
const develop_mode = false; //change when developing/publishing

const ruppin_path = "https://proj.ruppin.ac.il/cgroup24/test2/tar1";
const local_path = "https://localhost:7197"

const BASE_API = develop_mode ? local_path : ruppin_path;

const API_ROUTES = {
    gamesJson: '../Data/steamData.json',
    gamesApi: BASE_API + "/api/Games",
    usersApi: BASE_API + "/api/Users"
};