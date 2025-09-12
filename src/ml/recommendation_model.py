# ml/recommendation_model.py
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import tensorflow as tf
from tensorflow.keras import layers
import pickle
import os

class RecommendationModel:
    def __init__(self):
        self.content_vectorizer = TfidfVectorizer(stop_words='english')
        self.user_embeddings = {}
        self.post_embeddings = {}
        self.model_path = 'models/recommendation_model'
        
        # Neural network for learning user-post interactions
        self.model = self._build_neural_network()
        
    def _build_neural_network(self):
        user_input = layers.Input(shape=(100,))  # User embedding dimension
        post_input = layers.Input(shape=(100,))  # Post embedding dimension
        
        # Combine user and post features
        concat = layers.Concatenate()([user_input, post_input])
        
        # Dense layers
        dense1 = layers.Dense(128, activation='relu')(concat)
        dense2 = layers.Dense(64, activation='relu')(dense1)
        output = layers.Dense(1, activation='sigmoid')(dense2)
        
        model = tf.keras.Model(inputs=[user_input, post_input], outputs=output)
        model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        return model
    
    def train(self, user_interactions, posts_data):
        # Train content-based features
        post_contents = [p['content'] for p in posts_data]
        self.content_vectors = self.content_vectorizer.fit_transform(post_contents)
        
        # Create user and post embeddings
        self._create_embeddings(user_interactions, posts_data)
        
        # Prepare training data for neural network
        X_user, X_post, y = self._prepare_training_data(user_interactions)
        
        # Train neural network
        self.model.fit(
            [X_user, X_post],
            y,
            epochs=10,
            batch_size=32,
            validation_split=0.2
        )
        
        # Save the model
        self.save_model()
    
    def _create_embeddings(self, user_interactions, posts_data):
        # Create post embeddings using content vectors
        for i, post in enumerate(posts_data):
            self.post_embeddings[post['id']] = self.content_vectors[i].toarray()[0][:100]
        
        # Create user embeddings based on interaction history
        for user_id in set(ui['userId'] for ui in user_interactions):
            user_posts = [
                ui['postId'] for ui in user_interactions 
                if ui['userId'] == user_id
            ]
            if user_posts:
                user_vector = np.mean([
                    self.post_embeddings[post_id] 
                    for post_id in user_posts 
                    if post_id in self.post_embeddings
                ], axis=0)
                self.user_embeddings[user_id] = user_vector
    
    def _prepare_training_data(self, user_interactions):
        X_user = []
        X_post = []
        y = []
        
        for ui in user_interactions:
            if ui['userId'] in self.user_embeddings and ui['postId'] in self.post_embeddings:
                X_user.append(self.user_embeddings[ui['userId']])
                X_post.append(self.post_embeddings[ui['postId']])
                y.append(1)  # Positive interaction
                
                # Add negative samples
                for _ in range(3):  # 3 negative samples per positive
                    random_post = np.random.choice(list(self.post_embeddings.keys()))
                    if random_post != ui['postId']:
                        X_user.append(self.user_embeddings[ui['userId']])
                        X_post.append(self.post_embeddings[random_post])
                        y.append(0)  # Negative interaction
        
        return np.array(X_user), np.array(X_post), np.array(y)
    
    def get_recommendations(self, user_id, posts_data, n=10):
        if user_id not in self.user_embeddings:
            # Cold start: return popular posts
            return self._get_popular_posts(posts_data, n)
        
        user_vector = self.user_embeddings[user_id]
        scores = []
        
        for post in posts_data:
            if post['id'] in self.post_embeddings:
                post_vector = self.post_embeddings[post['id']]
                score = self.model.predict(
                    [user_vector.reshape(1, -1), post_vector.reshape(1, -1)]
                )[0][0]
                scores.append((post, score))
        
        # Sort by score and return top N
        scores.sort(key=lambda x: x[1], reverse=True)
        return [post for post, _ in scores[:n]]
    
    def _get_popular_posts(self, posts_data, n=10):
        # Simple popularity-based recommendation for cold start
        return sorted(
            posts_data,
            key=lambda x: x['engagement_score'],
            reverse=True
        )[:n]
    
    def save_model(self):
        # Save neural network
        self.model.save(self.model_path)
        
        # Save vectorizer and embeddings
        with open(f'{self.model_path}_vectorizer.pkl', 'wb') as f:
            pickle.dump(self.content_vectorizer, f)
        
        with open(f'{self.model_path}_embeddings.pkl', 'wb') as f:
            pickle.dump({
                'user_embeddings': self.user_embeddings,
                'post_embeddings': self.post_embeddings
            }, f)
    
    def load_model(self):
        if os.path.exists(self.model_path):
            # Load neural network
            self.model = tf.keras.models.load_model(self.model_path)
            
            # Load vectorizer and embeddings
            with open(f'{self.model_path}_vectorizer.pkl', 'rb') as f:
                self.content_vectorizer = pickle.load(f)
            
            with open(f'{self.model_path}_embeddings.pkl', 'rb') as f:
                embeddings = pickle.load(f)
                self.user_embeddings = embeddings['user_embeddings']
                self.post_embeddings = embeddings['post_embeddings']
            return True
        return False
