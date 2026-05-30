"""
Enhanced Mood Analyzer with ML-based sentiment analysis.
"""
import re
import json
import os
import numpy as np
import logging
from dataclasses import dataclass
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple, Union, Any
import io
import base64
import nltk

# Download NLTK resources for sentence tokenization
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

import torch
from torch.nn.functional import softmax
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    logging as transformers_logging
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Reduce transformers logging
if not os.environ.get('DEBUG'):
    transformers_logging.set_verbosity_error()

@dataclass
class ModelConfig:
    """Configuration for the emotion classification model."""
    model_name: str = "distilbert-base-uncased-finetuned-sst-2-english"
    cache_dir: str = ".model_cache"
    use_gpu: bool = torch.cuda.is_available()
    max_length: int = 128

class MLMoodAnalyzer:
    """
    ML-based mood analyzer using pre-trained transformer models.
    """
    
    def __init__(self, config: Optional[ModelConfig] = None):
        """Initialize with optional configuration."""
        self.config = config or ModelConfig()
        self.device = torch.device("cuda" if self.config.use_gpu and torch.cuda.is_available() else "cpu")
        
        logger.info(f"Initializing MLMoodAnalyzer on {self.device}")
        
        try:
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.cache_dir
            )
            self.model = AutoModelForSequenceClassification.from_pretrained(
                self.config.model_name,
                cache_dir=self.config.cache_dir
            ).to(self.device)
            self.model.eval()
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}")
            raise
        
        # Work-related keywords for context
        self.work_keywords = ['work', 'job', 'career', 'project', 'office', 'team']
        
        # Initialize metrics
        self.metrics = {
            'total_analyses': 0,
            'successful_analyses': 0,
            'failed_analyses': 0,
            'analysis_times': []
        }

    def analyze(self, text: str, voice_data: Optional[Union[str, Dict]] = None) -> Dict:
        """
        Analyze text to determine mood using ML model.
        
        Args:
            text: Input text to analyze
            voice_data: Optional base64 audio data URL string (e.g., data:audio/wav;base64,...)
            
        Returns:
            Dictionary containing mood analysis results
        """
        start_time = datetime.now()
        self.metrics['total_analyses'] += 1
        
        result = {
            'mood': 'neutral',
            'intensity': 0.5,
            'confidence': 0.0,
            'sentiment_scores': {},
            'features': {},
            'success': False,
            'error': None,
            'analysis': '',
            'sentence_analysis': []
        }

        try:
            if not text or not isinstance(text, str):
                # If text missing but voice provided, attempt audio-only analysis
                if voice_data:
                    audio_res = self._analyze_audio(voice_data)
                    # Normalize output structure to match expected
                    return {
                        'mood': audio_res['mood'],
                        'intensity': float(audio_res['intensity']),
                        'confidence': float(audio_res['confidence']),
                        'sentiment_scores': {},
                        'features': audio_res.get('features', {}),
                        'success': True,
                        'error': None,
                        'analysis': f"Detected {audio_res['mood']} mood from voice",
                        'sentence_analysis': []
                    }
                return self._get_default_response()

            logger.debug(f"Analyzing text: '{text}'")
            
            # Split text into sentences
            sentences = nltk.sent_tokenize(text)
            if not sentences:
                sentences = [text]  # Fallback if sentence tokenization fails
                
            logger.debug(f"Split into {len(sentences)} sentences")
            
            # Analyze each sentence
            sentence_results = []
            overall_sentiment_score = 0
            overall_positive_score = 0
            overall_negative_score = 0
            
            for sentence in sentences:
                sentence_result = self._analyze_sentence(sentence)
                sentence_results.append(sentence_result)
                
                # Accumulate scores for overall sentiment
                overall_sentiment_score += sentence_result['sentiment_score']
                overall_positive_score += sentence_result['positive_score']
                overall_negative_score += sentence_result['negative_score']
            
            # Calculate average scores
            num_sentences = len(sentences)
            avg_sentiment_score = overall_sentiment_score / num_sentences
            avg_positive_score = overall_positive_score / num_sentences
            avg_negative_score = overall_negative_score / num_sentences
            
            # Determine overall mood based on average sentiment score
            # Use tempered scaling to avoid saturating intensity at 1.0 for typical inputs
            if avg_sentiment_score > 0.6:
                mood = "happy"
                intensity = min(0.85, 0.4 + (avg_sentiment_score - 0.6) * 0.75)
            elif avg_sentiment_score > 0.2:
                mood = "neutral"
                intensity = 0.3 + (avg_sentiment_score - 0.2) * 0.5
            else:
                mood = "sad"
                intensity = min(0.85, 0.4 + (0.2 - avg_sentiment_score) * 0.6)
            
            # Check for work context
            is_work_related = any(word in text.lower() for word in self.work_keywords)
            
            # Enhance work-related positive sentiment
            if is_work_related and mood == "happy":
                mood = "happy_at_work"
                intensity = min(1.0, intensity * 1.2)
                analysis = "Positive work-related sentiment detected"
            else:
                analysis = f"Detected {mood} mood"
            
            # Update metrics
            self.metrics['successful_analyses'] += 1
            analysis_time = (datetime.now() - start_time).total_seconds()
            self.metrics['analysis_times'].append(analysis_time)
            if len(self.metrics['analysis_times']) > 100:  # Keep last 100 measurements
                self.metrics['analysis_times'].pop(0)
            
            # Prepare text-only baseline result
            # Temper confidence as well to avoid constant 1.0
            _conf = float(max(avg_positive_score, avg_negative_score))
            _conf = float(min(0.95, max(0.4, _conf)))

            text_only_result = {
                'mood': mood,
                'intensity': float(intensity),
                'confidence': _conf,
                'sentiment_scores': {
                    'positive': float(avg_positive_score),
                    'negative': float(avg_negative_score),
                    'compound': float(avg_sentiment_score)
                },
                'features': {
                    'is_work_related': is_work_related,
                    'text_length': len(text),
                    'sentence_count': num_sentences
                },
                'success': True,
                'analysis': analysis,
                'sentence_analysis': sentence_results
            }

            # If voice data is provided, blend audio-derived mood with text-derived mood
            if voice_data:
                try:
                    audio_res = self._analyze_audio(voice_data)
                except Exception as ae:
                    logger.warning(f"Audio analysis failed: {ae}")
                    audio_res = None

                if audio_res and audio_res.get('mood'):
                    # Simple fusion strategy: choose the signal with higher confidence,
                    # otherwise prefer non-neutral over neutral, else average.
                    text_conf = text_only_result['confidence']
                    audio_conf = float(audio_res.get('confidence', 0.0))
                    chosen = 'audio' if audio_conf >= (text_conf + 0.05) else 'text'
                    if chosen == 'audio':
                        fused_mood = audio_res['mood']
                        fused_intensity = float(audio_res['intensity'])
                        fused_confidence = float(audio_conf)
                        fused_analysis = f"Voice-driven mood ({fused_mood}) overrides text ({text_only_result['mood']})"
                    else:
                        fused_mood = text_only_result['mood']
                        fused_intensity = float(text_only_result['intensity'])
                        fused_confidence = float(text_conf)
                        fused_analysis = text_only_result['analysis']

                    # If both agree but one is low confidence, nudge intensity by averaging
                    if audio_res['mood'] == text_only_result['mood']:
                        fused_intensity = float((fused_intensity + float(audio_res['intensity'])) / 2.0)
                        fused_confidence = float(max(text_conf, audio_conf))

                    result.update({
                        **text_only_result,
                        'mood': fused_mood,
                        'intensity': fused_intensity,
                        'confidence': fused_confidence,
                        'analysis': fused_analysis,
                        'features': {
                            **text_only_result.get('features', {}),
                            'audio_features': audio_res.get('features', {})
                        }
                    })
                else:
                    result.update(text_only_result)
            else:
                result.update(text_only_result)
            
            logger.info(f"Analysis complete. Mood: {mood}, Confidence: {result['confidence']:.2f}")
            
        except Exception as e:
            error_msg = f"Error in ML mood analysis: {str(e)}"
            logger.error(error_msg, exc_info=True)
            self.metrics['failed_analyses'] += 1
            result.update({
                'error': error_msg,
                'success': False
            })
        
        return result

    def _analyze_audio(self, voice_data: Union[str, Dict]) -> Dict:
        """Analyze base64-encoded audio (WAV/PCM preferred) to estimate mood.
        Returns mood, intensity (0..1), confidence (0..1), and extracted features.
        """
        import soundfile as sf
        import librosa

        # Extract raw base64 from data URL or dict
        audio_b64: Optional[str] = None
        if isinstance(voice_data, str):
            if voice_data.startswith('data:'):
                try:
                    audio_b64 = voice_data.split(',')[1]
                except Exception:
                    audio_b64 = voice_data
            else:
                audio_b64 = voice_data
        elif isinstance(voice_data, dict):
            audio_b64 = voice_data.get('base64') or voice_data.get('data')

        if not audio_b64:
            raise ValueError('Invalid voice_data payload')

        audio_bytes = base64.b64decode(audio_b64)
        bio = io.BytesIO(audio_bytes)

        # Load audio
        try:
            y, sr = librosa.load(bio, sr=None, mono=True)
        except Exception:
            # Fallback: decode with soundfile then hand to librosa
            bio.seek(0)
            data, sr = sf.read(bio, always_2d=False)
            y = data if isinstance(data, np.ndarray) else np.array(data, dtype=np.float32)
            if y.ndim > 1:
                y = y[:, 0]

        if y is None or len(y) < sr * 0.3:
            raise ValueError('Audio too short for analysis')

        # Features
        rms = librosa.feature.rms(y=y, frame_length=2048, hop_length=512)[0]
        zcr = librosa.feature.zero_crossing_rate(y=y, frame_length=2048, hop_length=512)[0]
        centroid = librosa.feature.spectral_centroid(y=y, sr=sr, hop_length=512)[0]
        try:
            f0 = librosa.pyin(y, fmin=librosa.note_to_hz('C2'), fmax=librosa.note_to_hz('C7'))
            # f0 returns array with floats or nan; take median of non-nan
            f0_vals = np.array([v for v in f0 if v == v])  # filter NaN
            pitch_hz = float(np.median(f0_vals)) if f0_vals.size else None
        except Exception:
            pitch_hz = None

        avg_rms = float(np.mean(rms))
        std_rms = float(np.std(rms))
        avg_zcr = float(np.mean(zcr))
        avg_centroid = float(np.mean(centroid))

        # Heuristic mapping similar to client-side, tuned for audio features
        mood = 'neutral'
        intensity = 0.5
        confidence = 0.5

        high_pitch = (pitch_hz or 0) > 240
        low_pitch = (pitch_hz or 0) > 0 and (pitch_hz or 0) < 115
        high_energy = avg_rms > 0.025
        low_energy = avg_rms < 0.015
        high_activity = avg_zcr > 0.08 or avg_centroid > 2500
        low_activity = avg_zcr < 0.04 and avg_centroid < 1800
        high_variability = std_rms > 0.015
        low_variability = std_rms < 0.007

        if high_pitch and high_energy and (high_activity or high_variability):
            mood = 'excited'; intensity = 0.72
        elif high_energy and high_variability and not high_pitch:
            mood = 'angry'; intensity = 0.7
        elif high_pitch and not high_energy and (high_activity or high_variability):
            mood = 'worried'; intensity = 0.6
        elif low_pitch and low_energy and low_activity and low_variability:
            mood = 'peaceful'; intensity = 0.55
        elif low_pitch and low_energy:
            mood = 'sad'; intensity = 0.6
        elif low_energy and low_variability:
            mood = 'bored'; intensity = 0.45
        elif not low_energy and not high_energy and low_variability:
            mood = 'calm'; intensity = 0.55
        elif low_energy and not low_pitch and low_variability:
            mood = 'relaxed'; intensity = 0.55
        else:
            mood = 'calm' if avg_rms < 0.02 else 'neutral'
            intensity = 0.55 if mood == 'calm' else 0.5

        confidence = float(min(0.9, max(0.35,
                              (0.2 if pitch_hz else 0) +
                              (0.2 if (high_energy or low_energy) else 0.1) +
                              (0.1 if high_variability else 0)
                            )))

        return {
            'mood': mood,
            'intensity': intensity,
            'confidence': confidence,
            'features': {
                'pitchHz': pitch_hz,
                'avgRms': avg_rms,
                'stdRms': std_rms,
                'avgZcr': avg_zcr,
                'avgCentroid': avg_centroid,
            }
        }
        
    def _analyze_sentence(self, sentence: str) -> Dict:
        """
        Analyze a single sentence to determine its sentiment.
        
        Args:
            sentence: A single sentence to analyze
            
        Returns:
            Dictionary containing sentence analysis results
        """
        try:
            # Get model predictions for the sentence
            inputs = self.tokenizer(
                sentence,
                return_tensors="pt",
                truncation=True,
                padding=True,
                max_length=self.config.max_length
            ).to(self.device)
            
            with torch.no_grad():
                outputs = self.model(**inputs)
            
            # Process model outputs
            probs = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]
            sentiment_score = probs[1] - probs[0]  # Positive - Negative
            
            # Determine mood based on sentiment score with tempered scaling
            if sentiment_score > 0.6:
                mood = "happy"
                intensity = min(0.85, 0.4 + (sentiment_score - 0.6) * 0.75)
            elif sentiment_score > 0.2:
                mood = "neutral"
                intensity = 0.3 + (sentiment_score - 0.2) * 0.5
            else:
                mood = "sad"
                intensity = min(0.85, 0.4 + (0.2 - sentiment_score) * 0.6)
                
            # Check for work context
            is_work_related = any(word in sentence.lower() for word in self.work_keywords)
            
            # Enhance work-related positive sentiment
            if is_work_related and mood == "happy":
                mood = "happy_at_work"
                intensity = min(1.0, intensity * 1.2)
            
            # Temper confidence
            _conf = float(max(probs))
            _conf = float(min(0.95, max(0.4, _conf)))

            return {
                'sentence': sentence,
                'mood': mood,
                'intensity': float(intensity),
                'confidence': _conf,
                'positive_score': float(probs[1]),
                'negative_score': float(probs[0]),
                'sentiment_score': float(sentiment_score),
                'is_work_related': is_work_related
            }
            
        except Exception as e:
            logger.error(f"Error analyzing sentence: {str(e)}")
            return {
                'sentence': sentence,
                'mood': 'neutral',
                'intensity': 0.5,
                'confidence': 0.0,
                'positive_score': 0.5,
                'negative_score': 0.5,
                'sentiment_score': 0.0,
                'is_work_related': False,
                'error': str(e)
            }

    def get_performance_metrics(self) -> Dict:
        """Get performance metrics for the analyzer."""
        times = self.metrics['analysis_times']
        return {
            'total_analyses': self.metrics['total_analyses'],
            'success_rate': (self.metrics['successful_analyses'] / 
                           max(1, self.metrics['total_analyses'])) * 100,
            'avg_analysis_time': np.mean(times) if times else 0,
            'min_analysis_time': min(times) if times else 0,
            'max_analysis_time': max(times) if times else 0
        }

    def _get_default_response(self) -> Dict:
        """Return a default response when analysis fails."""
        return {
            'mood': 'neutral',
            'intensity': 0.5,
            'confidence': 0.0,
            'sentiment_scores': {},
            'features': {},
            'success': False,
            'error': 'Invalid input text',
            'analysis': 'Unable to analyze mood',
            'sentence_analysis': []
        }

# For backward compatibility
MoodAnalyzer = MLMoodAnalyzer
