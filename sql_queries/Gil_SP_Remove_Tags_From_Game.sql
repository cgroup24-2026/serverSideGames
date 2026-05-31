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
-- Description:	<remove all tags for game from the gamesTag table>
-- =============================================
CREATE PROCEDURE Gil_SP_Remove_Tags_From_Game
    @gameId INT
AS
BEGIN
    SET NOCOUNT ON;

    DELETE FROM TagGameTable_2026
    WHERE gameId = @gameId;
END
GO


--EXEC SP_Remove_Tags_From_Game @gameId = 10;
--SELECT * FROM TagGameTable_2026 WHERE gameId = 10;
