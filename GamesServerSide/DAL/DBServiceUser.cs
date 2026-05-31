using GamesServerSide.BL;
using System.Data;
using System.Data.SqlClient;

namespace GamesServerSide.DAL
{
    public class DBServiceUser : DBServiceBase
    {
        public bool Insert(BL.User user)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@name", user.Name },
                    { "@email", user.Email },
                    { "@password", user.Password },
                    { "@active", user.Active }
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Add_User", paramDic);
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
        public BL.User? GetUserByEmail(string email)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@email", email },
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Validate_user", paramDic);
                BL.User user = new BL.User();
                SqlDataReader dataReader = cmd.ExecuteReader();
                if (!dataReader.HasRows)
                {
                    // if user not exist
                    return null;
                }

                while (dataReader.Read())
                {
                    user.Id = Convert.ToInt32(dataReader["id"]);
                    user.Name = dataReader["name"].ToString();
                    user.Email = dataReader["email"].ToString();
                    user.Password = dataReader["password"].ToString();
                    user.Active = Convert.ToInt32(dataReader["active"]) == 1;
                }
                return user;
            }
            // catch the exception in the BL to send bach diffrent http responses
            finally
            {
                if (con != null)
                {
                    con.Close();
                }
            }
        }
        public List<Game> GetUsersGames(int id)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@id", id },
                };

                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Get_Users_Games", paramDic);
                List<Game> games = new List<Game>();
                SqlDataReader dataReader = cmd.ExecuteReader();
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
        public bool UpdateUser(int id, User user)
        {
            try
            {
                this.Connect();
                var paramDict = new Dictionary<string, object>
                {
                    { "@id", id },
                    { "@name", user.Name },
                    { "@email", user.Email },
                    { "@password", user.Password },
                    { "@active", user.Active }
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Update_User_By_Id", paramDict);
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
        public bool AddGameToUserList(int userId, int gameId)
        {
            try
            {
                this.Connect();
                var paramDict = new Dictionary<string, object>
                {
                    { "@userId", userId },
                    { "@gameID", gameId }
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Add_Users_Game", paramDict);
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
        public bool DeleteGameForUser(int userId, int gameId)
        {
            try
            {
                this.Connect();
                var paramDict = new Dictionary<string, object>
                {
                    { "@userId", userId },
                    { "@gameID", gameId }
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Delete_Users_Game", paramDict);
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
        public List<Game> GetRecomendations(string tagsList)
        {
            try
            {
                this.Connect();
                var paramDic = new Dictionary<string, object>
                {
                    { "@Tags", tagsList },
                };
                SqlCommand cmd = this.CreateCommandWithStoredProcedureGeneral("Gil_SP_Get_Games_By_Tags", paramDic);
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

