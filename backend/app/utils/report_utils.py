import csv
import io
from fastapi.responses import StreamingResponse
from datetime import datetime

async def generate_user_report(predictions: list, email: str):
    """Generate a CSV report for a user's predictions"""
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header row
    writer.writerow(["Email", "Prediction Date", "Predicted LOS (days)", "Mortality %", "Risk Level"])
    
    # Data rows
    for p in predictions:
        timestamp = p.get("timestamp")
        date_str = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        writer.writerow([
            p.get("email"),
            date_str,
            p.get("predicted_LOS_days"),
            p.get("in_hospital_mortality_%"),
            p.get("mortality_risk_level")
        ])
    
    output.seek(0)
    
    filename = f"user_report_{email.replace('@', '_at_')}.csv"
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
