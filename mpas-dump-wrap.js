// // mpas-dump-wrapper.js
// // Wraps midi-dump functionality for MPAS use

// const MPASDump = (() => {
//     async function analyze(arrayBuffer) {
//         // Confirm ParseMidiData exists
//         if (typeof ParseMidiData !== "function") {
//             console.error("❌ ParseMidiData function not found!");
//             return null;
//         }

//         try {
//             const parsed = ParseMidiData(arrayBuffer);
//             console.log("📦 Parsed MIDI Data:", parsed);

//             // Optionally: sanity-check structure
//             if (!parsed?.tracks?.length) {
//                 console.warn("⚠️ No tracks found in parsed data.");
//             }

//             return parsed;
//         } catch (err) {
//             console.error("❌ Error during MIDI parsing:", err);
//             return null;
//         }
//     }

//     return { analyze };
// })();


// MPASDump module with race condition protection
const MPASDump = (() => {
    let isParsing = false; // 🧷 race condition lock

    async function analyze(arrayBuffer) {
        if (isParsing) {
            console.warn("⏳ Already parsing... please wait.");
            return null;
        }

        if (!arrayBuffer || !(arrayBuffer instanceof ArrayBuffer)) {
            console.error("❌ Invalid or missing ArrayBuffer");
            return null;
        }

        isParsing = true;
        try {
            const parsed = ParseMidiData(arrayBuffer);

            // 🔍 Diagnostic summary
            console.log("🧠 MIDI Analysis Summary");
            console.log(`🎼 Format: ${parsed.header.formatType}`);
            console.log(`🕒 PPQ: ${parsed.header.ticksPerQuarter}`);
            console.log(`🎵 Tempo: ${parsed.header.tempo} BPM`);
            console.log(`🎹 Track Count: ${parsed.tracks.length}`);

            parsed.tracks.forEach((trk, i) => {
                const noteCount = trk.events.filter(e => e.type === 'noteOn').length;
                const ccCount = trk.events.filter(e => e.type === 'controlChange').length;
                console.log(`🎛 Track ${i}: ${trk.name}`);
                console.log(`   🎶 Notes: ${noteCount}, 🎚 CCs: ${ccCount}, 📦 Total Events: ${trk.events.length}`);
            });

            console.log("📦 Parsed MIDI Data:", parsed);
            return parsed;

        } catch (err) {
            console.error("🔥 Error during MIDI parsing:", err);
            return null;
        } finally {
            isParsing = false;
        }
    }

    return { analyze };
})();

