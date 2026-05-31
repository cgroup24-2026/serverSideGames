using GamesServerSide.BL;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;


namespace GamesServerSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        [HttpGet("GetGames/{id}")]
        public IEnumerable<Game> Get(int id)
        {
            return BL.User.GetUserGames(id);
        }

        [HttpPost("Register")]
        public bool Register([FromBody] BL.User u)
        {
            return u.Insert();
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] UserLoginDTO loginUser)
        {
            try
            {
                BL.User? user = BL.User.Authenticate(loginUser.Email, loginUser.Password);
                if (user == null)
                    return Unauthorized("Invalid email or password");

                return Ok(new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Active
                });
            }
            catch // catch server error
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "An internal server error occurred." });
            }
        }

        [HttpPut("{id}")]
        public bool UpdateUser(int id, [FromBody] User user)   
        {
            return user.UpdateUser(id);
        }
        [HttpDelete("Delete")]
        public bool Delete(int userId, int gameId)
        {
            return BL.User.DeleteGameForUser(userId, gameId);
        }

        [HttpPost("Add")]
        public bool Add(int userId, int gameId)
        {
            return BL.User.AddGameToUserList(userId, gameId);
        }
        [HttpGet("GetRecomandation/{id}")]
        public IEnumerable<Game> GetRecomandation(int id)
        {
            return BL.User.GetUserRecommendedGames(id);
        }

    }
}
