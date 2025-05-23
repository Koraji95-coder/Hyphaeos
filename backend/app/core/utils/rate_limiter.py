from fastapi import HTTPException, Request
from typing import Dict, Tuple
import time
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)

class RateLimiter:
    def __init__(self, requests_per_minute: int = 60):
        self.requests_per_minute = requests_per_minute
        self.requests: Dict[str, list] = defaultdict(list)
        
    def _cleanup_old_requests(self, client_id: str):
        """Remove requests older than 1 minute"""
        current_time = time.time()
        self.requests[client_id] = [
            req_time for req_time in self.requests[client_id]
            if current_time - req_time < 60
        ]

    def check_rate_limit(self, request: Request) -> Tuple[bool, int]:
        """
        Check if request should be rate limited.
        Returns (is_allowed, requests_remaining)
        """
        client_id = request.client.host
        current_time = time.time()
        
        # Clean up old requests
        self._cleanup_old_requests(client_id)
        
        # Check current request count
        request_count = len(self.requests[client_id])
        
        if request_count >= self.requests_per_minute:
            logger.warning(f"Rate limit exceeded for {client_id}")
            return False, 0
            
        # Add new request
        self.requests[client_id].append(current_time)
        remaining = self.requests_per_minute - len(self.requests[client_id])
        
        return True, remaining

rate_limiter = RateLimiter()

async def rate_limit_middleware(request: Request, call_next):
    """Middleware to enforce rate limiting"""
    is_allowed, remaining = rate_limiter.check_rate_limit(request)
    
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail="Too many requests. Please try again later."
        )
    
    response = await call_next(request)
    response.headers["X-RateLimit-Remaining"] = str(remaining)
    return response