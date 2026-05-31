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
-- Create date: <Create Date,,>
-- Description:	<insert user to users table>
-- =============================================
CREATE PROCEDURE Gil_SP_Add_User
    @name VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255),
	@active BIT
AS
BEGIN
    SET NOCOUNT ON;
	DECLARE @returnValue BIT
    IF EXISTS (SELECT 1 FROM [Users_2026] WHERE email = @email)
    BEGIN
        SET @returnValue = 0;   -- user already exists
        RETURN @returnValue;
    END

    INSERT INTO [Users_2026] ([name], email, [password], active)
    VALUES (@name, @email, @password, @active);

    SET @returnValue = 1;-- user was created successfully
	RETURN @returnValue;
END
GO
