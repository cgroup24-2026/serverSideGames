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
-- Description: Update User by ID
-- =============================================

CREATE PROCEDURE Gil_SP_Update_User_By_Id
    @id INT,
    @name VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255),
	@active BIT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if game exists
    IF NOT EXISTS (SELECT 1 FROM Users_2026 WHERE id = @id)
        RETURN 0;   -- Not found
    -- Update the game
    UPDATE Users_2026
    SET 
        [name] = @name,
        email = @email,
        [password] = @password,
        active = @active
    WHERE id = @id;
    RETURN 1;       -- Updated successfully
END
GO

--DECLARE @returnValue INT;

--EXEC @returnValue = SP_Update_User_By_Id
--    @id = 7,
--    @name = 'Gil Alon',
--    @email = 'gil@example.com',
--    @password = 'newpass123',
--    @active = 1;

--PRINT 'Return value: ' + CAST(@returnValue AS VARCHAR(10));
--select* from Users_2026
