import os
import google.generativeai as genai
from typing import Dict, Any

class ExplainabilityEngine:
    
    def __init__(self, api_key: str = None):
        """
        Initialize the ExplainabilityEngine.
        
        Args:
            api_key (str, optional): Gemini API key. If not provided, reads from GEMINI_API_KEY env variable.
        """
        self.api_key = api_key or os.getenv('GEMINI_API_KEY')
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-flash-latest')
    
    def explain_overall_analysis(self, results: Dict[str, Any]) -> str:
        """
        Provides a comprehensive natural language explanation of the entire analysis,
        focusing on the overall reasoning and conclusion.
        
        Args:
            results (dict): Analysis results from MediaAnalyzer containing metadata, metrics, and raw_data
            
        Returns:
            str: Natural language explanation of the overall analysis
        """
        media_type = results['metadata']['type']
        metrics = results['metrics']
        metadata = results['metadata']
        
        if media_type == 'video':
            prompt = self._build_video_overall_prompt(metadata, metrics)
        else:
            prompt = self._build_image_overall_prompt(metadata, metrics)
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating explanation: {str(e)}"
    
    def explain_specific_metrics(self, results: Dict[str, Any]) -> str:
        """
        Provides a short, metric-concentrated feedback focusing on specific
        numerical values and what they indicate.
        
        Args:
            results (dict): Analysis results from MediaAnalyzer containing metadata, metrics, and raw_data
            
        Returns:
            str: Concise metric-focused explanation
        """
        media_type = results['metadata']['type']
        metrics = results['metrics']
        
        if media_type == 'video':
            prompt = self._build_video_metrics_prompt(metrics)
        else:
            prompt = self._build_image_metrics_prompt(metrics)
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating metric explanation: {str(e)}"
    
    def _build_video_overall_prompt(self, metadata: Dict[str, Any], metrics: Dict[str, Any]) -> str:
        prompt = f"""You are an AI deepfake detection expert explaining analysis results to a non-technical user.

**Context:** A video file has been analyzed for signs of AI generation or manipulation.

**Video Information:**
- Duration: {metadata['duration']:.2f} seconds
- Frame Count: {metadata['frame_count']} frames
- Resolution: {metadata['width']}x{metadata['height']}
- FPS: {metadata['fps']:.2f}

**Analysis Metrics:**
- Average Motion: {metrics['avg_motion']:.2f}
- Motion Standard Deviation: {metrics['motion_std']:.2f}
- Average Edge Consistency: {metrics['avg_edge_consistency']:.2f} (std: {metrics['edge_std']:.2f})
- Average Texture Variance: {metrics['avg_texture_variance']:.2f} (std: {metrics['texture_std']:.2f})

| **Metric**                    | **Description**                                                                                                       |                             **Reference Range (Authentic Video)**                            |                                             **Suspicious Range (Possible AI / Interpolated)**                                             
| :---------------------------- | :-------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------: 
| **Average Motion**            | Measures overall pixel intensity change between consecutive frames. Reflects how much movement occurs frame to frame. |       **10 – 50** → Real footage has natural hand motion, jitter, or parallax changes.       | **< 10** → Overly smooth, AI-interpolated or generated video. **> 50** → Possible frame drops, stuttering, or synthetic motion artifacts.
| **Motion Standard Deviation** | Captures how *varied* the motion is across the video sequence.                                                        |           **5 – 20** → Indicates realistic variation from slow and fast movements.           |           **< 5** → Motion too uniform (AI smoothing). **> 20** → Erratic frame differences (glitchy or synthetic transitions).          
| **Edge Consistency**          | Measures how stable detected edges remain between frames — real edges change due to lighting, focus, and parallax.    |       **5 – 30** → Real videos show edge fluctuation as lighting and perspective shift.      |              **< 5** → Edges too stable (AI). **> 30** → Edge distortion or flickering (over-generated or poorly composited).            
| **Texture Variance**          | Measures overall frame-to-frame variation in fine detail (e.g., fur, grass, reflections).                             | **100 – 10,000** → Real videos have high diversity depending on surface detail and lighting. |       **< 100** → Overly clean, uniform surfaces (AI diffusion). **> 10,000** → Possibly noise injection or low-quality compression.     


**Task:** Provide a comprehensive, easy-to-understand explanation of whether this video appears authentic or AI-generated. 
Focus on:
1. Overall conclusion (likely authentic or AI-generated)
2. Main reasoning behind the conclusion
3. Which patterns are most significant
4. Confidence level in the assessment

Keep the explanation conversational and accessible to non-technical users. Use 1 paragraph."""

        return prompt
    
    def _build_image_overall_prompt(self, metadata: Dict[str, Any], metrics: Dict[str, Any]) -> str:
        """Build prompt for overall image analysis explanation."""
        prompt = f"""You are an AI deepfake detection expert explaining analysis results to a non-technical user.

**Context:** An image file has been analyzed for signs of AI generation.

**Image Information:**
- Resolution: {metadata['width']}x{metadata['height']}

**Analysis Metrics:**
- Texture Variance: {metrics['avg_texture_variance']:.2f} (std: {metrics['texture_std']:.2f})
- Edge Density: {metrics['edge_density']:.4f}
- Color Variance: {metrics['color_variance']:.2f}
- Edge Continuity: {metrics['edge_continuity']:.2f}

| **Metric**           | **Description**                                                                               | **Typical Range (Authentic Frame)** |                    **Suspicious Range (AI/Generated)**                    
| :------------------- | :-------------------------------------------------------------------------------------------- | :---------------------------------: | :----------------------------------------------------------------------: 
| **Texture Variance** | Measures local variance of fine details (fur, grass, skin).                                   |             **250–600**             |                  **< 200** → Overly smooth, fake texture                 
| **Edge Density**     | Ratio of detected edges to total pixels — shows how detailed or sharp an image is.            |            **0.03–0.10**            | **< 0.02** → Blurry, **> 0.12** → Oversharpened or artificially enhanced 
| **Color Variance**   | Measures diversity in color saturation and hue distribution.                                  |            **3000–8000**            |     **< 2500** → Overly uniform palette, **> 10000** → Over-saturated    
| **Edge Continuity**  | Average contour length across all detected edges — shows how continuous vs. broken edges are. |   **20–80 px avg contour length**   |  **< 15** → Fragmented edges, **> 90** → Melting or overconnected edges  |


**Task:** Provide a comprehensive, easy-to-understand explanation of whether this image appears authentic or AI-generated.
Focus on:
1. Overall conclusion (likely authentic or AI-generated)
2. Main reasoning behind the conclusion
3. Which visual characteristics are most telling
4. Confidence level in the assessment

Keep the explanation conversational and accessible to non-technical users. Use 1 paragraph."""

        return prompt
    
    def _build_video_metrics_prompt(self, metrics: Dict[str, Any]) -> str:
        """Build prompt for metric-focused video explanation."""
        prompt = f"""You are an AI deepfake detection expert. Provide a SHORT, metric-focused analysis.

**Video Metrics:**
- Average Motion: {metrics['avg_motion']:.2f}
- Motion Standard Deviation: {metrics['motion_std']:.2f}
- Average Edge Consistency: {metrics['avg_edge_consistency']:.2f} (std: {metrics['edge_std']:.2f})
- Average Texture Variance: {metrics['avg_texture_variance']:.2f} (std: {metrics['texture_std']:.2f})

**Normal Ranges:**
- Motion: 10-50
- Motion std: 5-20
- Edge Consistency: 5-30, Edge std: 2-15
- Texture Variance: 100-10000, Texture std: 50-5000

**Task:** In 3-5 bullet points, explain what each metric value indicates:
- State if each metric is within normal range, suspiciously low, or suspiciously high
- Explain what the deviation means to someone non technical, make sure you use real world examples to explain terms. (e.g., "unusually low motion suggests synthetic frames")
- Highlight the most suspicious metric(s)

Be concise and technical. Focus on the numbers."""

        return prompt
    
    def _build_image_metrics_prompt(self, metrics: Dict[str, Any]) -> str:
        """Build prompt for metric-focused image explanation."""
        prompt = f"""You are an AI deepfake detection expert. Provide a SHORT, metric-focused analysis.

**Image Metrics:**
- Texture Variance: {metrics['avg_texture_variance']:.2f} (std: {metrics['texture_std']:.2f})
- Edge Density: {metrics['edge_density']:.4f}
- Color Variance: {metrics['color_variance']:.2f}
- Edge Continuity: {metrics['edge_continuity']:.2f}

**Normal Ranges:**
- Texture Variance: 100-10000
- Edge Density: 0.05-0.20
- Color Variance: 500-5000
- Edge Continuity: 50-500

**Task:** In 3-5 bullet points, explain what each metric value indicates:
- State if each metric is within normal range, suspiciously low, or suspiciously high
- Explain what the deviation means, to someone non technical, make sure you use real world examples to explain terms. (e.g., "low texture variance suggests over-smoothing typical of AI")
- Highlight the most suspicious metric(s)

Be concise and technical. Focus on the numbers."""

        return prompt


