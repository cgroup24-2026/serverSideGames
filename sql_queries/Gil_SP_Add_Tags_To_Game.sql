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
-- Author:		<Alon , Gil>
-- Create date: <21.05.2026>
-- Description:	<gets a list of tags and add them to the gamesTag table>
-- =============================================
CREATE PROCEDURE Gil_SP_Add_Tags_To_Game
    @gameId INT,
    @tags NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    ;WITH TagList AS (
        SELECT LTRIM(RTRIM(value)) AS tagName
        FROM STRING_SPLIT(@tags, ',')
        WHERE LTRIM(RTRIM(value)) <> ''
    )
    INSERT INTO TagGameTable_2026 (gameId, tagName)
    SELECT @gameId, tagName
    FROM TagList;
END;

--EXEC SP_Add_Tags_To_Game 
--    @gameId = 10,
--    @tags = 'Indie, VR';
--select * from TagGameTable_2026
--where gameId=10