from fastapi import HTTPException, Request
from typing import Dict, Tuple, Optional
import time
import logging
from collections import defaultdict
import redis
from shared.config.env_loader import get_env_variable

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self):
        self.redis = redis.Redis(
            host=get_env_variable("REDIS_HOST", "localhost"),
            port=int(get_env_variable("REDIS_PORT", "6379")),
            db=0,
            decode_responses=True
        )
        
        # Default limits per minute
        self.default_limits = {
            "GET": 120,
            "POST": 60,
            "PUT": 60,
            "DELETE": 30
        }
        
        # Special endpoint limits
        self.endpoint_limits = {
            "/api/chain/execute": 30,
            "/api/neuroweave/ask": 40,
            "/api/rootbloom/generate": 40
        }
        
    def _get_key(self, client_id: str, method: str, endpoint: str) -> str:
        """Generate Redis key for rate limiting"""
        return f"ratelimit:{client_id}:{method}:{endpoint}"
        
    def check_rate_limit(self, request: Request) -> Tuple[bool, int]:
        """
        Check if request should be rate limited.
        Returns (is_allowed, requests_remaining)
        """
        client_id = request.client.host
        method = request.method
        endpoint = request.url.path
        
        # Get appropriate limit
        limit = self.endpoint_limits.get(endpoint, self.default_limits.get(method, 60))
        
        # Generate key
        key = self._get_key(client_id, method, endpoint)
        
        try:
            # Use Redis for tracking
            current = self.redis.incr(key)
            
            # Set expiry on first request
            if current == 1:
                self.redis.expire(key, 60)  # 60 second window
                
            if current > limit:
                logger.warning(f"Rate limit exceeded for {client_id} on {method} {endpoint}")
                return False, 0
                
            remaining = limit - current
            return True, remaining
            
        except redis.RedisError as e:
            logger.error(f"Redis error in rate limiter: {e}")
            # Fallback to allowing request
            return True, 0

rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    """Middleware to enforce rate limiting"""
    is_allowed, remaining = rate_limiter.check_rate_limit(request)
    
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Too many requests",
                "retry_after": "60 seconds"
            }
        )
    
    response = await call_next(request)
    
    # Add rate limit headers
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    response.headers["X-RateLimit-Reset"] = str(int(time.time()) + 60)
    
    return response