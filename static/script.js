// Manhwa image URLs (static)
const images = {
    "Top Tier Providence": "https://i.pinimg.com/originals/61/79/58/6179589073f3fdd79a088ce28f0bc1a0.jpg",
    "My Bias Gets On The Last Train": "https://i.pinimg.com/originals/57/80/79/578079302213944443.jpg",
    "I Am The Fated Villain": "https://i.pinimg.com/originals/08/92/2f/08922f27c53d3309755321925b0bfb3a.jpg"
};

let lastChapters = {};

// Update chapters dynamically by fetching data from Flask backend
async function fetchChapters() {
    try {
        const res = await fetch("/latest-chapters");
        const data = await res.json();

        // Clear previous manhwa items
        const container = document.getElementById("manhwas");
        container.innerHTML = "";

        // Dynamically add manhwa items
        for (const title in data) {
            const div = document.createElement("div");
            div.classList.add("manhwa-item");

            // Create the image for the manhwa
            const img = document.createElement("img");
            img.src = images[title];
            img.alt = title;
            div.appendChild(img);

            // Create the text for the chapter
            const p = document.createElement("p");
            p.textContent = `${title}: Ch. ${data[title]}`;
            div.appendChild(p);

            // Append the manhwa item to the grid container
            container.appendChild(div);

            // Trigger desktop notification if chapter has changed
            if (lastChapters[title] && lastChapters[title] !== data[title]) {
                showNotification(title, data[title]);
            }

            // Update the last seen chapter
            lastChapters[title] = data[title];
        }

    } catch (err) {
        console.error("Error fetching chapters: ", err);
    }
}

// Show desktop notification for new chapter
function showNotification(title, chapter) {
    if (Notification.permission === "granted") {
        new Notification("New Chapter Released!", {
            body: `${title}: Ch. ${chapter}`,
            icon: images[title]
        });
    }
}

// Request permission for notifications if not already granted
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

// Initial fetch for chapters
fetchChapters();

// Set interval to update chapters every 2 hours (7200000 ms)
setInterval(fetchChapters, 7200000);
