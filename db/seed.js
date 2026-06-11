import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Create 20 tracks (unchanged)
  for (let i = 1; i <= 20; i++) {
    await createTrack("Track " + i, i * 50000);
  }

  // Create 2 users
  const lucas = await createUser("lucas", "password123");
  const isaiah = await createUser("isaiah", "password456");

  // Lucas gets playlists 1–10, Isaiah gets playlists 11–20
  for (let i = 1; i <= 20; i++) {
    const owner = i <= 10 ? alice : bob;
    await createPlaylist(
      "Playlist " + i,
      "lorem ipsum playlist description",
      owner.id,
    );
  }

  // Add tracks to playlists (same logic as before)
  for (let i = 1; i <= 15; i++) {
    const playlistId = 1 + Math.floor(i / 2);
    await createPlaylistTrack(playlistId, i);
  }
}
