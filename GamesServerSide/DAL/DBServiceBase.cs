using GamesServerSide.BL;
using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;

namespace GamesServerSide.DAL
{
    public abstract class DBServiceBase
    {
        protected SqlConnection con;
        private const string ConString= "myProjDB";
        protected void Connect()
        {
            IConfigurationRoot configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
                .Build();

            string cStr = configuration.GetConnectionString(ConString);
            if (string.IsNullOrWhiteSpace(cStr))
            {
                throw new InvalidOperationException($"Connection string '{ConString}' not found in configuration.");
            }

            this.con = new SqlConnection(cStr);
            this.con.Open();
        }

        protected SqlCommand CreateCommandWithStoredProcedureGeneral(String spName, Dictionary<string, object> paramDic)
        {

            SqlCommand cmd = new SqlCommand(); // create the command object
            cmd.Connection = this.con;              // assign the connection to the command object
            cmd.CommandText = spName;      // can be Select, Insert, Update, Delete 
            cmd.CommandTimeout = 10;           // Time to wait for the execution' The default is 30 seconds
            cmd.CommandType = System.Data.CommandType.StoredProcedure; // the type of the command, can also be text
            if (paramDic != null)
                foreach (KeyValuePair<string, object> param in paramDic)
                {
                    cmd.Parameters.AddWithValue(param.Key, param.Value);
                }
            return cmd;
        }
        protected Game CreateGameFromRecord(SqlDataReader dataReader)
        {
            Game game = new Game();
            game.Id = int.Parse(dataReader["id"].ToString());
            game.Name = dataReader["name"].ToString();
            game.SteamUrl = dataReader["steamUrl"].ToString();
            game.Image = dataReader["image"].ToString();
            game.ReleaseDate = dataReader["releaseDate"].ToString();
            game.ReviewSummary = dataReader["reviewSummary"].ToString();
            game.Price = int.Parse(dataReader["price"].ToString());
            game.Windows = Convert.ToInt32(dataReader["windows"]) == 1;
            game.Mac = Convert.ToInt32(dataReader["mac"]) == 1;
            game.Linux = Convert.ToInt32(dataReader["linux"]) == 1;
            game.Tags = dataReader["Tags"].ToString().Split(',').ToList();

            return game;
        }
    }
}