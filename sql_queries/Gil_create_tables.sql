CREATE TABLE [Users_2026] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    [password] VARCHAR(255) NOT NULL,
    active BIT NOT NULL DEFAULT 1
);

CREATE TABLE [Games_2026] (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [name] VARCHAR(255) NOT NULL,
    steamUrl VARCHAR(500),
    [image] VARCHAR(500),
    releaseDate VARCHAR(50),
    reviewSummary VARCHAR(255),
    price INT NOT NULL,
    [windows] BIT NOT NULL DEFAULT 1,
    mac BIT NOT NULL DEFAULT 1,
    linux BIT NOT NULL DEFAULT 1
);

CREATE TABLE UsersGames_2026  (
    userId INT NOT NULL,
    gameId INT NOT NULL,
    PRIMARY KEY (userId, gameId),
    FOREIGN KEY (userId) REFERENCES [Users_2026](id) ON DELETE CASCADE,
    FOREIGN KEY (gameId) REFERENCES [Games_2026](id) ON DELETE CASCADE
);

CREATE TABLE TagGameTable_2026 (
    gameId INT NOT NULL,
    tagName VARCHAR(255) NOT NULL,
	PRIMARY KEY (gameId, tagName),
    FOREIGN KEY (gameId) REFERENCES [Games_2026](id) ON DELETE CASCADE
);