if __name__ == "__main__":
    # Example usage
    from attrClassifier import MediaAnalyzer
    from pathlib import Path
    
    script_dir = Path(__file__).parent
    project_root = script_dir.parent
    video_path = str(project_root / 'media' / 'lion_ai_video.mp4')
    image_path = str(project_root / 'media' / 'ai_cow.png')
    
    analyzer = MediaAnalyzer()
    video_results = analyzer.analyze_video(video_path)
    image_results = analyzer.analyze_image(image_path)
    
    explainer = ExplainabilityEngine()
    
    print("=" * 80)
    print("VIDEO ANALYSIS - OVERALL EXPLANATION")
    print("=" * 80)
    overall_video = explainer.explain_overall_analysis(video_results)
    print(overall_video)
    print("\n")
    
    print("=" * 80)
    print("VIDEO ANALYSIS - METRIC-FOCUSED EXPLANATION")
    print("=" * 80)
    metrics_video = explainer.explain_specific_metrics(video_results)
    print(metrics_video)
    print("\n")
    
    print("=" * 80)
    print("IMAGE ANALYSIS - OVERALL EXPLANATION")
    print("=" * 80)
    overall_image = explainer.explain_overall_analysis(image_results)
    print(overall_image)
    print("\n")
    
    print("=" * 80)
    print("IMAGE ANALYSIS - METRIC-FOCUSED EXPLANATION")
    print("=" * 80)
    metrics_image = explainer.explain_specific_metrics(image_results)
    print(metrics_image)