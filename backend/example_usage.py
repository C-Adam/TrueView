"""
Example Usage - Gemini Explainability Engine

This file shows different ways to use the ExplainabilityEngine
in your application.
"""

from attrClassifier import MediaAnalyzer
from explainability import ExplainabilityEngine


# ============================================================================
# Example 1: Basic Usage
# ============================================================================

def example_basic():
    """Most basic usage - analyze and explain"""
    print("\n" + "="*80)
    print("EXAMPLE 1: Basic Usage")
    print("="*80 + "\n")
    
    # Initialize
    analyzer = MediaAnalyzer()
    explainer = ExplainabilityEngine()
    
    # Analyze video
    results = analyzer.analyze_video('../media/lion_ai_video.mp4')
    
    # Get explanation
    explanation = explainer.explain_overall_analysis(results)
    
    print("Explanation:")
    print(explanation)


# ============================================================================
# Example 2: Both Explanation Types
# ============================================================================

def example_both_types():
    """Get both overall and metric-focused explanations"""
    print("\n" + "="*80)
    print("EXAMPLE 2: Both Explanation Types")
    print("="*80 + "\n")
    
    analyzer = MediaAnalyzer()
    explainer = ExplainabilityEngine()
    
    # Analyze
    results = analyzer.analyze_image('../media/ai_cow.png')
    
    # Get both types
    overall = explainer.explain_overall_analysis(results)
    metrics = explainer.explain_specific_metrics(results)
    
    print("📊 OVERALL EXPLANATION (for users):")
    print("-" * 80)
    print(overall)
    print()
    
    print("📈 METRIC EXPLANATION (for developers):")
    print("-" * 80)
    print(metrics)


# ============================================================================
# Example 3: Error Handling
# ============================================================================

def example_with_error_handling():
    """Proper error handling for production use"""
    print("\n" + "="*80)
    print("EXAMPLE 3: With Error Handling")
    print("="*80 + "\n")
    
    try:
        analyzer = MediaAnalyzer()
        explainer = ExplainabilityEngine()
        
        # Analyze
        results = analyzer.analyze_video('../media/lion_ai_video.mp4')
        
        # Get explanation with error handling
        try:
            explanation = explainer.explain_overall_analysis(results)
            print("✅ Explanation generated successfully:")
            print(explanation)
        except Exception as e:
            print(f"⚠️  Could not generate explanation: {e}")
            explanation = "Analysis completed but explanation unavailable."
            print(f"Fallback: {explanation}")
            
    except FileNotFoundError as e:
        print(f"❌ File not found: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")


# ============================================================================
# Example 4: Batch Processing
# ============================================================================

def example_batch_processing():
    """Process multiple files"""
    print("\n" + "="*80)
    print("EXAMPLE 4: Batch Processing")
    print("="*80 + "\n")
    
    # List of files to process
    files = [
        {'path': '../media/lion_ai_video.mp4', 'type': 'video'},
        {'path': '../media/ai_cow.png', 'type': 'image'},
    ]
    
    analyzer = MediaAnalyzer()
    explainer = ExplainabilityEngine()
    
    results_list = []
    
    for file_info in files:
        print(f"\nProcessing: {file_info['path']}")
        
        try:
            # Analyze based on type
            if file_info['type'] == 'video':
                results = analyzer.analyze_video(file_info['path'])
            else:
                results = analyzer.analyze_image(file_info['path'])
            
            # Get explanation
            explanation = explainer.explain_overall_analysis(results)
            
            # Store results
            results_list.append({
                'file': file_info['path'],
                'type': file_info['type'],
                'metrics': results['metrics'],
                'explanation': explanation
            })
            
            print(f"✅ Completed: {file_info['path']}")
            print(f"   Explanation: {explanation[:100]}...")
            
        except Exception as e:
            print(f"❌ Failed: {e}")
    
    print(f"\n📊 Processed {len(results_list)} files successfully")
    return results_list


# ============================================================================
# Example 5: Web API Integration (Flask-style)
# ============================================================================

