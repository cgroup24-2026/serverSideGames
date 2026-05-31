using GamesServerSide.DAL;

namespace GamesServerSide.BL
{
    public class Game
    {
        int id;
        string name;
        string steamUrl;
        string image;
        string releaseDate;
        string reviewSummary;
        int price;
        List<string> tags = new List<string>();
        bool windows;
        bool mac;
        bool linux;

        public int Id { get => id; set => id = value; }
        public string Name { get => name; set => name = value; }
        public string SteamUrl { get => steamUrl; set => steamUrl = value; }
        public string Image { get => image; set => image = value; }
        public string ReleaseDate { get => releaseDate; set => releaseDate = value; }
        public string ReviewSummary { get => reviewSummary; set => reviewSummary = value; }
        public int Price { get => price; set => price = value; }
        public List<string> Tags { get => tags; set => tags = value; }
        public bool Windows { get => windows; set => windows = value; }
        public bool Mac { get => mac; set => mac = value; }
        public bool Linux { get => linux; set => linux = value; }

        static DBServiceGame dBService = new DBServiceGame();

        public static List<Game> Read()
        {
            return dBService.ReadAllGames();
        }
        public bool Insert()
        {
            return dBService.InsertGame(this);
        }
        public static int InsertAll(List<Game> games)
        {
            return dBService.InsertGames(games);
        }
        public static IEnumerable<Game> GetByName(string name)
        {
            string search = name.ToLower();
            return dBService.GetGamesByName(search);
        }

        public static bool UpdateGame(int id, Game updatedGame)
        {
            return dBService.UpdateGame(id, updatedGame);
        }

        public static List<string> GetAllTags()
        {
            return dBService.GetTags();
        }
        public static List<Game> GetByTags(string tags)
        {
            return dBService.GetGamesByTags(tags);
        }
    }
}
