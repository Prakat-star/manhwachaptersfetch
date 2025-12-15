from flask import Flask, render_template, jsonify
import requests

app = Flask(__name__)

MANHWAS = [
    "Top Tier Providence",
    "My Bias Gets On The Last Train",
    "I Am The Fated Villain"
]

LANGUAGES = ["en"]

# Function to get the latest chapter from MangaDex API
def get_latest_chapter(title):
    try:
        # Search for the manga by title
        search_res = requests.get(
            "https://api.mangadex.org/manga",
            params={"title": title},
            timeout=15
        ).json()

        manga_list = search_res.get("data", [])
        if not manga_list:
            return "N/A"

        manga_id = manga_list[0]["id"]

        # Fetch the latest chapter
        chap_res = requests.get(
            "https://api.mangadex.org/chapter",
            params={
                "manga": manga_id,
                "translatedLanguage[]": LANGUAGES,
                "order[chapter]": "desc",
                "limit": 1
            },
            timeout=15
        ).json()

        chapters = chap_res.get("data", [])
        if not chapters:
            return "N/A"

        return chapters[0]["attributes"].get("chapter", "N/A")
    except:
        return "N/A"


# Route for the homepage (index.html)
@app.route("/")
def index():
    return render_template("index.html")  # Flask will look for this file in the 'templates' folder

# Route for fetching the latest chapters data
@app.route("/latest-chapters")
def latest_chapters():
    results = {title: get_latest_chapter(title) for title in MANHWAS}
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)  # Make sure Flask is running in debug mode
