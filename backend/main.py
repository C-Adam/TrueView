from detector import scan_image, scan_video
from attrClassifier import MediaAnalyzer
import sys, mimetypes
from explainability import ExplainabilityEngine

def detect_file_type(path):
    mime_type, _ = mimetypes.guess_type(path)
    if mime_type:
        if mime_type.startswith("image"):
            return "image"
        elif mime_type.startswith("video"):
            return "video"
    return "unknown"

async def main():
    if len(sys.argv) < 2:
        print("No file provided")
        return

    file_path = sys.argv[1]
    file_type = detect_file_type(file_path)

    if file_type == "unknown":
        raise ValueError("Unsupported file type")
    
    ai_scan_result = None

    analyzer = MediaAnalyzer()

    explainer = ExplainabilityEngine()

    if file_type == "image":
        ai_scan_result = scan_image(file_path)
        analysis_result = await analyzer._analyze_image(file_path)
        briefOverview = await explainer.explain_overall_analysis(analysis_result)
        metricSpecificOverview = await explainer.explain_specific_metrics()
    elif file_type == "video":
        ai_scan_result = scan_video(file_path)
        analysis_result = await analyzer._analyze_video(file_path)


    print("Result:", ai_scan_result)
    print("Analysis:", analysis_result)

main()
