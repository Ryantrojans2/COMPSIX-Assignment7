const express = require('express');
const { Track } = require('./database/setup');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/tracks', async (req, res) => {
    try {
        const tracks = await Track.findAll();
        res.status(200).json(tracks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tracks/:id', async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        res.status(200).json(track);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tracks', async (req, res) => {
    try {
        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        if (!songTitle || !artistName || !albumName || !genre) {
            return res.status(400).json({
                error: 'Song title, artist name, album name, and genre are required.'
            });
        }

        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });

        res.status(201).json(newTrack);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/tracks/:id', async (req, res) => {
    try {
        const track = await Track.findByPk(req.params.id);

        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }

        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

        if (!songTitle || !artistName || !albumName || !genre) {
            return res.status(400).json({
                error: 'Song title, artist name, album name, and genre are required.'
            });
        }

        await Track.update(
            { songTitle, artistName, albumName, genre, duration, releaseYear },
            { where: { trackId: req.params.id } }
        );

        const updatedTrack = await Track.findByPk(req.params.id);
        res.status(200).json(updatedTrack);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/tracks/:id', async (req, res) => {
    try {
        const deletedCount = await Track.destroy({
            where: { trackId: req.params.id }
        });

        if (deletedCount === 0) {
            return res.status(404).json({ error: 'Track not found' });
        }

        res.status(200).json({ message: 'Track deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Music Library API running at http://localhost:${PORT}`);
    });
}

module.exports = app;