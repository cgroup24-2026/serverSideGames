SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      <Alon, Gil>
-- Create date: <16.05.2026>
-- Description: Gets all Users games with concatenated tags
-- =============================================
CREATE PROCEDURE Gil_SP_Get_Users_Games
	@id NVARCHAR(255)
AS
BEGIN
    SELECT 
        g.id,
        g.[name],
        g.steamUrl,
        g.[image],
        g.releaseDate,
        g.reviewSummary,
        g.price,
        g.[windows],
        g.mac,
        g.linux,
        Tags = STUFF((
                SELECT ',' + t.tagName
                FROM TagGameTable_2026 t
                WHERE t.gameId = g.id
                FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'), 1, 1, '')
    FROM Games_2026 g JOIN UsersGames_2026 ug on g.id = ug.gameId 
	WHERE ug.userId = @id
    GROUP BY 
        g.id, g.[name], g.steamUrl, g.[image], g.releaseDate,
        g.reviewSummary, g.price, g.[windows], g.mac, g.linux
END
GO

--INSERT INTO UsersGames_2026 (userId, gameId)
--VALUES (6, 100);

--INSERT INTO UsersGames_2026 (userId, gameId)
--VALUES (7, 730);
--INSERT INTO UsersGames_2026 (userId, gameId)
--VALUES (6, 730);

--Select * from UsersGames_2026 ug join Games_2026 g on g.id = ug.gameId
--EXEC SP_Get_Users_Games @id = 7;
 