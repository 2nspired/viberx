/**
 * Prisma Database Seed Script
 *
 * This script populates the database with sample data for development and testing.
 * Run with: npm run db:seed
 *
 * What it creates:
 * - A sample user
 * - Sample cached audio features for a few tracks
 * - A sample optimized playlist
 * - User preferences
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
	console.log("🌱 Starting database seed...\n");

	// Clean existing data (optional - comment out if you want to keep data)
	console.log("🧹 Cleaning existing data...");
	await prisma.optimizedPlaylist.deleteMany();
	await prisma.userPreferences.deleteMany();
	await prisma.cachedAudioFeatures.deleteMany();
	await prisma.user.deleteMany();

	// Create a sample user
	console.log("👤 Creating sample user...");
	const user = await prisma.user.create({
		data: {
			id: "sample_user_123",
			spotifyId: "sample_user_123",
			displayName: "DJ Sample",
			email: "sample@example.com",
			profileImage: "https://i.scdn.co/image/sample",
			country: "US",
			product: "premium",
		},
	});
	console.log(`   Created user: ${user.displayName} (${user.id})`);

	// Create user preferences
	console.log("⚙️  Creating user preferences...");
	const preferences = await prisma.userPreferences.create({
		data: {
			userId: user.id,
			defaultOptimizationMode: "auto",
			preferredWeights: {
				bpmWeight: 40,
				keyWeight: 35,
				energyWeight: 25,
			},
			theme: "dark",
			compactView: false,
		},
	});
	console.log(`   Created preferences for user: ${user.id}`);

	// Create sample cached audio features
	console.log("🎵 Creating cached audio features...");
	const tracks = [
		{
			spotifyTrackId: "track_001",
			trackName: "Midnight City",
			artistName: "M83",
			albumName: "Hurry Up, We're Dreaming",
			durationMs: 243000,
			tempo: 105.0,
			key: 7, // G
			mode: 1, // Major
			energy: 0.78,
			valence: 0.56,
			danceability: 0.65,
			acousticness: 0.02,
			instrumentalness: 0.85,
			liveness: 0.11,
			speechiness: 0.04,
			loudness: -5.5,
			timeSignature: 4,
		},
		{
			spotifyTrackId: "track_002",
			trackName: "Blinding Lights",
			artistName: "The Weeknd",
			albumName: "After Hours",
			durationMs: 200000,
			tempo: 171.0,
			key: 1, // C#
			mode: 1, // Major
			energy: 0.73,
			valence: 0.81,
			danceability: 0.51,
			acousticness: 0.0,
			instrumentalness: 0.0,
			liveness: 0.09,
			speechiness: 0.06,
			loudness: -4.1,
			timeSignature: 4,
		},
		{
			spotifyTrackId: "track_003",
			trackName: "Strobe",
			artistName: "deadmau5",
			albumName: "For Lack of a Better Name",
			durationMs: 637000,
			tempo: 128.0,
			key: 5, // F
			mode: 0, // Minor
			energy: 0.65,
			valence: 0.12,
			danceability: 0.58,
			acousticness: 0.01,
			instrumentalness: 0.95,
			liveness: 0.05,
			speechiness: 0.03,
			loudness: -8.2,
			timeSignature: 4,
		},
	];

	for (const track of tracks) {
		await prisma.cachedAudioFeatures.create({ data: track });
		console.log(`   Cached: ${track.trackName} by ${track.artistName}`);
	}

	// Create a sample optimized playlist
	console.log("📋 Creating sample optimized playlist...");
	const optimizedPlaylist = await prisma.optimizedPlaylist.create({
		data: {
			userId: user.id,
			originalPlaylistId: "original_playlist_abc",
			originalPlaylistName: "My Favorites",
			spotifyPlaylistId: "optimized_playlist_xyz",
			playlistName: "[VibeRX] My Favorites",
			trackCount: 3,
			optimizationMode: "auto",
			optimizationSettings: {
				mode: "auto",
				bpmWeight: 40,
				keyWeight: 35,
				energyWeight: 25,
			},
		},
	});
	console.log(`   Created: ${optimizedPlaylist.playlistName}`);

	console.log("\n✅ Seed completed successfully!");
	console.log("\n📊 Database summary:");
	console.log(`   Users: ${await prisma.user.count()}`);
	console.log(`   Optimized Playlists: ${await prisma.optimizedPlaylist.count()}`);
	console.log(`   Cached Tracks: ${await prisma.cachedAudioFeatures.count()}`);
	console.log(`   User Preferences: ${await prisma.userPreferences.count()}`);
}

main()
	.catch((e) => {
		console.error("❌ Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
