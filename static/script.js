document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("predictionForm");

    if (!form) {
        console.error("FORM NOT FOUND");
        return;
    }

    console.log("SCRIPT LOADED SUCCESSFULLY");

    form.addEventListener("submit", async function (event) {

        event.preventDefault();

        console.log("ANALYZE BUTTON CLICKED");

        const data = {
            CGPA: Number(document.getElementById("CGPA").value),
            "10th_Percentage": Number(document.getElementById("10th_Percentage").value),
            "12th_Percentage": Number(document.getElementById("12th_Percentage").value),
            Backlogs: Number(document.getElementById("Backlogs").value),
            Attendance: Number(document.getElementById("Attendance").value),
            Coding_Score: Number(document.getElementById("Coding_Score").value),
            Aptitude_Score: Number(document.getElementById("Aptitude_Score").value),
            Communication_Score: Number(document.getElementById("Communication_Score").value),
            Internship: Number(document.getElementById("Internship").value),
            Projects: Number(document.getElementById("Projects").value),
            Certifications: Number(document.getElementById("Certifications").value),
            Hackathon: Number(document.getElementById("Hackathon").value)
        };

        console.log("DATA:", data);

        // Check values
        for (const key in data) {
            if (Number.isNaN(data[key])) {
                alert("Please fill all details, including Internship and Hackathon.");
                return;
            }
        }

        try {

            console.log("SENDING REQUEST TO FLASK...");

            const response = await fetch("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            console.log("HTTP STATUS:", response.status);

            const result = await response.json();

            console.log("FLASK RESULT:", result);

            if (!response.ok) {
                throw new Error(result.message || "Server error");
            }

            if (result.status !== "success") {
                throw new Error(result.message || "Prediction failed");
            }

            // SHOW RESULT DIRECTLY
            alert(
                "PREDICTION RESULT\n\n" +
                "Status: " + result.prediction + "\n" +
                "Probability: " + result.probability + "%"
            );

            // Result section
            const resultSection = document.querySelector(".result-section");

            if (resultSection) {
                resultSection.style.display = "block";
                resultSection.style.visibility = "visible";
                resultSection.style.opacity = "1";
            }

            const resultRing =
                document.querySelector(".result-ring strong");

            if (resultRing) {
                resultRing.textContent =
                    Number(result.probability).toFixed(1) + "%";
            }

            const resultContent =
                document.querySelector(".result-content");

            if (resultContent) {

                resultContent.innerHTML = `
                    <div class="result-placeholder">

                        <div class="placeholder-icon">
                            ${result.prediction === "Placed" ? "✓" : "!"}
                        </div>

                        <h3>
                            ${result.prediction}
                        </h3>

                        <p>
                            Your placement probability is
                            <strong>${Number(result.probability).toFixed(1)}%</strong>
                        </p>

                    </div>
                `;
            }

            // Scroll
            if (resultSection) {
                resultSection.scrollIntoView({
                    behavior: "smooth"
                });
            }

        } catch (error) {

            console.error("ERROR:", error);

            alert(
                "PREDICTION ERROR\n\n" +
                error.message
            );
        }
    });
});