SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:      <Alon, Gil>
-- Create date: <16.05.2026>
-- Description: Gets all tags
-- =============================================
CREATE PROCEDURE Gil_SP_Get_All_Tags
AS
BEGIN
    SELECT DISTINCT g.tagName
    FROM TagGameTable_2026 g
END
GO

--exec SP_Get_All_Tags