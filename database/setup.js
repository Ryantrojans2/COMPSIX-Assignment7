const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const dbStorage = process.env.NODE_ENV === 'production'
    ? process.env.DB_STORAGE_PRODUCTION
    : process.env.DB_STORAGE_DEVELOPMENT;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.resolve(__dirname, '..', dbStorage),
    logging: false
});

const Track = sequelize.define('Track', {
    trackId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    songTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artistName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    albumName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.INTEGER
    },
    releaseYear: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'tracks',
    timestamps: false
});

async function setupDatabase() {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully.');

        await sequelize.sync();
        console.log('Tracks table created successfully.');
    } catch (error) {
        console.error('Database setup error:', error);
        throw error;
    } finally {
        await sequelize.close();
        console.log('Database connection closed.');
    }
}
if (require.main === module) {
    setupDatabase();
}
module.exports = { sequelize, Track, setupDatabase };