import logging
import logging.handlers
import os
from datetime import datetime
from typing import Optional
from fastapi import Request
from shared.state.session_manager import session

class RequestContextFilter(logging.Filter):
    def filter(self, record):
        record.user = session.get_user_name()
        record.device_id = session.get_flag("device_id")
        return True

def setup_logging(
    log_level: str = "INFO",
    log_dir: str = "logs",
    app_name: str = "hyphaeos"
) -> None:
    """Configure application-wide logging"""
    
    # Create logs directory if it doesn't exist
    os.makedirs(log_dir, exist_ok=True)

    # Base log filename with date
    log_file = f"{log_dir}/{app_name}_{datetime.now().strftime('%Y%m%d')}.log"

    # Formatter with extra context
    formatter = logging.Formatter(
        '[%(asctime)s] [%(levelname)s] [%(name)s] '
        '(user=%(user)s device=%(device_id)s) %(message)s'
    )

    # File handler with rotation
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10485760,  # 10MB
        backupCount=10
    )
    file_handler.setFormatter(formatter)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)

    # Root logger configuration
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level.upper()))
    root_logger.addHandler(file_handler)
    root_logger.addHandler(console_handler)

    # Add request context filter
    context_filter = RequestContextFilter()
    root_logger.addFilter(context_filter)

    # Set levels for specific loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("sqlalchemy.engine").setLevel(logging.WARNING)

def get_request_log_context(request: Optional[Request] = None) -> dict:
    """Get contextual information for request logging"""
    context = {
        "user": session.get_user_name(),
        "device_id": session.get_flag("device_id")
    }
    
    if request:
        context.update({
            "method": request.method,
            "path": request.url.path,
            "ip": request.client.host if request.client else None,
        })
    
    return context