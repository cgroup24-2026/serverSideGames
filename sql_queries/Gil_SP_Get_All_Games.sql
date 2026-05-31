SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      <Alon, Gil>
-- Create date: <16.05.2026>
-- Description: Gets all games with concatenated tags
-- =============================================
Create PROCEDURE Gil_SP_Get_All_Games
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
    FROM Games_2026 g
    GROUP BY 
        g.id, g.[name], g.steamUrl, g.[image], g.releaseDate,
        g.reviewSummary, g.price, g.[windows], g.mac, g.linux
END
GO

-- exec SP_Get_All_Games
