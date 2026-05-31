using GamesServerSide.BL;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace GamesServerSide.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GamesController : ControllerBase
    {
        [HttpGet]
        public IEnumerable<Game> Get()
        {
            return Game.Read();
        }

        [HttpGet("GetByName")]
        public IEnumerable<Game> Get(string? name)
        {   
            //if the string is null return all Games
            if (String.IsNullOrEmpty(name))
                return Game.Read();

            return Game.GetByName(name);
        }

        [HttpPost]
        public bool Post([FromBody] Game g)
        {
            return g.Insert();
        }

        [HttpPost("InsertAll")]
        public int PostAll([FromBody] List<Game> games)
        {
            return Game.InsertAll(games);
        }


        [HttpPut("{id}")]
        public bool UpdateGame(int id, [FromBody] Game g)
        {
            return Game.UpdateGame(id, g);
        }
        [HttpGet("GetTags")]
        public IEnumerable<string> GetTags()
        {
            return Game.GetAllTags();
        }
        [HttpGet("GetByTags")]
        public IEnumerable<Game> GetByTags(string tags)
        {
            if (string.IsNullOrEmpty(tags)) return Enumerable.Empty<Game>();
            return Game.GetByTags(tags);
        }
    }
}
