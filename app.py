from flask import Flask, render_template, request, jsonify
import pandas as pd
import joblib

app = Flask(__name__)

# Load trained ML model and scaler
model = joblib.load("placement_model.pkl")
scaler = joblib.load("scaler.pkl")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Get values from frontend
        cgpa = float(data["CGPA"])
        tenth = float(data["10th_Percentage"])
        twelfth = float(data["12th_Percentage"])
        backlogs = int(data["Backlogs"])
        attendance = float(data["Attendance"])
        coding = float(data["Coding_Score"])
        aptitude = float(data["Aptitude_Score"])
        communication = float(data["Communication_Score"])
        internship = int(data["Internship"])
        projects = int(data["Projects"])
        certifications = int(data["Certifications"])
        hackathon = int(data["Hackathon"])

        # Create input DataFrame
        input_data = pd.DataFrame([[
            cgpa,
            tenth,
            twelfth,
            backlogs,
            attendance,
            coding,
            aptitude,
            communication,
            internship,
            projects,
            certifications,
            hackathon
        ]], columns=[
            "CGPA",
            "10th_Percentage",
            "12th_Percentage",
            "Backlogs",
            "Attendance",
            "Coding_Score",
            "Aptitude_Score",
            "Communication_Score",
            "Internship",
            "Projects",
            "Certifications",
            "Hackathon"
        ])

        # Scale input data
        input_scaled = scaler.transform(input_data)

        # Prediction
        prediction = model.predict(input_scaled)[0]

        # Probability
        probability = model.predict_proba(input_scaled)[0][1] * 100

        if prediction == 1:
            result = "Placed"
        else:
            result = "Not Placed"

        return jsonify({
            "status": "success",
            "prediction": result,
            "probability": round(probability, 2)
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400


if __name__ == "__main__":
    app.run(debug=True)