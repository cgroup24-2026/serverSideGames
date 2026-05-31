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
-- Description: Update game by ID
-- =============================================

Create PROCEDURE Gil_SP_Update_Game_By_Id
    @id INT,
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

    -- Check if game exists
    IF NOT EXISTS (SELECT 1 FROM Games_2026 WHERE id = @id)
        RETURN 0;   -- Not found

    -- Update the game
    UPDATE Games_2026
    SET 
        [name] = @name,
        steamUrl = @steamUrl,
        [image] = @image,
        releaseDate = @releaseDate,
        reviewSummary = @reviewSummary,
        price = @price,
        [windows] = @windows,
        mac = @mac,
        linux = @linux
    WHERE id = @id;

    -- Remove old tags
    EXEC Gil_SP_Remove_Tags_From_Game @gameId = @id;

    -- Add new tags
    EXEC Gil_SP_Add_Tags_To_Game @gameId = @id, @tags = @tags;

    RETURN 1;       -- Updated successfully
END
GO

--SELECT * FROM Games_2026 WHERE id = 70;
--SELECT * FROM TagGameTable_2026 WHERE gameId = 70;

--DECLARE @result INT;

--EXEC @result = SP_Update_Game_By_Id
--    @id = 70,
--    @name = 'Updated Game Title',
--    @steamUrl = 'https://store.steampowered.com/app/99999',
--    @image = 'https://cdn.test/newimage.jpg',
--    @releaseDate = '2026-06-01',
--    @reviewSummary = 'Overwhelmingly Positive',
--    @price = 79,
--    @tags = 'Action, RPG, Co-op, Adventure',
--    @windows = 1,
--    @mac = 1,
--    @linux = 0;

--SELECT @result AS Result;

--SELECT * FROM Games_2026 WHERE id = 70;
--SELECT * FROM TagGameTable_2026 WHERE gameId = 70;

