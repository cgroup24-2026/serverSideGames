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
-- Description: add game to user by IDs
-- =============================================

CREATE PROCEDURE Gil_SP_Add_Users_Game
    @userId INT,
    @gameId INT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @returnValue BIT
    IF EXISTS (SELECT 1 FROM UsersGames_2026 WHERE userId = @userId and gameId = @gameId)
    BEGIN
        SET @returnValue = 0;   -- no game founded return false
        RETURN @returnValue;
    END
	INSERT INTO [UsersGames_2026] (userId, gameId) VALUES (@userId,@gameId);

	SET @returnValue = 1;-- user was deleted successfully
	RETURN @returnValue;
END
GO
--DECLARE @result INT;
--EXEC @result = SP_Add_Users_Game @userId = 1, @gameId = 10;
--SELECT @result AS ReturnValue;

--DECLARE @result INT;
--EXEC @result = SP_Delete_Users_Game @userId = 1, @gameId = 10;
--SELECT @result AS ReturnValue;

--select* from [UsersGames_2026]