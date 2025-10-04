import cv2
import numpy as np
import os


class MediaAnalyzer:
    """
    Analyzes videos and images for deepfake detection using computer vision techniques.
    Extracts features like motion scores, edge consistency, and texture variance.
    """
    
    def __init__(self):
        self.frames = []
        self.motion_scores = []
        self.edge_consistency = []
        self.texture_variances = []
        self.edge_density = 0
        self.color_variance = 0
        self.edge_continuity = 0
        self.metadata = {}
    
    def _analyze_video(self, file_path):
        """
        Analyze a video file.
        
        Args:
            file_path (str): Path to the video file
            
        Returns:
            dict: Video analysis results
        """
        cap = cv2.VideoCapture(file_path)
        
        if not cap.isOpened():
            raise ValueError(f"Could not open video file: {file_path}")
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        self.metadata = {
            'type': 'video',
            'frame_count': frame_count,
            'fps': fps,
            'width': width,
            'height': height,
            'duration': frame_count / fps if fps > 0 else 0
        }
        
        sample_rate = max(frame_count // 10, 1)
        self.frames = []
        
        for i in range(0, frame_count, sample_rate):
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret:
                break
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            self.frames.append(gray)
        
        cap.release()
        
        self._calculate_motion_and_edges()
        self._calculate_texture_variance()
        
        return self._compile_results()
    
    def _analyze_image(self, file_path):
        """
        Analyze a single image file.
        
        Args:
            file_path (str): Path to the image file
            
        Returns:
            dict: Image analysis results
        """
        image = cv2.imread(file_path)
        
        if image is None:
            raise ValueError(f"Could not read image file: {file_path}")
        
        height, width = image.shape[:2]
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        self.metadata = {
            'type': 'image',
            'width': width,
            'height': height
        }
        
        self.frames = [gray]
        

        self.motion_scores = []
        self.edge_consistency = []
        self._calculate_texture_variance()
        
        self.edge_density = self._calculate_edge_density(gray)
        self.color_variance = self._calculate_color_variance(image)
        self.edge_continuity = self._calculate_edge_continuity(image)
        
        return self._compile_results()
    
    def _calculate_motion_and_edges(self):
        self.motion_scores = []
        self.edge_consistency = []
        
        for i in range(1, len(self.frames)):

            diff = cv2.absdiff(self.frames[i], self.frames[i-1])
            self.motion_scores.append(np.mean(diff))
            
            edges1 = cv2.Canny(self.frames[i-1], 100, 200)
            edges2 = cv2.Canny(self.frames[i], 100, 200)
            edge_diff = np.mean(cv2.absdiff(edges1, edges2))
            self.edge_consistency.append(edge_diff)
    
    def _calculate_texture_variance(self):
        self.texture_variances = [
            np.var(cv2.Laplacian(frame, cv2.CV_64F)) 
            for frame in self.frames
        ]
    
    def _calculate_edge_density(self, gray_image):
        edges = cv2.Canny(gray_image, 100, 200)
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])
        return edge_density
    
    def _calculate_color_variance(self, color_image):
        variances = [np.var(color_image[:, :, i]) for i in range(3)]
        return np.mean(variances)
    
    def _calculate_edge_continuity(self, img):
        edges = cv2.Canny(img, 100, 200)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        avg_len = np.mean([len(c) for c in contours]) if contours else 0
        return avg_len


    def _compile_results(self):
        """
        Compile all analysis results into a dictionary.
        
        Returns:
            dict: Complete analysis results
        """
        if self.metadata["type"] == 'video':
            results = {
                'metadata': self.metadata,
                'metrics': {
                    'avg_motion': np.mean(self.motion_scores) if self.motion_scores else 0,
                    'avg_edge_consistency': np.mean(self.edge_consistency) if self.edge_consistency else 0,
                    'avg_texture_variance': np.mean(self.texture_variances) if self.texture_variances else 0,
                    'motion_std': np.std(self.motion_scores) if self.motion_scores else 0,
                    'edge_std': np.std(self.edge_consistency) if self.edge_consistency else 0,
                    'texture_std': np.std(self.texture_variances) if self.texture_variances else 0,
                },
                'raw_data': {
                    'motion_scores': self.motion_scores,
                    'edge_consistency': self.edge_consistency,
                    'texture_variances': self.texture_variances,
                }
            }
        else:
            results = {
                'metadata': self.metadata,
                'metrics': {
                    'avg_texture_variance': np.mean(self.texture_variances) if self.texture_variances else 0,
                    'texture_std': np.std(self.texture_variances) if self.texture_variances else 0,
                    'edge_density': self.edge_density,
                    'color_variance': self.color_variance,
                    'edge_continuity': self.edge_continuity
                },
                'raw_data': {
                    'texture_variances': self.texture_variances,
                }
            }
        
        return results

#if __name__ == "__main__":
    # analyzer = MediaAnalyzer()
    # result = analyzer._analyze_image('../media/ai_cow.png')
    # result1 = analyzer._analyze_video('../media/lion_ai_video.mp4')
    #print(result)
    #print(result1)