def example_web_api_style():
    """How to use in a web API endpoint"""
    print("\n" + "="*80)
    print("EXAMPLE 5: Web API Integration Pattern")
    print("="*80 + "\n")
    
    # Simulating a web request
    request_data = {
        'file_path': '../media/lion_ai_video.mp4',
        'media_type': 'video',
        'include_technical': True  # Whether to include metric explanation
    }
    
    print(f"Simulating API request: {request_data}")
    
    # Process request
    analyzer = MediaAnalyzer()
    explainer = ExplainabilityEngine()
    
    try:
        # Analyze
        if request_data['media_type'] == 'video':
            results = analyzer.analyze_video(request_data['file_path'])
        else:
            results = analyzer.analyze_image(request_data['file_path'])
        
        # Build response
        response = {
            'success': True,
            'metadata': results['metadata'],
            'metrics': results['metrics'],
            'explanation': explainer.explain_overall_analysis(results)
        }
        
        # Add technical explanation if requested
        if request_data.get('include_technical'):
            response['technical_explanation'] = explainer.explain_specific_metrics(results)
        
        print("\n✅ API Response:")
        print(f"   Success: {response['success']}")
        print(f"   Media Type: {response['metadata']['type']}")
        print(f"   Explanation: {response['explanation'][:100]}...")
        
        return response
        
    except Exception as e:
        print(f"\n❌ API Error Response:")
        return {
            'success': False,
            'error': str(e)
        }


# ============================================================================
# Example 6: Comparison Mode
# ============================================================================

def example_comparison():
    """Compare two media files"""
    print("\n" + "="*80)
    print("EXAMPLE 6: Comparing Two Files")
    print("="*80 + "\n")
    
    analyzer = MediaAnalyzer()
    explainer = ExplainabilityEngine()
    
    # Analyze both files
    file1 = '../media/lion_ai_video.mp4'
    file2 = '../media/ai_cow.png'
    
    try:
        results1 = analyzer.analyze_video(file1)
        results2 = analyzer.analyze_image(file2)
        
        explanation1 = explainer.explain_overall_analysis(results1)
        explanation2 = explainer.explain_overall_analysis(results2)
        
        print(f"📹 File 1: {file1}")
        print(f"   Type: {results1['metadata']['type']}")
        print(f"   Explanation: {explanation1[:150]}...")
        print()
        
        print(f"🖼️  File 2: {file2}")
        print(f"   Type: {results2['metadata']['type']}")
        print(f"   Explanation: {explanation2[:150]}...")
        
    except Exception as e:
        print(f"❌ Error: {e}")


# ============================================================================
# Example 7: Custom Response Format
# ============================================================================

def example_custom_format():
    """Format results for specific use case"""
    print("\n" + "="*80)
    print("EXAMPLE 7: Custom Response Format")
    print("="*80 + "\n")
    
    analyzer = MediaAnalyzer()
    explainer = ExplainabilityEngine()
    
    results = analyzer.analyze_video('../media/lion_ai_video.mp4')
    
    # Create custom formatted response
    custom_response = {
        'file_info': {
            'type': results['metadata']['type'],
            'duration': results['metadata'].get('duration', 'N/A'),
            'resolution': f"{results['metadata']['width']}x{results['metadata']['height']}"
        },
        'analysis': {
            'user_explanation': explainer.explain_overall_analysis(results),
            'technical_details': explainer.explain_specific_metrics(results),
            'raw_metrics': results['metrics']
        },
        'verdict': 'AI-Generated' if results['metrics']['avg_motion'] < 10 else 'Possibly Authentic'
    }
    
    print("Custom formatted response:")
    print(f"  File Type: {custom_response['file_info']['type']}")
    print(f"  Resolution: {custom_response['file_info']['resolution']}")
    print(f"  Verdict: {custom_response['verdict']}")
    print(f"  User Explanation: {custom_response['analysis']['user_explanation'][:100]}...")


# ============================================================================
# Main - Run All Examples
# ============================================================================

def main():
    """Run all examples"""
    print("\n" + "╔" + "═"*78 + "╗")
    print("║" + " "*20 + "GEMINI EXPLAINABILITY - USAGE EXAMPLES" + " "*20 + "║")
    print("╚" + "═"*78 + "╝")
    
    print("\nThis script demonstrates different ways to use the ExplainabilityEngine.")
    print("Each example shows a different use case or pattern.\n")
    
    try:
        # Run examples
        example_basic()
        example_both_types()
        example_with_error_handling()
        example_batch_processing()
        example_web_api_style()
        example_comparison()
        example_custom_format()
        
        print("\n" + "="*80)
        print("✅ All examples completed!")
        print("="*80)
        
    except Exception as e:
        print(f"\n❌ Error running examples: {e}")
        print("Make sure:")
        print("  1. GEMINI_API_KEY is set in .env")
        print("  2. Media files exist in ../media/")
        print("  3. google-generativeai is installed")


if __name__ == "__main__":
    main()