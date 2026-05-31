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
-- Author:		<Alon, Gil>
-- Create date: <16.05.2026>
-- Description:	<Add a single game record>
-- =============================================
CREATE PROCEDURE Gil_SP_Add_Game
    @name VARCHAR(255),
    @steamUrl VARCHAR(500),
    @image VARCHAR(500),
    @releaseDate VARCHAR(50),
    @reviewSummary VARCHAR(255),
    @price INT,
    @tags VARCHAR(MAX),
    @windows BIT,
    @mac BIT,
    @linux BIT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @returnValue BIT;

    -- Check if game already exists
    IF EXISTS (SELECT 1 FROM [Games_2026] WHERE [name] = @name)
    BEGIN
        SET @returnValue = 0;
        RETURN @returnValue;
    END

    -- Insert the game
    INSERT INTO [Games_2026] 
        ([name], steamUrl, [image], releaseDate, reviewSummary, price, [windows], mac, linux)
    VALUES 
        (@name, @steamUrl, @image, @releaseDate, @reviewSummary, @price, @windows, @mac, @linux);

    -- Get the new game ID
    DECLARE @gameId INT = SCOPE_IDENTITY();

    -- Call the tag‑insertion SP
    EXEC Gil_SP_Add_Tags_To_Game @gameId = @gameId, @tags = @tags;

    SET @returnValue = 1;
    RETURN @returnValue;
END
GO

--DECLARE @result INT;
--EXEC @result = SP_Add_Game
--    @name = 'Test Game 1',
--    @steamUrl = 'https://store.steampowered.com/app/12345',
--    @image = 'https://image.url/test.jpg',
--    @releaseDate = '2026-05-16',
--    @reviewSummary = 'Very Positive',
--    @price = 59,
--    @tags = 'Action, Indie, Multiplayer',
--    @windows = 1,
--    @mac = 0,
--    @linux = 1;
--SELECT @result AS Result;'


--SELECT * FROM Games_2026 WHERE name = 'Test Game 1';
--SELECT * FROM TagGameTable_2026 WHERE gameId = (
--    SELECT id FROM Games_2026 WHERE name = 'Test Game 1'
--);