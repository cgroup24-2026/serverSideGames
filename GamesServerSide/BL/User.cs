using BCrypt.Net;
using GamesServerSide.DAL;

namespace GamesServerSide.BL
{
    public class User
    {
        private int id;
        private string name;
        private string email;
        private string password;
        private bool active = true;

        private static DBServiceUser dbService = new DBServiceUser();

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string Email { get => email; set => email = value; }
        public string Password { get => password; set => password = value; }
        public bool Active { get => active; set => active = value; }

        //public static List<User> Read()
        //{
        //    return usersList;
        //}
        public bool Insert()
        {
            this.Password = BCrypt.Net.BCrypt.HashPassword(this.Password);
            return BL.User.dbService.Insert(this);
        }
        public static User? Authenticate(string email, string password)
        {
            User? user = dbService.GetUserByEmail(email);
            if (user == null)
                return null;

            bool validPassword = BCrypt.Net.BCrypt.Verify(password, user.Password);
            if (!validPassword)
                return null;

            return user;
        }

        public static bool AddGameToUserList(int  userId, int gameId)
        {
            return dbService.AddGameToUserList(userId, gameId);
        }
        public static bool DeleteGameForUser(int userId, int gameId)
        {
            return dbService.DeleteGameForUser(userId, gameId);
        }

        public static List<Game> GetUserGames(int id)
        {
            return dbService.GetUsersGames(id);
        }
        public bool UpdateUser(int userId)
        {
            this.Password = BCrypt.Net.BCrypt.HashPassword(this.Password);
            return dbService.UpdateUser(userId, this);
        }

        public static List<Game> GetUserRecommendedGames(int userId)
        {
            List<Game> usersGames = dbService.GetUsersGames(userId);
            HashSet<string> usersTags = new HashSet<string>();
            foreach (Game game in usersGames)
            {
                usersTags.UnionWith(game.Tags);
            }
            return dbService.GetRecomendations(string.Join(',', usersTags));
        }
    }
}
