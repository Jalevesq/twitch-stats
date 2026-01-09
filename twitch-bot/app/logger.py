import logging
import sys
from config import LOG_LEVEL

def setup_logger(level: str = "INFO") -> logging.Logger:
    logger = logging.getLogger("twitch-bot")
    logger.setLevel(getattr(logging, level.upper()))

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(logging.Formatter(
        "%(asctime)s | %(levelname)-8s | %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    ))

    logger.addHandler(handler)
    return logger


log = setup_logger(level=LOG_LEVEL)