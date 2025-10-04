"""
Simple test script for Gemini Explainability Engine
Run this to test if everything is working correctly
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()


def print_header(text):
    """Print a nice header"""
    print("\n" + "=" * 80)
    print(f"  {text}")
    print("=" * 80 + "\n")


def print_success(text):
    """Print success message"""
    print(f"✅ {text}")


def print_error(text):
    """Print error message"""
    print(f"❌ {text}")


def print_info(text):
    """Print info message"""
    print(f"ℹ️  {text}")


def check_api_key():
    """Check if API key is configured"""
    print_header("Step 1: Checking API Key")
    
    api_key = os.getenv('GEMINI_API_KEY')
    
    if not api_key:
        print_error("GEMINI_API_KEY not found in environment variables")
        print_info("To fix this:")
        print("   1. Create a .env file in the backend directory")
        print("   2. Add this line: GEMINI_API_KEY=your_api_key_here")
        print("   3. Get your API key from: https://makersuite.google.com/app/apikey")
        return False
    
    print_success(f"API key found (starts with: {api_key[:10]}...)")
    return True


def check_dependencies():
    """Check if required packages are installed"""
    print_header("Step 2: Checking Dependencies")
    
    try:
        import google.generativeai as genai
        print_success("google-generativeai package is installed")
        return True
    except ImportError:
        print_error("google-generativeai package not found")
        print_info("To fix this, run: pip install google-generativeai")
        return False


def check_media_files():
    """Check if media files exist"""
    print_header("Step 3: Checking Media Files")
    
    # Get the project root directory (parent of backend)
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    
    video_path = project_root / 'media' / 'lion_ai_video.mp4'
    image_path = project_root / 'media' / 'ai_cow.png'
    
    video_exists = video_path.exists()
    image_exists = image_path.exists()
    
    if video_exists:
        print_success(f"Video file found: {video_path}")
    else:
        print_error(f"Video file not found: {video_path}")
        print_info("Update the path in test_gemini.py if your video is elsewhere")
    
    if image_exists:
        print_success(f"Image file found: {image_path}")
    else:
        print_error(f"Image file not found: {image_path}")
        print_info("Update the path in test_gemini.py if your image is elsewhere")
    
    return video_exists or image_exists


def test_video_analysis():
    """Test video analysis with Gemini explanations"""
    print_header("Step 4: Testing Video Analysis")
    
    try:
        from attrClassifier import MediaAnalyzer
        from explainability import ExplainabilityEngine
        
        # Get the project root directory
        script_dir = Path(__file__).parent
        project_root = script_dir.parent
        video_path = str(project_root / 'media' / 'lion_ai_video.mp4')
        
        # Analyze video
        print("📹 Analyzing video...")
        analyzer = MediaAnalyzer()
        results = analyzer.analyze_video(video_path)
        
        print_success("Video analysis completed")
        print(f"   Duration: {results['metadata']['duration']:.2f}s")
        print(f"   Frames: {results['metadata']['frame_count']}")
        print(f"   Resolution: {results['metadata']['width']}x{results['metadata']['height']}")
        
        # Get explanations
        print("\n🤖 Getting Gemini explanations...")
        explainer = ExplainabilityEngine()
        
        print("\n📊 Overall Explanation:")
        print("-" * 80)
        overall = explainer.explain_overall_analysis(results)
        print(overall)
        print("-" * 80)
        
        print("\n📈 Metric-Focused Explanation:")
        print("-" * 80)
        metrics = explainer.explain_specific_metrics(results)
        print(metrics)
        print("-" * 80)
        
        print_success("Video analysis test passed!")
        return True
        
    except FileNotFoundError as e:
        print_error(f"File not found: {e}")
        print_info("Make sure the video file path is correct")
        return False
    except Exception as e:
        print_error(f"Error during video analysis: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_image_analysis():
    """Test image analysis with Gemini explanations"""
    print_header("Step 5: Testing Image Analysis")
    
    try:
        from attrClassifier import MediaAnalyzer
        from explainability import ExplainabilityEngine
        
        # Get the project root directory
        script_dir = Path(__file__).parent
        project_root = script_dir.parent
        image_path = str(project_root / 'media' / 'ai_cow.png')
        
        # Analyze image
        print("🖼️  Analyzing image...")
        analyzer = MediaAnalyzer()
        results = analyzer.analyze_image(image_path)
        
        print_success("Image analysis completed")
        print(f"   Resolution: {results['metadata']['width']}x{results['metadata']['height']}")
        print(f"   Texture Variance: {results['metrics']['avg_texture_variance']:.2f}")
        
        # Get explanations
        print("\n🤖 Getting Gemini explanations...")
        explainer = ExplainabilityEngine()
        
        print("\n📊 Overall Explanation:")
        print("-" * 80)
        overall = explainer.explain_overall_analysis(results)
        print(overall)
        print("-" * 80)
        
        print("\n📈 Metric-Focused Explanation:")
        print("-" * 80)
        metrics = explainer.explain_specific_metrics(results)
        print(metrics)
        print("-" * 80)
        
        print_success("Image analysis test passed!")
        return True
        
    except FileNotFoundError as e:
        print_error(f"File not found: {e}")
        print_info("Make sure the image file path is correct")
        return False
    except Exception as e:
        print_error(f"Error during image analysis: {e}")
        import traceback
        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "╔" + "═" * 78 + "╗")
    print("║" + " " * 20 + "GEMINI EXPLAINABILITY ENGINE TEST" + " " * 25 + "║")
    print("╚" + "═" * 78 + "╝")
    
    # Run checks
    api_key_ok = check_api_key()
    if not api_key_ok:
        print_header("❌ Test Failed")
        print("Please set up your API key and try again.")
        return
    
    deps_ok = check_dependencies()
    if not deps_ok:
        print_header("❌ Test Failed")
        print("Please install required dependencies and try again.")
        return
    
    media_ok = check_media_files()
    if not media_ok:
        print_header("❌ Test Failed")
        print("Please ensure media files exist and try again.")
        return
    
    # Run tests
    video_ok = test_video_analysis()
    image_ok = test_image_analysis()
    
    # Summary
    print_header("📋 Test Summary")
    
    print("Setup Checks:")
    print(f"  {'✅' if api_key_ok else '❌'} API Key Configuration")
    print(f"  {'✅' if deps_ok else '❌'} Dependencies Installed")
    print(f"  {'✅' if media_ok else '❌'} Media Files Available")
    
    print("\nFunctionality Tests:")
    print(f"  {'✅' if video_ok else '❌'} Video Analysis + Explanations")
    print(f"  {'✅' if image_ok else '❌'} Image Analysis + Explanations")
    
    if video_ok and image_ok:
        print("\n" + "🎉" * 40)
        print("\n✨ ALL TESTS PASSED! ✨")
        print("\nYour Gemini Explainability Engine is working perfectly!")
        print("You can now integrate it into your application.")
        print("\n" + "🎉" * 40)
    else:
        print("\n⚠️  Some tests failed. Please check the errors above.")


if __name__ == "__main__":
    main()