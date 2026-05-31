using GamesServerSide.BL;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.Xml.Linq;
using static System.Net.Mime.MediaTypeNames;

namespace GamesServerSide.DAL
{
    public class DBServiceGame : DBServiceBase
    {
        public List<Game> ReadAllGames()
        {
            this.Connect();

            SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Get_All_Games", null);
            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader();
                List<Game> games = new List<Game>();
                while (dataReader.Read())
                {
                    games.Add(CreateGameFromRecord(dataReader));
                }
                return games;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public int InsertGames(List<Game> games)
        {
            this.Connect();

            try
            {
                int count = 0;
                foreach (Game game in games)
                {
                    var paramDic = new Dictionary<string, object>
                {
                    { "@id", game.Id },
                    { "@name", game.Name },
                    { "@steamUrl", game.SteamUrl },
                    { "@image", game.Image },
                    { "@releaseDate", game.ReleaseDate },
                    { "@reviewSummary", game.ReviewSummary },
                    { "@tags", string.Join(",", game.Tags) },
                    { "@price", game.Price },
                    { "@windows", game.Windows },
                    { "@mac", game.Mac },
                    { "@linux", game.Linux }
                };
                    SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Add_Game_With_Id", paramDic);
                    count += cmd.ExecuteNonQuery();
                }
                return count;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool InsertGame(Game game)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@name", game.Name },
                    { "@steamUrl", game.SteamUrl },
                    { "@image", game.Image },
                    { "@releaseDate", game.ReleaseDate },
                    { "@reviewSummary", game.ReviewSummary },
                    { "@tags", string.Join(",", game.Tags) },
                    { "@price", game.Price },
                    { "@windows", game.Windows },
                    { "@mac", game.Mac },
                    { "@linux", game.Linux }
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Add_Game", paramDic);
                var returnParameter = new SqlParameter("@returnValue", SqlDbType.Int) { Direction = ParameterDirection.ReturnValue };
                cmd.Parameters.Add(returnParameter);
                cmd.ExecuteNonQuery();

                return ((int)returnParameter.Value) == 1;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public bool UpdateGame(int id , Game game)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@id", id },
                    { "@name", game.Name },
                    { "@steamUrl", game.SteamUrl },
                    { "@image", game.Image },
                    { "@releaseDate", game.ReleaseDate },
                    { "@reviewSummary", game.ReviewSummary },
                    { "@price", game.Price },
                    { "@tags", string.Join(",", game.Tags) },
                    { "@windows", game.Windows },
                    { "@mac", game.Mac },
                    { "@linux", game.Linux }
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Update_Game_By_Id", paramDic);
                var returnParameter = new SqlParameter("@returnValue", SqlDbType.Int) { Direction = ParameterDirection.ReturnValue };
                cmd.Parameters.Add(returnParameter);
                cmd.ExecuteNonQuery();

                return ((int)returnParameter.Value) == 1;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }

        }
        public List<Game> GetGamesByName(string search)
        {

            this.Connect();
            var paramDic = new Dictionary<string, object>
            {
                { "@search", search },
            };
            SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Get_Games_By_Name", paramDic);
            try
            {
                SqlDataReader dataReader = cmd.ExecuteReader();
                List<Game> games = new List<Game>();
                while (dataReader.Read())
                {
                    games.Add(CreateGameFromRecord(dataReader));
                }
                return games;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<string> GetTags()
        {
            try
            {
                this.Connect();
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Get_All_Tags", null);
                SqlDataReader dataReader = cmd.ExecuteReader();
                List<string> tags = new List<string>();
                while (dataReader.Read())
                {
                    tags.Add(dataReader["tagName"].ToString());
                }
                return tags;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<Game> GetGamesByTags(string tagsList)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@Tags", tagsList },
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Get_Games_Having_All_Tags", paramDic);
                SqlDataReader dataReader = cmd.ExecuteReader();
                List<Game> games = new List<Game>();
                while (dataReader.Read())
                {
                    games.Add(CreateGameFromRecord(dataReader));
                }
                return games;
            }
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
    }
}