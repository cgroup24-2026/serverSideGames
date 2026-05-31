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
-- Author:		Alon, Gil
-- Create date: 15.05.2026
-- Description:	Get User by email to validate
-- =============================================
CREATE PROCEDURE Gil_SP_Validate_user
	@email VARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

    SELECT *
    FROM [Users_2026]
    WHERE Email = @email;
END
GO