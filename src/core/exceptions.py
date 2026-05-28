class OSBootError(Exception):
    """Exception raised when the ChainReflex-OS core engine fails to boot."""

    pass


class ConfigurationError(Exception):
    """Exception raised for errors in system configuration."""

    pass


class SecurityGuardrailViolation(Exception):
    """Exception raised when a security violation is detected."""

    pass
