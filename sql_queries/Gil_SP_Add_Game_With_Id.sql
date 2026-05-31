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
CREATE PROCEDURE Gil_SP_Add_Game_With_Id
	@id INT,
    @name VARCHAR(255),
    @steamUrl VARCHAR(500),
    @image VARCHAR(500),
    @releaseDate VARCHAR(50),
    @reviewSummary VARCHAR(255),
	@tags VARCHAR(MAX),
    @price INT,
    @windows BIT,
    @mac BIT,
    @linux BIT
AS
BEGIN
    SET NOCOUNT ON;
	SET IDENTITY_INSERT [Games_2026] ON;
	INSERT INTO [Games_2026] (id, [name], steamUrl, [image], releaseDate, reviewSummary, price, [windows], mac, linux)
	VALUES (@id, @name, @steamUrl,@image,@releaseDate, @reviewSummary, @price, @windows, @mac, @linux);
	EXEC Gil_SP_Add_Tags_To_Game @gameId = @id, @tags = @tags;
	SET IDENTITY_INSERT [Games_2026] OFF;

END
GO
--EXEC SP_Add_Game_With_Id
--	@id =1,
--    @name = 'Counter-Strike 2',
--    @steamUrl = 'https://store.steampowered.com/app/730/',
--    @image = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/730/capsule_231x87.jpg?t=1749053861',
--    @releaseDate = 'Aug 21, 2012',
--    @reviewSummary = '86.7%',
--    @price = 0,
--    @windows = 1,
--    @mac = 0,
--    @linux = 1
