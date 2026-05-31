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
-- Create date: <16.5.26>
-- Description:	<Add a single record of games tag>
-- =============================================
CREATE PROCEDURE Gil_SP_insert_TagGame
	@id INT,
	@tag NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;
	INSERT INTO TagGameTable_2026 (gameId, tagName) VALUES (@id, @tag);
END
GO

--exec SP_insert_TagGame 730, 'dsadfa'