import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylists,
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import { requireUser } from "../middleware/requireUser.js";

// All /playlists routes require a logged-in user
router.use(requireUser);

// GET /playlists — only return playlists owned by the logged-in user
router.get("/", async (req, res, next) => {
  try {
    const playlists = await getPlaylists(req.user.id);
    res.send(playlists);
  } catch (err) {
    next(err);
  }
});

// POST /playlists — create a playlist owned by the logged-in user
router.post("/", async (req, res, next) => {
  try {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { name, description } = req.body;
    if (!name || !description)
      return res.status(400).send("Request body requires: name, description");

    const playlist = await createPlaylist(name, description, req.user.id);
    res.status(201).send(playlist);
  } catch (err) {
    next(err);
  }
});

// Param middleware — load playlist, then check ownership
router.param("id", async (req, res, next, id) => {
  try {
    const playlist = await getPlaylistById(id);
    if (!playlist) return res.status(404).send("Playlist not found.");

    if (playlist.user_id !== req.user.id) {
      return res.status(403).send("You do not have access to this playlist.");
    }

    req.playlist = playlist;
    next();
  } catch (err) {
    next(err);
  }
});

// GET /playlists/:id
router.get("/:id", (req, res) => {
  res.send(req.playlist);
});

// GET /playlists/:id/tracks
router.get("/:id/tracks", async (req, res, next) => {
  try {
    const tracks = await getTracksByPlaylistId(req.playlist.id);
    res.send(tracks);
  } catch (err) {
    next(err);
  }
});

// POST /playlists/:id/tracks
router.post("/:id/tracks", async (req, res, next) => {
  try {
    if (!req.body) return res.status(400).send("Request body is required.");

    const { trackId } = req.body;
    if (!trackId) return res.status(400).send("Request body requires: trackId");

    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  } catch (err) {
    next(err);
  }
});
