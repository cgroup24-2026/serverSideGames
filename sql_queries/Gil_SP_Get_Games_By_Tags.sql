-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:      <Alon, Gil>
-- Create date: <16.05.2026>
-- Description: Gets all games with concatenated tags filtered by tags list
-- =============================================
CREATE PROCEDURE Gil_SP_Get_Games_By_Tags
    @Tags NVARCHAR(MAX)
AS
BEGIN
    ;WITH TagList AS (
        SELECT LTRIM(RTRIM(value)) AS Tag
        FROM STRING_SPLIT(@Tags, ',')
    )
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
        COUNT(*) AS MatchScore,
        Tags = STUFF((
                SELECT ',' + t2.tagName
                FROM TagGameTable_2026 t2
                WHERE t2.gameId = g.id
                FOR XML PATH(''), TYPE
            ).value('.', 'NVARCHAR(MAX)'), 1, 1, '')
    FROM TagGameTable_2026 tg
    INNER JOIN Games_2026 g ON g.id = tg.gameId
    INNER JOIN TagList t ON LTRIM(RTRIM(tg.tagName)) = LTRIM(RTRIM(t.Tag))
    GROUP BY 
        g.id, g.[name], g.steamUrl, g.[image], g.releaseDate,
        g.reviewSummary, g.price, g.[windows], g.mac, g.linux
    ORDER BY MatchScore DESC;
END
GO

--EXEC SP_Get_Games_By_Tags 'Action,RPG';
--EXEC SP_Get_Games_By_Tags ' Action ,  RPG ';


